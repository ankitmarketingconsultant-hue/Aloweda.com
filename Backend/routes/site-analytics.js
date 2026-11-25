const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const PageView = require('../models/PageView');

// POST /api/site-analytics/track  — called from frontend on every page load (no auth needed)
router.post('/track', async (req, res) => {
  try {
    const { page, referrer, utmSource, utmMedium, utmCampaign, sessionId } = req.body;
    const userAgent = req.headers['user-agent'] || '';

    await PageView.create({
      page:        page        || '/',
      referrer:    referrer    || '',
      utmSource:   utmSource   || '',
      utmMedium:   utmMedium   || '',
      utmCampaign: utmCampaign || '',
      userAgent,
      sessionId:   sessionId  || '',
    });

    res.json({ success: true });
  } catch (err) {
    // Silent fail — tracking should never break anything
    res.json({ success: false });
  }
});

// GET /api/site-analytics/summary?days=30  — admin only
router.get('/summary', auth, admin, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [
      totalPageViews,
      uniqueSessions,
      dailyData,
      topPages,
      topSources,
      realtimeViews,
    ] = await Promise.all([

      // Total page views
      PageView.countDocuments({ timestamp: { $gte: since } }),

      // Unique sessions (approximate unique visitors)
      PageView.distinct('sessionId', { timestamp: { $gte: since }, sessionId: { $ne: '' } }).then(r => r.length),

      // Daily page views — last N days
      PageView.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            views: { $sum: 1 },
            sessions: { $addToSet: '$sessionId' },
        }},
        { $sort: { _id: 1 } },
        { $project: { date: '$_id', views: 1, visitors: { $size: '$sessions' }, _id: 0 } },
      ]),

      // Top pages
      PageView.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: { _id: '$page', views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 10 },
        { $project: { page: '$_id', views: 1, _id: 0 } },
      ]),

      // Traffic sources
      PageView.aggregate([
        { $match: { timestamp: { $gte: since }, utmSource: { $ne: '' } } },
        { $group: { _id: '$utmSource', visits: { $sum: 1 } } },
        { $sort: { visits: -1 } },
        { $limit: 8 },
        { $project: { source: '$_id', visits: 1, _id: 0 } },
      ]),

      // Realtime — last 30 minutes
      PageView.countDocuments({ timestamp: { $gte: new Date(Date.now() - 30 * 60 * 1000) } }),
    ]);

    // Today stats
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayViews    = await PageView.countDocuments({ timestamp: { $gte: todayStart } });
    const todaySessions = await PageView.distinct('sessionId', { timestamp: { $gte: todayStart }, sessionId: { $ne: '' } }).then(r => r.length);

    res.json({
      success: true,
      summary: {
        totalPageViews,
        uniqueVisitors: uniqueSessions,
        realtimeViewers: realtimeViews,
        todayViews,
        todayVisitors: todaySessions,
        dailyData,
        topPages,
        topSources,
      },
    });
  } catch (err) {
    console.error('Site analytics error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
