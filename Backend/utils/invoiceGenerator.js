const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// ── GST helpers ────────────────────────────────────────────────────────────
// All website prices are INCLUSIVE of 18% GST
// Formula: base = total / 1.18,  gst = total - base
// CGST = SGST = gst / 2
const GST_RATE = 0.18;
const SHIPPING_CHARGE = 80; // fixed for all orders

function calcGST(inclusivePrice) {
  const base = Math.round(inclusivePrice / (1 + GST_RATE));
  const gst  = inclusivePrice - base;
  return { base, gst, cgst: Math.round(gst / 2), sgst: Math.round(gst / 2) };
}

// ── Invoice generator ──────────────────────────────────────────────────────
class InvoiceGenerator {
  constructor(order) {
    this.order = order;
    this.doc = new PDFDocument({ size: 'A4', margin: 40, compress: true });
    this.W = 515; // usable width
    this.L = 40;  // left margin
    this.R = 555; // right edge
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

  _build() {
    this._header();
    this._companyBlock();
    this._divider();
    this._customerAndOrderBlock();
    this._divider();
    this._itemsTable();
    this._transactionDetails();
    this._paymentDetails();
    this._shippingDetails();
    this._footer();
  }

  // ── Header ──
  _header() {
    const now = new Date();
    const dateStr = `${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getDate().toString().padStart(2,'0')}/${now.getFullYear().toString().slice(-2)}, ${now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}`;

    this.doc.fontSize(8).font('Helvetica').fillColor('#555')
      .text(dateStr, this.L, 40)
      .text('Order printer', this.R - 60, 40);

    this.doc.moveDown(0.5);
  }

  // ── Company name + address ──
  _companyBlock() {
    const order = this.order;
    const dateStr = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN',{day:'2-digit',month:'2-digit',year:'2-digit'});

    // Company name big
    this.doc.fontSize(22).font('Helvetica-Bold').fillColor('#000')
      .text('Aloweda', this.L, this.doc.y);

    // Invoice number top-right
    this.doc.fontSize(9).font('Helvetica').fillColor('#000')
      .text(dateStr, this.R - 80, this.doc.y - 20, { align: 'right', width: 80 })
      .text(`Invoice for #${order.orderId}`, this.R - 120, this.doc.y, { align: 'right', width: 120 });

    this.doc.fontSize(9).font('Helvetica').fillColor('#000')
      .text('A 107 Oman Topaz Agara, Sarjapur Road', this.L)
      .text('Bengaluru KA 560102', this.L)
      .text('India', this.L);

    this.doc.moveDown(0.8);
  }

  _divider() {
    this.doc.moveTo(this.L, this.doc.y).lineTo(this.R, this.doc.y).strokeColor('#ccc').stroke();
    this.doc.moveDown(0.5);
  }

  // ── Customer + order meta ──
  _customerAndOrderBlock() {
    // (no separate block needed — already in company block above)
  }

  // ── Items table ──
  _itemsTable() {
    const colQty   = this.L;
    const colItem  = this.L + 45;
    const colTax   = this.R - 160;
    const colPrice = this.R - 60;

    // Table heading
    this.doc.fontSize(12).font('Helvetica-Bold').fillColor('#000')
      .text('Item Details', this.L, this.doc.y);
    this.doc.moveDown(0.4);

    // Header row
    const hY = this.doc.y;
    this.doc.rect(this.L, hY, this.W, 18).fillColor('#f0f0f0').fill();
    this.doc.fontSize(8).font('Helvetica-Bold').fillColor('#000')
      .text('Quantity', colQty, hY + 4)
      .text('Item',     colItem, hY + 4)
      .text('Taxes',    colTax,  hY + 4)
      .text('Price',    colPrice,hY + 4);

    // Border around header
    this.doc.rect(this.L, hY, this.W, 18).strokeColor('#bbb').stroke();

    let y = hY + 18;

    this.order.items.forEach((item) => {
      const qty       = item.quantity || 1;
      const unitPrice = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
      const lineTotal = unitPrice * qty;
      const { cgst, sgst } = calcGST(lineTotal);

      const taxText   = `Rs. ${cgst.toFixed(2)}\nCGST\nRs. ${sgst.toFixed(2)}\nSGST`;
      const rowH      = 55;

      // row border
      this.doc.rect(this.L, y, this.W, rowH).strokeColor('#bbb').stroke();

      this.doc.fontSize(8).font('Helvetica').fillColor('#000')
        .text(`${qty} x`, colQty,  y + 8)
        .text(item.name, colItem, y + 8, { width: colTax - colItem - 10, lineGap: 2 })
        .text(taxText,   colTax,  y + 8, { lineGap: 1 })
        .text(`Rs.\n${lineTotal.toFixed(2)}`, colPrice, y + 8);

      y += rowH;
    });

    this.doc.y = y + 10;
    this.doc.moveDown(0.5);
  }

  // ── Transaction Details ──
  _transactionDetails() {
    const order = this.order;
    const total = parseFloat(String(order.pricing?.total || 0).replace(/[^0-9.]/g, ''));
    const method = order.paymentMethod === 'COD' ? 'Cash on delivery (cod)' : 'Online payment';

    this.doc.fontSize(12).font('Helvetica-Bold').fillColor('#000')
      .text('Transaction Details', this.L, this.doc.y);
    this.doc.moveDown(0.4);

    const hY = this.doc.y;
    this.doc.rect(this.L, hY, this.W, 18).fillColor('#f0f0f0').fill();
    this.doc.fontSize(8).font('Helvetica-Bold').fillColor('#000')
      .text('Type',   this.L + 4, hY + 4)
      .text('Amount', this.L + 180, hY + 4)
      .text('Kind',   this.L + 310, hY + 4)
      .text('Status', this.L + 420, hY + 4);
    this.doc.rect(this.L, hY, this.W, 18).strokeColor('#bbb').stroke();

    // Row 1 — pending (for COD)
    const r1Y = hY + 18;
    this.doc.rect(this.L, r1Y, this.W, 18).strokeColor('#bbb').stroke();
    this.doc.fontSize(8).font('Helvetica').fillColor('#000')
      .text(method,             this.L + 4, r1Y + 4)
      .text(`Rs. ${total.toFixed(2)}`, this.L + 180, r1Y + 4)
      .text('sale',             this.L + 310, r1Y + 4)
      .text(order.paymentMethod === 'COD' ? 'pending' : 'success', this.L + 420, r1Y + 4);

    // Row 2 — success
    const r2Y = r1Y + 18;
    this.doc.rect(this.L, r2Y, this.W, 18).strokeColor('#bbb').stroke();
    this.doc.fontSize(8).font('Helvetica').fillColor('#000')
      .text(method,             this.L + 4, r2Y + 4)
      .text(`Rs. ${total.toFixed(2)}`, this.L + 180, r2Y + 4)
      .text('sale',             this.L + 310, r2Y + 4)
      .text('success',          this.L + 420, r2Y + 4);

    this.doc.y = r2Y + 28;
    this.doc.moveDown(0.5);
  }

  // ── Payment Details ──
  _paymentDetails() {
    const { pricing } = this.order;

    // Compute subtotal (excl GST) from items
    let itemsTotal = 0;
    (this.order.items || []).forEach(item => {
      const qty  = item.quantity || 1;
      const price = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
      itemsTotal += price * qty;
    });

    // Apply discounts
    const bundleDiscount = pricing?.bundleDiscount || 0;
    const couponDiscount = pricing?.couponDiscount || 0;
    const onlineDiscount = pricing?.onlinePaymentDiscount || 0;
    const discountedTotal = itemsTotal - bundleDiscount - couponDiscount - onlineDiscount;

    const { base: subtotal, gst: totalGst } = calcGST(discountedTotal);
    const shipping = SHIPPING_CHARGE;
    const grandTotal = discountedTotal + shipping;

    this.doc.fontSize(12).font('Helvetica-Bold').fillColor('#000')
      .text('Payment Details', this.L, this.doc.y);
    this.doc.moveDown(0.4);

    const rows = [
      { label: 'Subtotal price:',  value: `Rs. ${subtotal.toFixed(2)}`,       bold: false },
      { label: 'Total tax',        value: `Rs. ${totalGst.toFixed(2)}`,        bold: false },
      { label: 'Shipping:',        value: `Rs. ${shipping.toFixed(2)}`,        bold: false },
      { label: 'Total price',      value: `Rs. ${grandTotal.toFixed(2)}`,      bold: true  },
    ];

    let y = this.doc.y;
    rows.forEach(row => {
      this.doc.rect(this.L, y, this.W, 18).strokeColor('#bbb').stroke();
      const font = row.bold ? 'Helvetica-Bold' : 'Helvetica';
      this.doc.fontSize(8).font(font).fillColor('#000')
        .text(row.label, this.L + 4, y + 4)
        .text(row.value, this.R - 100, y + 4, { align: 'right', width: 96 });
      y += 18;
    });

    this.doc.y = y + 10;
    this.doc.moveDown(0.5);
  }

  // ── Shipping Details ──
  _shippingDetails() {
    const c = this.order.customerInfo;
    if (!c) return;

    this.doc.fontSize(12).font('Helvetica-Bold').fillColor('#000')
      .text('Shipping Details', this.L, this.doc.y);
    this.doc.moveDown(0.4);

    const boxY = this.doc.y;
    const lines = [
      c.name,
      c.address,
      `${c.pincode} ${c.city} ${c.state}`,
      'India',
    ].filter(Boolean);

    const boxH = lines.length * 14 + 16;
    this.doc.rect(this.L, boxY, this.W, boxH).strokeColor('#bbb').stroke();

    let ty = boxY + 8;
    lines.forEach(line => {
      const font = ty === boxY + 8 ? 'Helvetica-Bold' : 'Helvetica';
      this.doc.fontSize(8).font(font).fillColor('#000').text(line, this.L + 8, ty);
      ty += 14;
    });

    this.doc.y = boxY + boxH + 14;
  }

  // ── Footer ──
  _footer() {
    this.doc.moveDown(0.5);
    this.doc.fontSize(8).font('Helvetica').fillColor('#000')
      .text('If you have any questions, please send an email to marketing@aloweda.com', this.L, this.doc.y, { link: 'mailto:marketing@aloweda.com' });

    this.doc.moveDown(1);
    this.doc.fontSize(7).fillColor('#888')
      .text('This is a computer-generated invoice and does not require a signature.', { align: 'center' });
  }
}

// ── Public API ─────────────────────────────────────────────────────────────
exports.generateInvoice = async (order, outputDir = '/tmp/invoices') => {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const filename = `invoice_${order.orderId}.pdf`;
  const outputPath = path.join(outputDir, filename);
  const gen = new InvoiceGenerator(order);
  await gen.generate(outputPath);
  return outputPath;
};

exports.SHIPPING_CHARGE = SHIPPING_CHARGE;
exports.calcGST = calcGST;
