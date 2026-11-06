const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ── GST helpers ────────────────────────────────────────────────────────────
// All website prices are INCLUSIVE of 18% GST
// Formula: base = price / 1.18,  gst = price - base
// CGST = SGST = gst / 2
const GST_RATE   = 0.18;
const SHIPPING   = 80; // fixed for all orders

function calcGST(inclusivePrice) {
  const base = Math.round(inclusivePrice / (1 + GST_RATE));
  const gst  = inclusivePrice - base;
  return { base, gst, cgst: Math.round(gst / 2), sgst: Math.round(gst / 2) };
}

// ── Invoice generator ──────────────────────────────────────────────────────
class InvoiceGenerator {
  constructor(order) {
    this.order = order;
    this.doc   = new PDFDocument({ size: 'A4', margin: 40, compress: true });
    this.W     = 515; // usable width
    this.L     = 40;  // left margin
    this.R     = 555; // right edge
  }

  async generate(outputPath) {
    const stream = fs.createWriteStream(outputPath);
    this.doc.pipe(stream);
    this._build();
    this.doc.end();
    return new Promise((res, rej) => {
      stream.on('finish', () => res(outputPath));
      stream.on('error', rej);
    });
  }

  // ── Helpers ──
  _divider() {
    this.doc.moveTo(this.L, this.doc.y).lineTo(this.R, this.doc.y).strokeColor('#ccc').stroke();
    this.doc.moveDown(0.6);
  }

  _computeTotals() {
    let itemsTotal = 0;
    (this.order.items || []).forEach(item => {
      const qty   = item.quantity || 1;
      const price = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
      itemsTotal += price * qty;
    });
    const pricing        = this.order.pricing || {};
    const bundleDiscount = pricing.bundleDiscount || 0;
    const couponDiscount = pricing.couponDiscount || 0;
    const onlineDiscount = pricing.onlinePaymentDiscount || 0;
    const discounted     = itemsTotal - bundleDiscount - couponDiscount - onlineDiscount;
    const { base: subtotal, gst } = calcGST(discounted);
    const grandTotal     = discounted + SHIPPING;
    return { itemsTotal, discounted, subtotal, gst, grandTotal };
  }

  // ── Build ──
  _build() {
    this._companyBlock();
    this._divider();
    this._itemsTable();
    this._transactionDetails();
    this._paymentDetails();
    this._shippingDetails();
    this._footer();
  }

  // ── Company header ──
  _companyBlock() {
    const order   = this.order;
    const dateStr = new Date(order.createdAt || Date.now())
      .toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' });

    const startY = 40;

    // Right: date + invoice number (absolutely positioned)
    this.doc.fontSize(9).font('Helvetica').fillColor('#000')
      .text(dateStr,                          this.L, startY, { align: 'right', width: this.W })
      .text(`Invoice for #${order.orderId}`,  this.L, startY + 14, { align: 'right', width: this.W });

    // Left: big company name
    this.doc.fontSize(24).font('Helvetica-Bold').fillColor('#000')
      .text('Aloweda', this.L, startY);

    // Address lines below name
    this.doc.fontSize(9).font('Helvetica').fillColor('#000')
      .text('A 107 Oman Topaz Agara, Sarjapur Road', this.L, startY + 30)
      .text('Bengaluru KA 560102', this.L, startY + 42)
      .text('India', this.L, startY + 54);

    // Move cursor well below address before divider
    this.doc.y = startY + 75;
  }

  // ── Items table ──
  _itemsTable() {
    const colQty   = this.L;
    const colItem  = this.L + 45;
    const colTax   = this.R - 160;
    const colPrice = this.R - 55;

    this.doc.fontSize(13).font('Helvetica-Bold').fillColor('#000')
      .text('Item Details', this.L, this.doc.y);
    this.doc.moveDown(0.4);

    // Header row
    const hY = this.doc.y;
    this.doc.rect(this.L, hY, this.W, 18).fillColor('#f0f0f0').fill();
    this.doc.fontSize(8).font('Helvetica-Bold').fillColor('#000')
      .text('Quantity', colQty,  hY + 4)
      .text('Item',     colItem, hY + 4)
      .text('Taxes',    colTax,  hY + 4)
      .text('Price',    colPrice,hY + 4);
    this.doc.rect(this.L, hY, this.W, 18).strokeColor('#bbb').stroke();

    let y = hY + 18;

    (this.order.items || []).forEach(item => {
      const qty       = item.quantity || 1;
      const unitPrice = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
      const lineTotal = unitPrice * qty;
      const { cgst, sgst } = calcGST(lineTotal);
      const rowH = 58;

      this.doc.rect(this.L, y, this.W, rowH).strokeColor('#bbb').stroke();

      this.doc.fontSize(8).font('Helvetica').fillColor('#000')
        .text(`${qty} x`,   colQty,  y + 8)
        .text(item.name,    colItem, y + 8, { width: colTax - colItem - 8, lineGap: 2 });

      // Taxes column
      this.doc
        .text(`Rs. ${cgst.toFixed(2)}`, colTax, y + 8)
        .text('CGST',                   colTax, y + 19)
        .text(`Rs. ${sgst.toFixed(2)}`, colTax, y + 30)
        .text('SGST',                   colTax, y + 41);

      // Price column
      this.doc
        .text('Rs.',                    colPrice, y + 8)
        .text(lineTotal.toFixed(2),     colPrice, y + 19);

      y += rowH;
    });

    this.doc.y = y + 10;
    this.doc.moveDown(0.5);
  }

