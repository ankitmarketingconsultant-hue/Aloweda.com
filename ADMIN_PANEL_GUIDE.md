# Aloweda Admin Panel Guide

## Overview
Complete admin panel for managing Aloweda e-commerce website with product management, order processing, and sales analytics.

## Features

### 1. **Admin Authentication**
- Secure login with email and password
- Role-based access (only users with `role: 'admin'` can access)
- JWT token authentication
- Session management with localStorage

### 2. **Sales Analytics Dashboard** (`/admin/dashboard`)
- **Total Revenue**: Sum of all completed orders
- **Total Orders**: Count of all orders
- **Average Order Value**: Revenue per order
- **Success Rate**: Percentage of delivered orders
- **Orders by Status**: Breakdown of pending, processing, shipped, delivered, cancelled, refunded
- **Product-wise Sales**: Ranked table showing units sold and revenue per product
- **Business Insights**: Quick summary with actionable metrics

### 3. **Products Management** (`/admin/products`)
- View all products in a table format
- Search by product name or category
- Quick stats: Total products, In stock, Out of stock
- **Edit Price**: Inline editing to update product prices
- **Update Stock**: Inline editing to update stock quantities
- Real-time updates to database

### 4. **Orders Management** (`/admin/orders`)
- View all customer orders with complete details
- Search by customer name, email, or order ID
- Filter orders by status (pending, processing, shipped, delivered, cancelled, refunded, replaced)
- Order statistics dashboard
- **Status Management**: Dropdown to update order status
- **Cancel Order**: Cancel order with reason
- **Refund Order**: Process refunds with optional custom refund amount
- **Replace Order**: Initiate replacement with reason
- View customer info, items, shipping address, and payment details

## Access URLs

- **Login Page**: `https://aloweda-smoky.vercel.app/admin/login`
- **Dashboard**: `https://aloweda-smoky.vercel.app/admin/dashboard`
- **Products**: `https://aloweda-smoky.vercel.app/admin/products`
- **Orders**: `https://aloweda-smoky.vercel.app/admin/orders`

## Backend API Endpoints

All admin routes require authentication token in header:
```
Authorization: Bearer <token>
```

### Products
- `GET /api/admin/products` - Get all products
- `PUT /api/admin/products/:id/price` - Update product price
- `PUT /api/admin/products/:id/stock` - Update product stock

### Orders
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `PUT /api/admin/orders/:id/cancel` - Cancel order
- `PUT /api/admin/orders/:id/refund` - Refund order
- `PUT /api/admin/orders/:id/replace` - Replace order

### Analytics
- `GET /api/admin/analytics` - Get sales analytics and statistics

### Users
- `GET /api/admin/users` - Get all users

## Creating Admin User

To create an admin user, you need to manually update the user's role in MongoDB:

1. First create a regular user account through the website
2. Then in MongoDB, update that user's role:

```javascript
db.users.updateOne(
  { email: "admin@aloweda.com" },
  { $set: { role: "admin" } }
)
```

Or use MongoDB Compass to edit the user document and set `role: "admin"`.

## Admin Panel Features in Detail

### Product Price Management
- Click "Edit" button on any product
- Modify price in the inline input field
- Click "Save Price" to update
- Changes are immediately reflected in the database
- Stock can also be updated the same way

### Order Status Workflow
1. **Pending** → Initial state when order is placed
2. **Processing** → Order is being prepared
3. **Shipped** → Order has been dispatched
4. **Delivered** → Order successfully delivered (final state)
5. **Cancelled** → Order cancelled (by admin or customer)
6. **Refunded** → Payment refunded to customer
7. **Replaced** → Product replacement initiated

### Order Actions
- **Cancel**: Can cancel any order that's not yet delivered. Requires reason.
- **Refund**: Can refund any order. Optionally specify custom refund amount (defaults to full order amount).
- **Replace**: Initiate product replacement. Requires reason.

### Sales Analytics
- Real-time calculation of revenue and order statistics
- Product performance ranking by revenue
- Visual stat cards with color-coded metrics
- Business insights summary

## Security Features

- Protected routes - redirects to login if not authenticated
- Role-based access control (admin role required)
- Token expiration handling
- Secure password storage with bcrypt
- MongoDB connection with environment variables

## Tech Stack

### Frontend
- React with React Router for routing
- CSS for styling (no external UI libraries)
- LocalStorage for session management
- Fetch API for backend communication

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Responsive Design

The admin panel is fully responsive and works on:
- Desktop (optimized for 1400px+)
- Tablet (768px - 1024px)
- Mobile (below 768px with collapsible sidebar)

## Development

### Local Setup
1. Backend: `cd Backend && npm install && npm start`
2. Frontend: `cd frontend && npm install && npm run dev`
3. Create `.env` files with required variables

### Environment Variables

Backend `.env`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Frontend `.env`:
```
VITE_API_URL=http://localhost:5000
```

## Deployment Status

✅ **DEPLOYED ON VERCEL**
- Backend: Auto-deployed from GitHub
- Frontend: Auto-deployed from GitHub
- Latest commit: `93600ec` - "Feature: Complete Admin Panel"

Admin panel will be live at: `https://aloweda-smoky.vercel.app/admin/login`

## Support

For any issues or questions about the admin panel, contact the development team.

---

**Last Updated**: Today
**Version**: 1.0.0
**Status**: Production Ready ✅
