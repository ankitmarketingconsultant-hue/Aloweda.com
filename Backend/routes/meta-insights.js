const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const PIXEL_ID = process.env.META_PIXEL_ID || '1130650692951273';
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const GRAPH_API_VERSION = 'v21.0';

// GET /api/meta-insights/events?since=YYYY-MM-DD&until=YYYY-MM-DD
router.get('/events', auth, admin, async (req, res) => {
  try {
    if (!ACCESS_TOKEN) {
      return res.status(400).json({ success: false, message: 'META_ACCESS_TOKEN not configured' });
    }

    // Default: last 28 days
    const until = req.query.until || new Date().toISOString().split('T')[0];
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - (req.query.days ? parseInt(req.query.days) : 28));
    const since = req.query.since || sinceDate.toISOString().split('T')[0];

    // Fetch pixel events stats from Meta Graph API
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/stats` +
      `?start_time=${since}&end_time=${until}` +
      `&aggregation=event` +
      `&access_token=${ACCESS_TOKEN}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('Meta API error:', data.error);
      return res.status(400).json({ success: false, message: data.error.message, error: data.error });
    }

    // Parse events into clean format
    const events = {};
    if (data.data) {
      data.data.forEach(item => {
        events[item.event] = {
          count: item.count,
          lastReceived: item.last_fired_time || null,
        };
      });
    }

    res.json({
      success: true,
      pixelId: PIXEL_ID,
      since,
      until,
      events,
      raw: data.data || [],
    });
  } catch (err) {
    console.error('Meta insights error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/meta-insights/daily?days=7
router.get('/daily', auth, admin, async (req, res) => {
  try {
    if (!ACCESS_TOKEN) {
      return res.status(400).json({ success: false, message: 'META_ACCESS_TOKEN not configured' });
    }

    const days = parseInt(req.query.days) || 7;
    const until = new Date().toISOString().split('T')[0];
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);
    const since = sinceDate.toISOString().split('T')[0];

    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/stats` +
      `?start_time=${since}&end_time=${until}` +
      `&aggregation=event` +
      `&by_time_increment=1` +
      `&access_token=${ACCESS_TOKEN}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ success: false, message: data.error.message });
    }

    res.json({
      success: true,
      since,
      until,
      daily: data.data || [],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
