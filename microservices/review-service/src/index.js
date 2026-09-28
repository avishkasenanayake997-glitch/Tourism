const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8004;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[review-service] ${req.method} ${req.url}`);
  next();
});

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY && !SUPABASE_URL.includes('dummy')) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
}

// In-memory mock reviews
const mockReviews = [
  {
    id: 'rev-1',
    user_id: 'mock-user-1',
    user_name: 'Avishka S.',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    target_type: 'destination',
    target_id: 'dest-sigiriya',
    rating: 5,
    comment: 'Sigiriya is genuinely majestic. Climbing at 7am before the heat was unforgettable!',
    images: ['https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=600&q=80'],
    created_at: '2026-09-10T10:30:00Z'
  },
  {
    id: 'rev-2',
    user_id: 'mock-user-2',
    user_name: 'Elena Rostova',
    user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    target_type: 'destination',
    target_id: 'dest-ella',
    rating: 5,
    comment: 'The train journey from Kandy to Ella through the cloud forests is the best in the world.',
    images: [],
    created_at: '2026-09-12T14:20:00Z'
  }
];

// In-memory mock favorites
const mockFavorites = [
  {
    id: 'fav-1',
    user_id: 'mock-user-1',
    target_type: 'destination',
    target_id: 'dest-sigiriya',
    created_at: new Date().toISOString()
  }
];

// Health Check
app.get('/health', (req, res) => {
  res.json({
    service: 'review-service',
    status: 'healthy',
    port: PORT,
    timestamp: new Date().toISOString(),
    databaseConnected: !!supabase
  });
});

// ==========================================
// REVIEWS
// ==========================================
app.get('/reviews', async (req, res) => {
  try {
    const { target_type, target_id } = req.query;

    if (supabase) {
      let query = supabase.from('reviews').select('*, profiles:user_id(name, avatar)').order('created_at', { ascending: false });
      if (target_type) query = query.eq('target_type', target_type);
      if (target_id) query = query.eq('target_id', target_id);

      const { data, error } = await query;
      if (!error && data) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    let results = [...mockReviews];
    if (target_type) results = results.filter((r) => r.target_type === target_type);
    if (target_id) results = results.filter((r) => r.target_id === target_id);

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/reviews', async (req, res) => {
  try {
    const { user_id, user_name, user_avatar, target_type, target_id, rating, comment, images } = req.body;

    if (!user_id || !target_type || !target_id || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: 'user_id, target_type, target_id, rating, and comment are required'
      });
    }

    const newReview = {
      id: 'rev_' + Date.now(),
      user_id,
      user_name: user_name || 'Traveler',
      user_avatar: user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      target_type,
      target_id,
      rating: Number(rating),
      comment,
      images: images || [],
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('reviews').insert([{
        user_id,
        target_type,
        target_id,
        rating: Number(rating),
        comment,
        images: images || []
      }]).select().single();

      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    mockReviews.unshift(newReview);
    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// FAVORITES
// ==========================================
app.get('/favorites', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (supabase) {
      let query = supabase.from('favorites').select('*');
      if (user_id) query = query.eq('user_id', user_id);

      const { data, error } = await query;
      if (!error && data) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    let results = [...mockFavorites];
    if (user_id) results = results.filter((f) => f.user_id === user_id);
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/favorites', async (req, res) => {
  try {
    const { user_id, target_type, target_id } = req.body;
    if (!user_id || !target_type || !target_id) {
      return res.status(400).json({ success: false, error: 'user_id, target_type, and target_id are required' });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('favorites')
        .upsert([{ user_id, target_type, target_id }])
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    const exists = mockFavorites.find((f) => f.user_id === user_id && f.target_type === target_type && f.target_id === target_id);
    if (!exists) {
      const newFav = { id: 'fav_' + Date.now(), user_id, target_type, target_id, created_at: new Date().toISOString() };
      mockFavorites.push(newFav);
      return res.status(201).json({ success: true, data: newFav });
    }

    res.json({ success: true, data: exists });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/favorites', async (req, res) => {
  try {
    const { user_id, target_type, target_id } = req.body;

    if (supabase) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user_id)
        .eq('target_type', target_type)
        .eq('target_id', target_id);
      if (error) throw error;
      return res.json({ success: true, message: 'Favorite removed' });
    }

    const index = mockFavorites.findIndex(
      (f) => f.user_id === user_id && f.target_type === target_type && f.target_id === target_id
    );
    if (index !== -1) {
      mockFavorites.splice(index, 1);
    }
    res.json({ success: true, message: 'Favorite removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[review-service] running on http://localhost:${PORT}`);
});
