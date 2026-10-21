// Run this in MongoDB Shell (mongosh)
// Connect: mongosh "mongodb+srv://aloweda_admin:Aloweda2024@cluster0.zvplwpb.mongodb.net/aloweda"

use aloweda;

db.coupons.insertMany([
  {
    code: "BJA899",
    description: "Buy any 3 products at ₹899 - Combo Deal (Except existing combo products)",
    type: "fixed",
    discount: 0,
    minOrderValue: 0,
    usageLimit: null,
    usedCount: 0,
    perUserLimit: 10,
    validFrom: new Date("2026-10-21T00:00:00.000Z"),
    validTo: new Date("2025-12-31T23:59:59.999Z"),
    source: "Excel Import",
    campaign: "Combo Deals 2025",
    isActive: true,
    applicableCategories: [],
    excludedProducts: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: "B4A1199",
    description: "Buy any 4 products at ₹1199 - Combo Deal (Except existing combo products)",
    type: "fixed",
    discount: 0,
    minOrderValue: 0,
    usageLimit: null,
    usedCount: 0,
    perUserLimit: 10,
    validFrom: new Date("2026-10-21T00:00:00.000Z"),
    validTo: new Date("2025-12-31T23:59:59.999Z"),
    source: "Excel Import",
    campaign: "Combo Deals 2025",
    isActive: true,
    applicableCategories: [],
    excludedProducts: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: "B2A699",
    description: "Buy any 2 products at ₹699 - Combo Deal (Except existing combo products)",
    type: "fixed",
    discount: 0,
    minOrderValue: 0,
    usageLimit: null,
    usedCount: 0,
    perUserLimit: 10,
    validFrom: new Date("2026-10-21T00:00:00.000Z"),
    validTo: new Date("2025-12-31T23:59:59.999Z"),
    source: "Excel Import",
    campaign: "Combo Deals 2025",
    isActive: true,
    applicableCategories: [],
    excludedProducts: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("✅ All 3 coupons imported successfully!");
