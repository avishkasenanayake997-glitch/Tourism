const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { DESTINATIONS, PLACES, EXPERIENCES, RESTAURANTS, STAYS } = require('./mockData');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8002;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[places-service] ${req.method} ${req.url}`);
  next();
});

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY && !SUPABASE_URL.includes('dummy')) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Health Check
app.get('/health', (req, res) => {
  res.json({
    service: 'places-service',
    status: 'healthy',
    port: PORT,
    timestamp: new Date().toISOString(),
    databaseConnected: !!supabase
  });
});

// ==========================================
// DESTINATIONS
// ==========================================
app.get('/destinations', async (req, res) => {
  try {
    const { category, featured, hidden_gem, search } = req.query;

    if (supabase) {
      let query = supabase.from('destinations').select('*').order('rating', { ascending: false });
      if (category) query = query.eq('category', category);
      if (featured === 'true') query = query.eq('is_featured', true);
      if (hidden_gem === 'true') query = query.eq('is_hidden_gem', true);
      if (search) query = query.ilike('name', `%${search}%`);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    let results = [...DESTINATIONS];
    if (category) results = results.filter((d) => d.category.toLowerCase() === category.toLowerCase());
    if (featured === 'true') results = results.filter((d) => d.is_featured);
    if (hidden_gem === 'true') results = results.filter((d) => d.is_hidden_gem);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((d) => d.name.toLowerCase().includes(q) || d.short_description.toLowerCase().includes(q));
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/destinations/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    if (supabase) {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .maybeSingle();
      if (!error && data) {
        return res.json({ success: true, data });
      }
    }

    const item = DESTINATIONS.find((d) => d.id === idOrSlug || d.slug === idOrSlug) || DESTINATIONS[0];
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// PLACES
// ==========================================
app.get('/places', async (req, res) => {
  try {
    const { destination_id, category } = req.query;

    if (supabase) {
      let query = supabase.from('places').select('*');
      if (destination_id) query = query.eq('destination_id', destination_id);
      if (category) query = query.eq('category', category);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    let results = [...PLACES];
    if (destination_id) results = results.filter((p) => p.destination_id === destination_id);
    if (category) results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/places/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (supabase) {
      const { data, error } = await supabase.from('places').select('*').eq('id', id).maybeSingle();
      if (!error && data) return res.json({ success: true, data });
    }

    const item = PLACES.find((p) => p.id === id) || PLACES[0];
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// EXPERIENCES
// ==========================================
app.get('/experiences', async (req, res) => {
  try {
    const { destination_id, category } = req.query;

    if (supabase) {
      let query = supabase.from('experiences').select('*');
      if (destination_id) query = query.eq('destination_id', destination_id);
      if (category) query = query.eq('category', category);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    let results = [...EXPERIENCES];
    if (destination_id) results = results.filter((e) => e.destination_id === destination_id);
    if (category) results = results.filter((e) => e.category.toLowerCase() === category.toLowerCase());

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// RESTAURANTS & STAYS
// ==========================================
app.get('/restaurants', async (req, res) => {
  try {
    const { destination_id } = req.query;
    if (supabase) {
      let query = supabase.from('restaurants').select('*');
      if (destination_id) query = query.eq('destination_id', destination_id);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    let results = [...RESTAURANTS];
    if (destination_id) results = results.filter((r) => r.destination_id === destination_id);
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/stays', async (req, res) => {
  try {
    const { destination_id } = req.query;
    if (supabase) {
      let query = supabase.from('stays').select('*');
      if (destination_id) query = query.eq('destination_id', destination_id);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    let results = [...STAYS];
    if (destination_id) results = results.filter((s) => s.destination_id === destination_id);
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[places-service] running on http://localhost:${PORT}`);
});
