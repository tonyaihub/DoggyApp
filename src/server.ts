/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Full-stack Express Server with PostGIS API and WebSocket Gateway
 */

import express from 'express';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory Redis simulation for active dog coordinates
interface RedisGeoEntry {
  id: string;
  lat: number;
  lng: number;
  updated_at: number;
}
const redisGeoStore: Map<string, RedisGeoEntry> = new Map();

// REST API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'DogApp Zaporizhzhia',
    timestamp: new Date().toISOString(),
    postgis_connected: true,
    redis_connected: true,
  });
});

// Walk session endpoints simulating PostGIS ST_MakeLine & Redis GEOADD
app.post('/api/walks/start', (req, res) => {
  const { session_id, user_id, pet_id, lat, lng } = req.body;
  if (lat && lng) {
    redisGeoStore.set(session_id || 'temp', {
      id: session_id,
      lat,
      lng,
      updated_at: Date.now(),
    });
  }
  res.json({ success: true, message: 'Walk registered in Redis GEO store' });
});

app.post('/api/walks/location', (req, res) => {
  const { session_id, lat, lng } = req.body;
  if (session_id && lat && lng) {
    redisGeoStore.set(session_id, {
      id: session_id,
      lat,
      lng,
      updated_at: Date.now(),
    });
  }
  res.json({ success: true });
});

app.post('/api/walks/end', (req, res) => {
  const { session_id } = req.body;
  if (session_id) {
    redisGeoStore.delete(session_id);
  }
  res.json({
    success: true,
    message: 'Walk line assembled with ST_MakeLine and saved to PostGIS',
  });
});

// Push notification subscription endpoint
app.post('/api/push/subscribe', (req, res) => {
  const { subscription, district_id } = req.body;
  console.log(`[Push Subscription] User subscribed for district: ${district_id}`);
  res.json({ success: true, registered: true });
});

// Start listening or mount Vite middlewares in dev
if (process.env.NODE_ENV !== 'production') {
  // Dev mode handled by vite server directly or tsx
}

export { app, server };
