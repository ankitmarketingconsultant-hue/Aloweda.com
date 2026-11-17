const express = require('express');
const crypto  = require('crypto');
const router  = express.Router();
const { sendMeetingScheduledEmail } = require('../utils/emailService');

/**
 * Calendly sends a signing key with every webhook payload (header:
 * "Calendly-Webhook-Signature"). We verify it to make sure the request
 * genuinely came from Calendly and not from an outside party.
 *
 * To skip signature verification in local dev, leave CALENDLY_WEBHOOK_SECRET
 * unset in your .env — the check is bypassed automatically.
 */
function verifyCalendlySignature(req) {
  const secret = process.env.CALENDLY_WEBHOOK_SECRET;
  if (!secret) return true; // skip in dev if not configured

  const signature = req.headers['calendly-webhook-signature'];
  if (!signature) return false;

  // Signature format: "t=<timestamp>,v1=<hmac>"
  const parts = Object.fromEntries(
    signature.split(',').map(p => p.split('='))
  );

  if (!parts.t || !parts.v1) return false;

  const payload  = `${parts.t}.${JSON.stringify(req.body)}`;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(parts.v1, 'hex'),
    Buffer.from(expected, 'hex')
  );
}

/**
 * POST /api/calendly-webhook
 *
 * Calendly event types handled:
 *   - invitee.created  → meeting scheduled  → send confirmation emails
 *   - invitee.canceled → meeting canceled   → (logged, extend as needed)
 */
router.post('/', express.json(), async (req, res) => {
  // Always ACK quickly so Calendly doesn't retry
  res.status(200).json({ received: true });

  try {
    if (!verifyCalendlySignature(req)) {
      console.warn('⚠️  Calendly webhook: invalid signature — ignoring.');
      return;
    }

    const event   = req.body?.event;
    const payload = req.body?.payload;

    console.log(`📅 Calendly webhook received: ${event}`);

    if (event === 'invitee.created') {
      // ── Extract the data Calendly sends ──────────────────────────────
      const inviteeName    = payload?.name  || 'Customer';
      const inviteeEmail   = payload?.email || '';
      const startTime      = payload?.scheduled_event?.start_time || '';
      const endTime        = payload?.scheduled_event?.end_time   || '';
      const eventName      = payload?.scheduled_event?.name       || '30 Minute Consultation';
      const cancelUrl      = payload?.cancel_url     || '';
      const rescheduleUrl  = payload?.reschedule_url || '';

      // Google Meet link lives inside the location object
      const locationObj = payload?.scheduled_event?.location || {};
      const meetingUrl  =
        locationObj.join_url ||
        locationObj.location ||
        '';

      await sendMeetingScheduledEmail({
        inviteeName,
        inviteeEmail,
        startTime,
        endTime,
        meetingUrl,
        cancelUrl,
        rescheduleUrl,
        eventName,
      });

    } else if (event === 'invitee.canceled') {
      const name  = payload?.name  || 'Customer';
      const email = payload?.email || '';
      console.log(`❌ Consultation canceled by ${name} (${email})`);
      // TODO: add sendMeetingCanceledEmail if needed
    } else {
      console.log(`ℹ️  Unhandled Calendly event: ${event}`);
    }

  } catch (err) {
    console.error('Calendly webhook handler error:', err.message);
  }
});

module.exports = router;
