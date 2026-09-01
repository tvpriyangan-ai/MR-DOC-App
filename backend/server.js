require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/purchases', require('./routes/purchaseRoutes'));
app.use('/api/ledger', require('./routes/ledgerRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/salaries', require('./routes/salaryRoutes'));
app.use('/api/shop-value', require('./routes/shopValueRoutes'));
app.use('/api/features', require('./routes/featureRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/activity-logs', require('./routes/activityLogRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));
app.use('/api/works', require('./routes/workRoutes'));

// Serve the frontend static files (so Render can host both from one service)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Any route not starting with /api falls back to index.html (simple SPA-style fallback)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
