const mongoose = require('mongoose');

const pageViewSchema = new mongoose.Schema({
  page:       { type: String, required: true },   // e.g. "/shop", "/creams"
  referrer:   { type: String, default: '' },       // where they came from
  utmSource:  { type: String, default: '' },       // facebook, google etc
  utmMedium:  { type: String, default: '' },
  utmCampaign:{ type: String, default: '' },
  userAgent:  { type: String, default: '' },
  sessionId:  { type: String, default: '' },       // anonymous session ID
  timestamp:  { type: Date,   default: Date.now },
}, { timestamps: false });

// Index for fast date-range queries
pageViewSchema.index({ timestamp: -1 });
pageViewSchema.index({ page: 1, timestamp: -1 });

module.exports = mongoose.model('PageView', pageViewSchema);
