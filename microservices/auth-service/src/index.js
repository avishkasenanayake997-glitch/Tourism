const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[auth-service] ${req.method} ${req.url}`);
  next();
});

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY && !SUPABASE_URL.includes('dummy')) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
}

// In-memory fallback mock profiles
const mockProfiles = new Map([
  [
    'mock-user-1',
    {
      id: 'mock-user-1',
      name: 'Avishka Senanayake',
      email: 'avishka@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Exploring every corner of the Pearl of the Indian Ocean.',
      travel_preferences: {
        travel_style: ['Culture', 'Wildlife', 'Adventure'],
        pace: 'Moderate',
        dietary: ['Vegetarian Friendly']
      },
      home_country: 'Sri Lanka',
      created_at: new Date().toISOString()
    }
  ]
]);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    service: 'auth-service',
    status: 'healthy',
    port: PORT,
    timestamp: new Date().toISOString(),
    databaseConnected: !!supabase
  });
});

// Register
app.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name || 'Lankora Explorer' }
        }
      });
      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    // Mock register
    const newUserId = 'user_' + Date.now();
    const newProfile = {
      id: newUserId,
      name: name || 'Lankora Explorer',
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      bio: 'New traveler exploring Sri Lanka.',
      travel_preferences: { travel_style: ['Culture', 'Nature'], pace: 'Moderate', dietary: [] },
      home_country: 'Traveler',
      created_at: new Date().toISOString()
    };
    mockProfiles.set(newUserId, newProfile);

    res.status(201).json({
      success: true,
      data: {
        user: { id: newUserId, email },
        profile: newProfile,
        token: `mock_jwt_token_${newUserId}`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return res.json({ success: true, data });
    }

    // Mock login
    const user = Array.from(mockProfiles.values()).find((u) => u.email === email) || {
      id: 'mock-user-1',
      name: 'Avishka Senanayake',
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Exploring every corner of Sri Lanka.',
      travel_preferences: { travel_style: ['Culture', 'Nature'], pace: 'Moderate', dietary: [] },
      home_country: 'Sri Lanka'
    };

    res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email },
        profile: user,
        token: `mock_jwt_token_${user.id}`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Profile
app.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (supabase) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (error) throw error;
      return res.json({ success: true, data });
    }

    const profile = mockProfiles.get(id) || mockProfiles.get('mock-user-1');
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update Profile
app.put('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.json({ success: true, data });
    }

    const current = mockProfiles.get(id) || mockProfiles.get('mock-user-1');
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
    mockProfiles.set(id, updated);

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update Preferences
app.put('/profile/:id/preferences', async (req, res) => {
  try {
    const { id } = req.params;
    const { travel_preferences } = req.body;

    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ travel_preferences, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.json({ success: true, data });
    }

    const current = mockProfiles.get(id) || mockProfiles.get('mock-user-1');
    current.travel_preferences = travel_preferences;
    mockProfiles.set(id, current);

    res.json({ success: true, data: current });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[auth-service] running on http://localhost:${PORT}`);
});
