const nodemailer = require('nodemailer');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send order notification email to admin + confirmation to customer
 * @param {object} opts
 * @param {object} opts.customer
 * @param {array}  opts.items
 * @param {number} opts.total
 * @param {string} opts.paymentMethod
 * @param {string} opts.orderId
 * @param {string} [opts.invoicePath]  - absolute path to generated PDF
 */
async function sendOrderEmail({ customer, items, total, paymentMethod, orderId, invoicePath }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️  Email not configured — skipping notification.');
    return;
  }

  // ── Build item rows ──
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f0ebe3;">${item.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0ebe3;text-align:center;">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0ebe3;text-align:right;">${item.price}</td>
    </tr>
  `).join('');

  // ── GST breakdown for email body ──
  const GST_RATE = 0.18;
  const SHIPPING = 80;
  let itemsTotal = 0;
  items.forEach(i => {
    const qty   = i.quantity || 1;
    const price = parseFloat(String(i.price).replace(/[^0-9.]/g, '')) || 0;
    itemsTotal += price * qty;
  });
  const base      = Math.round(itemsTotal / (1 + GST_RATE));
  const gst       = itemsTotal - base;
  const grandTotal = itemsTotal + SHIPPING;

  // ── Admin email ──
  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#faf8f4;padding:32px;border-radius:12px;">
      <div style="background:#1f4d3d;padding:20px 32px;border-radius:8px;margin-bottom:24px;">
        <h1 style="color:#fff;margin:0;font-size:22px;">🛒 New Order Received!</h1>
        <p style="color:#cfe2d7;margin:4px 0 0;">Order ID: <strong>#${orderId}</strong></p>
      </div>

      <div style="background:#fff;padding:24px;border-radius:8px;margin-bottom:16px;">
        <h3 style="color:#1f4d3d;margin-top:0;">Customer Details</h3>
        <p style="margin:4px 0;"><strong>Name:</strong> ${customer.name}</p>
        <p style="margin:4px 0;"><strong>Phone:</strong> ${customer.phone}</p>
        <p style="margin:4px 0;"><strong>Email:</strong> ${customer.email || 'Not provided'}</p>
        <p style="margin:4px 0;"><strong>Address:</strong> ${customer.address}, ${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}</p>
        <p style="margin:4px 0;"><strong>Payment:</strong> <span style="color:${paymentMethod.includes('COD') ? '#e67e22' : '#27ae60'};font-weight:bold;">${paymentMethod}</span></p>
      </div>

      <div style="background:#fff;padding:24px;border-radius:8px;margin-bottom:16px;">
        <h3 style="color:#1f4d3d;margin-top:0;">Order Items</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#eaf1ec;">
              <th style="padding:8px 12px;text-align:left;">Product</th>
              <th style="padding:8px 12px;text-align:center;">Qty</th>
              <th style="padding:8px 12px;text-align:right;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
      </div>

      <div style="background:#fff;padding:24px;border-radius:8px;margin-bottom:16px;">
        <h3 style="color:#1f4d3d;margin-top:0;">Payment Summary</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;">Subtotal (excl. GST)</td><td style="text-align:right;">₹${base}</td></tr>
          <tr><td style="padding:6px 0;">GST @ 18% (CGST ₹${Math.round(gst/2)} + SGST ₹${Math.round(gst/2)})</td><td style="text-align:right;">₹${gst}</td></tr>
          <tr><td style="padding:6px 0;">Shipping</td><td style="text-align:right;">₹${SHIPPING}</td></tr>
          <tr style="border-top:2px solid #1f4d3d;font-weight:bold;font-size:16px;">
            <td style="padding:8px 0;">Total</td><td style="text-align:right;">₹${grandTotal}</td>
          </tr>
        </table>
      </div>

      <p style="color:#6b6b63;font-size:12px;text-align:center;">
        Order placed on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        ${invoicePath ? '<br/>📎 Invoice PDF attached.' : ''}
      </p>
    </div>
  `;

  // ── Customer email ──
  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#faf8f4;padding:32px;border-radius:12px;">
      <div style="background:#1f4d3d;padding:20px 32px;border-radius:8px;margin-bottom:24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">✅ Order Confirmed!</h1>
        <p style="color:#cfe2d7;margin:4px 0 0;">Thank you for shopping with Aloweda</p>
      </div>

      <div style="background:#fff;padding:24px;border-radius:8px;margin-bottom:16px;">
        <p>Hi <strong>${customer.name}</strong>,</p>
        <p>Your order <strong>#${orderId}</strong> has been placed successfully!</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Delivering to:</strong> ${customer.address}, ${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}</p>
      </div>

      <div style="background:#fff;padding:24px;border-radius:8px;margin-bottom:16px;">
        <h3 style="color:#1f4d3d;margin-top:0;">Your Order</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#eaf1ec;">
              <th style="padding:8px 12px;text-align:left;">Product</th>
              <th style="padding:8px 12px;text-align:center;">Qty</th>
              <th style="padding:8px 12px;text-align:right;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
      </div>

      <div style="background:#fff;padding:24px;border-radius:8px;margin-bottom:16px;">
        <table style="width:100%;font-size:14px;border-collapse:collapse;">
          <tr><td style="padding:6px 0;">Subtotal (excl. GST)</td><td style="text-align:right;">₹${base}</td></tr>
          <tr><td style="padding:6px 0;">GST @ 18%</td><td style="text-align:right;">₹${gst}</td></tr>
          <tr><td style="padding:6px 0;">Shipping</td><td style="text-align:right;">₹${SHIPPING}</td></tr>
          <tr style="border-top:2px solid #1f4d3d;font-weight:bold;font-size:16px;">
            <td style="padding:8px 0;">Total</td><td style="text-align:right;">₹${grandTotal}</td>
          </tr>
        </table>
      </div>

      <div style="background:#eaf1ec;padding:16px 24px;border-radius:8px;border-left:4px solid #1f4d3d;">
        <p style="margin:0;font-size:13px;">
          📦 We will process your order within 1 business day.<br/>
          Delivery typically takes 5–7 business days.
        </p>
      </div>

      <p style="color:#6b6b63;font-size:12px;text-align:center;margin-top:24px;">
        Questions? Email us at marketing@aloweda.com
      </p>
    </div>
  `;

  // ── Build attachments ──
  const attachments = [];
  if (invoicePath && fs.existsSync(invoicePath)) {
    attachments.push({
      filename: `Aloweda_Invoice_${orderId}.pdf`,
      path: invoicePath,
      contentType: 'application/pdf',
    });
  }

  // ── Admin emails from env ──
  const adminEmails = (process.env.ADMIN_EMAILS || process.env.EMAIL_USER || '').split(',').map(e => e.trim()).filter(Boolean);

  // Send to all admin emails
  for (const adminEmail of adminEmails) {
    await transporter.sendMail({
      from: `"Aloweda Orders" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `🛒 New Order #${orderId} — ₹${grandTotal} (${paymentMethod})`,
      html: adminHtml,
      attachments,
    });
  }

  // Send to customer if email provided
  if (customer.email) {
    await transporter.sendMail({
      from: `"Aloweda" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: `✅ Order Confirmed — Aloweda #${orderId}`,
      html: customerHtml,
      attachments, // customer gets invoice too
    });
  }
}

