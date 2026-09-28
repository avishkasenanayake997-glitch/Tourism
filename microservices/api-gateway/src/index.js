const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

// Microservice backend URLs (can be overridden by environment variables in Docker)
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:8001';
const PLACES_SERVICE_URL = process.env.PLACES_SERVICE_URL || 'http://localhost:8002';
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || 'http://localhost:8003';
const REVIEW_SERVICE_URL = process.env.REVIEW_SERVICE_URL || 'http://localhost:8004';
const ITINERARY_SERVICE_URL = process.env.ITINERARY_SERVICE_URL || 'http://localhost:8005';

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[api-gateway] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Gateway Root info
app.get('/', (req, res) => {
  res.json({
    name: 'Lankora Tourism Platform - Microservices API Gateway',
    version: '1.0.0',
    documentation: 'See README.md for endpoint references',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      places: '/api/places/*',
      destinations: '/api/destinations/*',
      experiences: '/api/experiences/*',
      restaurants: '/api/restaurants/*',
      stays: '/api/stays/*',
      bookings: '/api/bookings/*',
      reviews: '/api/reviews/*',
      favorites: '/api/favorites/*',
      trips: '/api/trips/*',
      ai: '/api/ai/*'
    }
  });
});

// Aggregated Cluster Health Check
app.get('/api/health', async (req, res) => {
  const services = [
    { name: 'auth-service', url: `${AUTH_SERVICE_URL}/health` },
    { name: 'places-service', url: `${PLACES_SERVICE_URL}/health` },
    { name: 'booking-service', url: `${BOOKING_SERVICE_URL}/health` },
    { name: 'review-service', url: `${REVIEW_SERVICE_URL}/health` },
    { name: 'itinerary-service', url: `${ITINERARY_SERVICE_URL}/health` }
  ];

  const checks = await Promise.all(
    services.map(async (svc) => {
      const start = Date.now();
      try {
        const response = await fetch(svc.url, { signal: AbortSignal.timeout(2000) });
        const data = await response.json();
        return {
          service: svc.name,
          status: response.ok ? 'online' : 'degraded',
          latency: `${Date.now() - start}ms`,
          details: data
        };
      } catch (err) {
        return {
          service: svc.name,
          status: 'offline',
          latency: `${Date.now() - start}ms`,
          error: err.message
        };
      }
    })
  );

  const allOnline = checks.every((s) => s.status === 'online');

  res.status(allOnline ? 200 : 207).json({
    gateway: 'healthy',
    timestamp: new Date().toISOString(),
    overallStatus: allOnline ? 'all_systems_operational' : 'partial_outage',
    services: checks
  });
});

// ==========================================
// PROXY ROUTES
// ==========================================

// 1. Auth Service Routes
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '' }
  })
);

// 2. Places Service Routes
app.use(
  ['/api/destinations', '/api/places', '/api/experiences', '/api/restaurants', '/api/stays'],
  createProxyMiddleware({
    target: PLACES_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api': ''
    }
  })
);

// 3. Booking Service Routes
app.use(
  '/api/bookings',
  createProxyMiddleware({
    target: BOOKING_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api': '' }
  })
);

// 4. Review & Favorites Service Routes
app.use(
  ['/api/reviews', '/api/favorites'],
  createProxyMiddleware({
    target: REVIEW_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api': '' }
  })
);

// 5. Itinerary & AI Planner Service Routes
app.use(
  ['/api/trips', '/api/ai'],
  createProxyMiddleware({
    target: ITINERARY_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api': '' }
  })
);

app.listen(PORT, () => {
  console.log(`[api-gateway] Central Gateway running on http://localhost:${PORT}`);
  console.log(`[api-gateway] Routes mapped:`);
  console.log(`  /api/auth/*         -> ${AUTH_SERVICE_URL}`);
  console.log(`  /api/destinations/* -> ${PLACES_SERVICE_URL}`);
  console.log(`  /api/places/*       -> ${PLACES_SERVICE_URL}`);
  console.log(`  /api/experiences/*  -> ${PLACES_SERVICE_URL}`);
  console.log(`  /api/restaurants/*  -> ${PLACES_SERVICE_URL}`);
  console.log(`  /api/stays/*        -> ${PLACES_SERVICE_URL}`);
  console.log(`  /api/bookings/*     -> ${BOOKING_SERVICE_URL}`);
  console.log(`  /api/reviews/*      -> ${REVIEW_SERVICE_URL}`);
  console.log(`  /api/favorites/*    -> ${REVIEW_SERVICE_URL}`);
  console.log(`  /api/trips/*        -> ${ITINERARY_SERVICE_URL}`);
  console.log(`  /api/ai/*           -> ${ITINERARY_SERVICE_URL}`);
});