  // ── Transaction Details ──
  _transactionDetails() {
    const { grandTotal } = this._computeTotals();
    const method = this.order.paymentMethod === 'COD'
      ? 'Cash on delivery (cod)' : 'Online payment';
    const isOnline = this.order.paymentMethod !== 'COD';

    this.doc.fontSize(13).font('Helvetica-Bold').fillColor('#000')
      .text('Transaction Details', this.L, this.doc.y);
    this.doc.moveDown(0.4);

    const hY = this.doc.y;
    // Header
    this.doc.rect(this.L, hY, this.W, 18).fillColor('#f0f0f0').fill();
    this.doc.fontSize(8).font('Helvetica-Bold').fillColor('#000')
      .text('Type',   this.L + 4,   hY + 4)
      .text('Amount', this.L + 190, hY + 4)
      .text('Kind',   this.L + 320, hY + 4)
      .text('Status', this.L + 420, hY + 4);
    this.doc.rect(this.L, hY, this.W, 18).strokeColor('#bbb').stroke();

    const amtStr = `Rs. ${grandTotal.toFixed(2)}`;

    // Row 1
    const r1Y = hY + 18;
    this.doc.rect(this.L, r1Y, this.W, 18).strokeColor('#bbb').stroke();
    this.doc.fontSize(8).font('Helvetica').fillColor('#000')
      .text(method,                      this.L + 4,   r1Y + 4)
      .text(amtStr,                      this.L + 190, r1Y + 4)
      .text('sale',                      this.L + 320, r1Y + 4)
      .text(isOnline ? 'success' : 'pending', this.L + 420, r1Y + 4);

    // Row 2 — success (for COD shows when payment collected)
    const r2Y = r1Y + 18;
    this.doc.rect(this.L, r2Y, this.W, 18).strokeColor('#bbb').stroke();
    this.doc.fontSize(8).font('Helvetica').fillColor('#000')
      .text(method,   this.L + 4,   r2Y + 4)
      .text(amtStr,   this.L + 190, r2Y + 4)
      .text('sale',   this.L + 320, r2Y + 4)
      .text('success',this.L + 420, r2Y + 4);

    this.doc.y = r2Y + 26;
    this.doc.moveDown(0.5);
  }

  // ── Payment Details ──
  _paymentDetails() {
    const { subtotal, gst, grandTotal } = this._computeTotals();

    this.doc.fontSize(13).font('Helvetica-Bold').fillColor('#000')
      .text('Payment Details', this.L, this.doc.y);
    this.doc.moveDown(0.4);

    const rows = [
      { label: 'Subtotal price:', value: `Rs. ${subtotal.toFixed(2)}`, bold: false },
      { label: 'Total tax',       value: `Rs. ${gst.toFixed(2)}`,      bold: false },
      { label: 'Shipping:',       value: `Rs. ${SHIPPING.toFixed(2)}`, bold: false },
      { label: 'Total price',     value: `Rs. ${grandTotal.toFixed(2)}`,bold: true  },
    ];

    let y = this.doc.y;
    rows.forEach(row => {
      this.doc.rect(this.L, y, this.W, 18).strokeColor('#bbb').stroke();
      this.doc.fontSize(8).font(row.bold ? 'Helvetica-Bold' : 'Helvetica').fillColor('#000')
        .text(row.label, this.L + 4, y + 4)
        .text(row.value, this.R - 100, y + 4, { align: 'right', width: 96 });
      y += 18;
    });

    this.doc.y = y + 12;
    this.doc.moveDown(0.5);
  }

  // ── Shipping Details — user's address ──
  _shippingDetails() {
    const c = this.order.customerInfo;
    if (!c) return;

    this.doc.fontSize(13).font('Helvetica-Bold').fillColor('#000')
      .text('Shipping Details', this.L, this.doc.y);
    this.doc.moveDown(0.4);

    // address can be nested object OR flat string depending on source
    const addr = c.address || {};
    const street  = typeof addr === 'string' ? addr : (addr.street  || '');
    const city    = typeof addr === 'string' ? (c.city    || '') : (addr.city    || '');
    const state   = typeof addr === 'string' ? (c.state   || '') : (addr.state   || '');
    const pincode = typeof addr === 'string' ? (c.pincode || '') : (addr.pincode || '');

    const lines = [
      c.name,
      street,
      [city, state].filter(Boolean).join(', '),
      pincode,
      'India',
    ].filter(Boolean);

    const boxH = lines.length * 15 + 16;
    const boxY = this.doc.y;

    this.doc.rect(this.L, boxY, this.W, boxH).strokeColor('#bbb').stroke();

    let ty = boxY + 8;
    lines.forEach((line, i) => {
      this.doc.fontSize(8)
        .font(i === 0 ? 'Helvetica-Bold' : 'Helvetica')
        .fillColor('#000')
        .text(line, this.L + 10, ty);
      ty += 15;
    });

    this.doc.y = boxY + boxH + 14;
  }

  // ── Footer ──
  _footer() {
    this.doc.moveDown(0.5);
    this.doc.fontSize(8).font('Helvetica').fillColor('#555')
      .text('If you have any questions, please send an email to marketing@aloweda.com',
        this.L, this.doc.y);
    this.doc.moveDown(0.8);
    this.doc.fontSize(7).fillColor('#aaa')
      .text('This is a computer-generated invoice and does not require a signature.',
        { align: 'center' });
  }
}

// ── Public API ─────────────────────────────────────────────────────────────
exports.generateInvoice = async (order, outputDir) => {
  // Use OS temp dir so it works on both Windows and Linux/Vercel
  const dir = outputDir || path.join(os.tmpdir(), 'aloweda-invoices');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filename   = `invoice_${order.orderId || order._id}.pdf`;
  const outputPath = path.join(dir, filename);

  const gen = new InvoiceGenerator(order);
  await gen.generate(outputPath);
  return outputPath;
};

exports.SHIPPING_CHARGE = SHIPPING;
exports.calcGST = calcGST;