module.exports = { sendOrderEmail };

/**
 * Send consultation booking emails:
 *   1. Confirmation to the customer (with Calendly link to pick a slot)
 *   2. Notification to the owner/admin
 *
 * @param {object} opts
 * @param {string} opts.customerName
 * @param {string} opts.customerEmail
 * @param {number} opts.amount          - fee paid in INR
 * @param {string} opts.paymentId       - Razorpay payment ID
 * @param {string} opts.calendlyUrl     - Calendly scheduling link
 */
async function sendConsultationEmail({ customerName, customerEmail, amount, paymentId, calendlyUrl }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
      process.env.EMAIL_PASS === 'your_ajay_aloweda_email_password_here') {
    console.log('⚠️  Email not configured — skipping consultation notification.');
    return;
  }

  const bookingTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const cal = calendlyUrl || 'https://calendly.com/aloweda1/30min';

  // ── Customer confirmation email ──────────────────────────────────────────
  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#faf8f4;padding:32px;border-radius:12px;">
      <div style="background:#1f4d3d;padding:24px 32px;border-radius:8px;margin-bottom:24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">✅ Payment Received!</h1>
        <p style="color:#cfe2d7;margin:6px 0 0;font-size:14px;">Aloweda Skincare Consultation</p>
      </div>

      <div style="background:#fff;padding:24px;border-radius:8px;margin-bottom:16px;">
        <p style="margin:0 0 12px;">Hi <strong>${customerName}</strong>,</p>
        <p style="margin:0 0 12px;">
          Your consultation fee of <strong>₹${amount}</strong> has been successfully received.
          Your payment ID is <code style="background:#f5f5f5;padding:2px 6px;border-radius:4px;">${paymentId}</code>.
        </p>
        <p style="margin:0;">
          The next step is to <strong>pick a date and time</strong> for your 30-minute video call
          with <strong>Dr. Ajay Patwardhan</strong>.
        </p>
      </div>

      <div style="text-align:center;margin:28px 0;">
        <a href="${cal}"
           style="background:#1f4d3d;color:#fff;text-decoration:none;padding:14px 32px;
                  border-radius:8px;font-size:16px;font-weight:bold;display:inline-block;">
          📅 Book My Slot on Calendly
        </a>
      </div>

      <div style="background:#eaf1ec;padding:16px 24px;border-radius:8px;border-left:4px solid #1f4d3d;margin-bottom:16px;">
        <p style="margin:0;font-size:13px;line-height:1.6;">
          📌 <strong>What happens next?</strong><br/>
          1. Click the button above and pick a slot (Mon–Fri, 3 AM – 8 PM IST).<br/>
          2. You will receive a Google Meet link via calendar invite.<br/>
          3. Join the call at the scheduled time — have your skin concerns ready!
        </p>
      </div>

      <p style="color:#6b6b63;font-size:12px;text-align:center;margin-top:24px;">
        Questions? Email us at <a href="mailto:ajay@aloweda.com" style="color:#1f4d3d;">ajay@aloweda.com</a>
      </p>
    </div>
  `;

  // ── Owner / admin notification email ────────────────────────────────────
  const adminEmails = (process.env.ADMIN_EMAILS || process.env.EMAIL_USER || '')
    .split(',').map(e => e.trim()).filter(Boolean);

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#faf8f4;padding:32px;border-radius:12px;">
      <div style="background:#1f4d3d;padding:20px 32px;border-radius:8px;margin-bottom:24px;">
        <h1 style="color:#fff;margin:0;font-size:22px;">🩺 New Consultation Booking!</h1>
        <p style="color:#cfe2d7;margin:4px 0 0;font-size:13px;">Payment verified • Slot not yet booked</p>
      </div>

      <div style="background:#fff;padding:24px;border-radius:8px;margin-bottom:16px;">
        <h3 style="color:#1f4d3d;margin-top:0;">Customer Details</h3>
        <p style="margin:4px 0;"><strong>Name:</strong> ${customerName}</p>
        <p style="margin:4px 0;"><strong>Email:</strong> ${customerEmail}</p>
        <p style="margin:4px 0;"><strong>Amount Paid:</strong> ₹${amount}</p>
        <p style="margin:4px 0;"><strong>Razorpay Payment ID:</strong> <code>${paymentId}</code></p>
        <p style="margin:4px 0;"><strong>Booked At:</strong> ${bookingTime} IST</p>
      </div>

      <div style="background:#fff4e5;padding:16px 24px;border-radius:8px;border-left:4px solid #e67e22;">
        <p style="margin:0;font-size:13px;">
          ⚠️ The customer has been redirected to Calendly to pick a slot.
          You will receive a separate calendar notification once they schedule the meeting.
        </p>
      </div>
    </div>
  `;

  // Send confirmation to customer
  if (customerEmail) {
    await transporter.sendMail({
      from: `"Aloweda" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `✅ Consultation Payment Confirmed — Book Your Slot Now`,
      html: customerHtml,
    });
  }

  // Send notification to all admin/owner emails
  for (const adminEmail of adminEmails) {
    await transporter.sendMail({
      from: `"Aloweda Consultations" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `🩺 New Consultation — ${customerName} — ₹${amount}`,
      html: adminHtml,
    });
  }

  console.log(`✅ Consultation emails sent — customer: ${customerEmail}, admins: ${adminEmails.join(', ')}`);
}

