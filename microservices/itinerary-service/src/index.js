const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8005;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[itinerary-service] ${req.method} ${req.url}`);
  next();
});

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY && !SUPABASE_URL.includes('dummy')) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
}

// In-memory mock trips
const mockTrips = [
  {
    id: 'trip-1',
    user_id: 'mock-user-1',
    title: 'Highlands & Safari Expedition',
    start_date: '2026-10-14',
    end_date: '2026-10-21',
    description: '7-day adventure exploring Sigiriya, Ella tea hills, and Yala wildlife.',
    cover_image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
    destinations: ['Sigiriya', 'Ella', 'Yala'],
    travel_style: 'Adventure & Nature',
    status: 'planning',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockItems = [
  {
    id: 'item-1',
    trip_id: 'trip-1',
    target_type: 'place',
    target_id: 'place-sigiriya-rock',
    title: 'Climb Sigiriya Lion Rock Fortress',
    day_number: 1,
    start_time: '07:00 AM',
    end_time: '10:30 AM',
    location: 'Sigiriya',
    notes: 'Buy tickets at the main entrance, carry 1.5L water.',
    order_index: 0
  },
  {
    id: 'item-2',
    trip_id: 'trip-1',
    target_type: 'restaurant',
    target_id: 'rest-cafe-chill',
    title: 'Lunch & Fresh King Coconut at Cafe Chill',
    day_number: 2,
    start_time: '12:30 PM',
    end_time: '02:00 PM',
    location: 'Ella',
    notes: 'Try the Lamprais in banana leaf.',
    order_index: 1
  }
];

// Health Check
app.get('/health', (req, res) => {
  res.json({
    service: 'itinerary-service',
    status: 'healthy',
    port: PORT,
    timestamp: new Date().toISOString(),
    databaseConnected: !!supabase
  });
});

// Trips list
app.get('/trips', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (supabase) {
      let query = supabase.from('trips').select('*').order('start_date', { ascending: true });
      if (user_id) query = query.eq('user_id', user_id);

      const { data, error } = await query;
      if (!error && data) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    let results = [...mockTrips];
    if (user_id) results = results.filter((t) => t.user_id === user_id);
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Trip by ID (with itinerary items)
app.get('/trips/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { data: trip, error: tripErr } = await supabase.from('trips').select('*').eq('id', id).single();
      if (!tripErr && trip) {
        const { data: items } = await supabase
          .from('itinerary_items')
          .select('*')
          .eq('trip_id', id)
          .order('day_number', { ascending: true })
          .order('order_index', { ascending: true });

        return res.json({ success: true, data: { ...trip, items: items || [] } });
      }
    }

    const trip = mockTrips.find((t) => t.id === id);
    if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });

    const items = mockItems.filter((i) => i.trip_id === id);
    res.json({ success: true, data: { ...trip, items } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create Trip
app.post('/trips', async (req, res) => {
  try {
    const { user_id, title, start_date, end_date, description, cover_image, destinations, travel_style } = req.body;

    if (!user_id || !title || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        error: 'user_id, title, start_date, and end_date are required'
      });
    }

    const newTrip = {
      id: 'trip_' + Date.now(),
      user_id,
      title,
      start_date,
      end_date,
      description: description || 'Exploring Sri Lanka',
      cover_image: cover_image || 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
      destinations: destinations || [],
      travel_style: travel_style || 'Discovery',
      status: 'planning',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('trips').insert([newTrip]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    mockTrips.unshift(newTrip);
    res.status(201).json({ success: true, data: newTrip });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add Item to Trip
app.post('/trips/:id/items', async (req, res) => {
  try {
    const { id } = req.params;
    const { target_type, target_id, title, day_number, start_time, end_time, notes, location, order_index } = req.body;

    if (!title || !day_number) {
      return res.status(400).json({ success: false, error: 'title and day_number are required' });
    }

    const newItem = {
      id: 'item_' + Date.now(),
      trip_id: id,
      target_type: target_type || 'custom',
      target_id: target_id || null,
      title,
      day_number: Number(day_number),
      start_time: start_time || null,
      end_time: end_time || null,
      notes: notes || null,
      location: location || null,
      order_index: order_index || 0,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('itinerary_items').insert([newItem]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    mockItems.push(newItem);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// AI ITINERARY GENERATOR SERVICE
// ==========================================
app.post('/ai/generate-itinerary', (req, res) => {
  try {
    const {
      destination = 'Sri Lanka Circuit',
      days = 5,
      travel_style = 'Culture & Nature',
      pace = 'Moderate',
      dietary = []
    } = req.body;

    const daysCount = Math.min(Math.max(Number(days) || 3, 1), 14);

    // AI itinerary generator templates tailored to Sri Lankan travel paths
    const templates = [
      {
        day: 1,
        title: 'Arrival & Cultural Heartland',
        region: 'Sigiriya & Dambulla',
        activities: [
          { time: '07:30 AM', title: 'Ascend Sigiriya Lion Rock Fortress', type: 'place', duration: '3h' },
          { time: '01:00 PM', title: 'Traditional Village Lunch cooked in clay pots', type: 'restaurant', duration: '1.5h' },
          { time: '04:30 PM', title: 'Sunset panorama hike at Pidurangala Rock', type: 'place', duration: '2h' }
        ],
        eveningTip: 'Stargaze under clear rural skies and rest early.'
      },
      {
        day: 2,
        title: 'Sacred Relics & Royal Gardens',
        region: 'Kandy & Peradeniya',
        activities: [
          { time: '09:00 AM', title: 'Visit Temple of the Sacred Tooth Relic (Sri Dalada Maligawa)', type: 'place', duration: '2h' },
          { time: '12:30 PM', title: 'Ceylon Spices and Street Food lunch by Kandy Lake', type: 'restaurant', duration: '1h' },
          { time: '03:00 PM', title: 'Stroll through Royal Botanical Gardens Peradeniya', type: 'place', duration: '2.5h' }
        ],
        eveningTip: 'Attend a cultural Kandyan fire-walking dance performance.'
      },
      {
        day: 3,
        title: 'The Great Highland Train & Cloud Forests',
        region: 'Nuwara Eliya & Ella',
        activities: [
          { time: '08:45 AM', title: 'Iconic Scenic Blue Train Journey over mountain bridges', type: 'experience', duration: '3.5h' },
          { time: '01:30 PM', title: 'Artisanal burgers & fresh passion fruit juice at Cafe Chill', type: 'restaurant', duration: '1.5h' },
          { time: '04:00 PM', title: 'Hike to the Nine Arches Viaduct Bridge for sunset train', type: 'place', duration: '2h' }
        ],
        eveningTip: 'Enjoy live acoustic music along Ella’s lively cafe strip.'
      },
      {
        day: 4,
        title: 'Untamed Safari & Wildlife Tracking',
        region: 'Yala / Udawalawe',
        activities: [
          { time: '05:30 AM', title: 'Dawn 4x4 Leopard and Elephant Safari in Yala National Park', type: 'experience', duration: '5h' },
          { time: '01:00 PM', title: 'Curd & Kithul Treacle tasting at roadside rustic pottery stall', type: 'restaurant', duration: '1h' },
          { time: '04:30 PM', title: 'Sundowner drinks overlooking tranquil coastal dunes', type: 'place', duration: '2h' }
        ],
        eveningTip: 'Keep eyes peeled for wild elephants near park perimeter.'
      },
      {
        day: 5,
        title: 'Golden Sands, Colonial Forts & Ocean Sunset',
        region: 'Mirissa & Galle Fort',
        activities: [
          { time: '06:30 AM', title: 'Blue Whale & Dolphin Watching catamaran cruise', type: 'experience', duration: '4h' },
          { time: '01:00 PM', title: 'Grilled jumbo prawns & coconut curry by Mirissa bay', type: 'restaurant', duration: '1.5h' },
          { time: '04:30 PM', title: 'Sunset walk on the ramparts of UNESCO Galle Dutch Fort', type: 'place', duration: '2.5h' }
        ],
        eveningTip: 'Dine inside cobblestone colonial ramparts with gelato.'
      }
    ];

    const generatedDays = [];
    for (let i = 0; i < daysCount; i++) {
      const template = templates[i % templates.length];
      generatedDays.push({
        day_number: i + 1,
        title: `Day ${i + 1}: ${template.title}`,
        region: template.region,
        activities: template.activities,
        evening_tip: template.eveningTip,
        pace,
        dietary_recommendation: dietary.length > 0 ? `Customized for: ${dietary.join(', ')}` : 'Savor authentic Sri Lankan hopper and kottu staples.'
      });
    }

    res.json({
      success: true,
      data: {
        destination,
        travel_style,
        pace,
        total_days: daysCount,
        title: `${daysCount}-Day ${travel_style} Circuit of ${destination}`,
        summary: `A curated ${daysCount}-day itinerary balanced for ${pace.toLowerCase()} pace, taking you from misty mountain ranges to ancient citadels and golden coastlines.`,
        days: generatedDays
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[itinerary-service] running on http://localhost:${PORT}`);
});
