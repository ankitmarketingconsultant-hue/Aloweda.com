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