/**
 * Send "meeting confirmed" emails after Calendly invitee.created webhook fires.
 *
 * @param {object} opts
 * @param {string} opts.inviteeName       - name of the person who booked
 * @param {string} opts.inviteeEmail      - their email
 * @param {string} opts.startTime         - ISO string of meeting start
 * @param {string} opts.endTime           - ISO string of meeting end
 * @param {string} opts.meetingUrl        - Google Meet / join URL from Calendly
 * @param {string} opts.cancelUrl         - Calendly cancel link
 * @param {string} opts.rescheduleUrl     - Calendly reschedule link
 * @param {string} opts.eventName         - e.g. "30 Minute Meeting"
 */
async function sendMeetingScheduledEmail({
  inviteeName,
  inviteeEmail,
  startTime,
  endTime,
  meetingUrl,
  cancelUrl,
  rescheduleUrl,
  eventName,
}) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
      process.env.EMAIL_PASS === 'your_ajay_aloweda_email_password_here') {
    console.log('⚠️  Email not configured — skipping meeting-scheduled notification.');
    return;
  }

  // Format date/time nicely in IST
  const fmt = (iso) =>
    new Date(iso).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const startFmt = fmt(startTime);
  const endFmt   = new Date(endTime).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit',
  });

  // ── Customer email ───────────────────────────────────────────────────────
  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#faf8f4;padding:32px;border-radius:12px;">
      <div style="background:#1f4d3d;padding:24px 32px;border-radius:8px;margin-bottom:24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">📅 Meeting Confirmed!</h1>
        <p style="color:#cfe2d7;margin:6px 0 0;font-size:14px;">Aloweda Skincare Consultation</p>
      </div>

      <div style="background:#fff;padding:24px;border-radius:8px;margin-bottom:16px;">
        <p style="margin:0 0 12px;">Hi <strong>${inviteeName}</strong>,</p>
        <p style="margin:0 0 12px;">
          Your consultation with <strong>Dr. Ajay Patwardhan</strong> is confirmed.
          Here are your meeting details:
        </p>

        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px;">
          <tr>
            <td style="padding:8px 0;color:#6b6b63;width:40%;">📋 Event</td>
            <td style="padding:8px 0;font-weight:bold;">${eventName || '30 Minute Consultation'}</td>
          </tr>
          <tr style="background:#f7f4ef;">
            <td style="padding:8px;color:#6b6b63;">📅 Date &amp; Time</td>
            <td style="padding:8px;font-weight:bold;">${startFmt} – ${endFmt} IST</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b6b63;">👨‍⚕️ Specialist</td>
            <td style="padding:8px 0;font-weight:bold;">Dr. Ajay Patwardhan</td>
          </tr>
        </table>
      </div>

      ${meetingUrl ? `
      <div style="text-align:center;margin:24px 0;">
        <a href="${meetingUrl}"
           style="background:#1f4d3d;color:#fff;text-decoration:none;padding:14px 32px;
                  border-radius:8px;font-size:16px;font-weight:bold;display:inline-block;">
          🎥 Join Google Meet
        </a>
      </div>
      ` : ''}

      <div style="background:#eaf1ec;padding:16px 24px;border-radius:8px;border-left:4px solid #1f4d3d;margin-bottom:16px;">
        <p style="margin:0;font-size:13px;line-height:1.7;">
          📌 <strong>Before your consultation:</strong><br/>
          • Write down your main skin concerns<br/>
          • Note any products you currently use<br/>
          • Have good lighting for the video call<br/>
          • Join the meeting 2 minutes early
        </p>
      </div>

      <div style="font-size:12px;color:#9b9b93;text-align:center;margin-top:8px;">
        ${cancelUrl ? `<a href="${cancelUrl}" style="color:#9b9b93;">Cancel</a> &nbsp;·&nbsp;` : ''}
        ${rescheduleUrl ? `<a href="${rescheduleUrl}" style="color:#9b9b93;">Reschedule</a> &nbsp;·&nbsp;` : ''}
        <a href="mailto:ajay@aloweda.com" style="color:#9b9b93;">Contact Us</a>
      </div>
    </div>
  `;

  // ── Admin / owner notification email ─────────────────────────────────────
  const adminEmails = (process.env.ADMIN_EMAILS || process.env.EMAIL_USER || '')
    .split(',').map(e => e.trim()).filter(Boolean);

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#faf8f4;padding:32px;border-radius:12px;">
      <div style="background:#1f4d3d;padding:20px 32px;border-radius:8px;margin-bottom:24px;">
        <h1 style="color:#fff;margin:0;font-size:22px;">📅 Meeting Scheduled!</h1>
        <p style="color:#cfe2d7;margin:4px 0 0;font-size:13px;">A customer just booked their consultation slot</p>
      </div>

      <div style="background:#fff;padding:24px;border-radius:8px;margin-bottom:16px;">
        <h3 style="color:#1f4d3d;margin-top:0;">Customer Details</h3>
        <p style="margin:4px 0;"><strong>Name:</strong> ${inviteeName}</p>
        <p style="margin:4px 0;"><strong>Email:</strong> ${inviteeEmail}</p>
        <p style="margin:4px 0;"><strong>Meeting Time:</strong> ${startFmt} – ${endFmt} IST</p>
        <p style="margin:4px 0;"><strong>Event:</strong> ${eventName || '30 Minute Consultation'}</p>
        ${meetingUrl ? `<p style="margin:8px 0;"><strong>Google Meet:</strong> <a href="${meetingUrl}" style="color:#1f4d3d;">${meetingUrl}</a></p>` : ''}
      </div>

      <div style="background:#fff4e5;padding:16px 24px;border-radius:8px;border-left:4px solid #e67e22;">
        <p style="margin:0;font-size:13px;">
          ✅ Customer has been sent a confirmation email with joining details.
        </p>
      </div>
    </div>
  `;

  // Send to customer
  if (inviteeEmail) {
    await transporter.sendMail({
      from: `"Aloweda" <${process.env.EMAIL_USER}>`,
      to: inviteeEmail,
      subject: `📅 Your Consultation is Confirmed — ${startFmt} IST`,
      html: customerHtml,
    });
  }

  // Send to all admin/owner emails
  for (const adminEmail of adminEmails) {
    await transporter.sendMail({
      from: `"Aloweda Consultations" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `📅 Meeting Booked — ${inviteeName} — ${startFmt}`,
      html: adminHtml,
    });
  }

  console.log(`✅ Meeting-scheduled emails sent — customer: ${inviteeEmail}, admins: ${adminEmails.join(', ')}`);
}

module.exports = { sendOrderEmail, sendConsultationEmail, sendMeetingScheduledEmail };
