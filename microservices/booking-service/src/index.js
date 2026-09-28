const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8003;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[booking-service] ${req.method} ${req.url}`);
  next();
});

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY && !SUPABASE_URL.includes('dummy')) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
}

// In-memory mock storage
const mockBookings = [
  {
    id: 'booking-sample-1',
    user_id: 'mock-user-1',
    target_type: 'stay',
    target_id: 'stay-water-garden',
    title: 'Water Garden Sigiriya Villa Stay',
    booking_date: '2026-10-15',
    end_date: '2026-10-18',
    time_slot: 'Check-in: 02:00 PM',
    guests: 2,
    total_price: 450.00,
    currency: 'USD',
    status: 'confirmed',
    payment_status: 'paid',
    contact_phone: '+94 77 123 4567',
    contact_email: 'avishka@example.com',
    created_at: new Date().toISOString()
  },
  {
    id: 'booking-sample-2',
    user_id: 'mock-user-1',
    target_type: 'experience',
    target_id: 'exp-yala-safari',
    title: 'Dawn Leopard & Sloth Bear 4x4 Safari',
    booking_date: '2026-10-20',
    time_slot: '05:30 AM - 10:30 AM',
    guests: 2,
    total_price: 150.00,
    currency: 'USD',
    status: 'confirmed',
    payment_status: 'paid',
    contact_phone: '+94 77 123 4567',
    contact_email: 'avishka@example.com',
    created_at: new Date().toISOString()
  }
];

// Health Check
app.get('/health', (req, res) => {
  res.json({
    service: 'booking-service',
    status: 'healthy',
    port: PORT,
    timestamp: new Date().toISOString(),
    databaseConnected: !!supabase
  });
});

// Get user bookings
app.get('/bookings', async (req, res) => {
  try {
    const { user_id, status } = req.query;

    if (supabase) {
      let query = supabase.from('bookings').select('*').order('booking_date', { ascending: true });
      if (user_id) query = query.eq('user_id', user_id);
      if (status) query = query.eq('status', status);

      const { data, error } = await query;
      if (!error && data) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    let results = [...mockBookings];
    if (user_id) results = results.filter((b) => b.user_id === user_id);
    if (status) results = results.filter((b) => b.status === status);

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get booking by ID
app.get('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { data, error } = await supabase.from('bookings').select('*').eq('id', id).maybeSingle();
      if (!error && data) return res.json({ success: true, data });
    }

    const item = mockBookings.find((b) => b.id === id);
    if (!item) return res.status(404).json({ success: false, error: 'Booking not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new booking
app.post('/bookings', async (req, res) => {
  try {
    const {
      user_id,
      target_type,
      target_id,
      title,
      booking_date,
      end_date,
      time_slot,
      guests,
      total_price,
      currency,
      contact_phone,
      contact_email,
      special_requests
    } = req.body;

    if (!user_id || !target_type || !target_id || !booking_date) {
      return res.status(400).json({
        success: false,
        error: 'user_id, target_type, target_id, and booking_date are required'
      });
    }

    const newBooking = {
      id: 'bk_' + Date.now(),
      user_id,
      target_type,
      target_id,
      title: title || 'Reservation',
      booking_date,
      end_date: end_date || null,
      time_slot: time_slot || null,
      guests: guests || 1,
      total_price: total_price || 0,
      currency: currency || 'USD',
      status: 'confirmed',
      payment_status: 'paid',
      special_requests: special_requests || null,
      contact_phone: contact_phone || null,
      contact_email: contact_email || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('bookings').insert([newBooking]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    mockBookings.push(newBooking);
    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update booking status / details
app.patch('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.json({ success: true, data });
    }

    const index = mockBookings.findIndex((b) => b.id === id);
    if (index === -1) return res.status(404).json({ success: false, error: 'Booking not found' });

    mockBookings[index] = { ...mockBookings[index], ...updates, updated_at: new Date().toISOString() };
    res.json({ success: true, data: mockBookings[index] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cancel booking
app.delete('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true, message: 'Booking cancelled' });
    }

    const index = mockBookings.findIndex((b) => b.id === id);
    if (index !== -1) {
      mockBookings.splice(index, 1);
    }
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[booking-service] running on http://localhost:${PORT}`);
});
