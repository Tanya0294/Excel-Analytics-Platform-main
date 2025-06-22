/*
// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // (optional but useful)

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/FileRouter'); // NEW ✅

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes); // NEW ✅
app.get("/test", (req, res) => res.send("✅ Backend working"));

const chartHistoryRoute = require("./routes/chartHistory");
app.use("/api/chart-history", chartHistoryRoute);



const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => console.error('❌ MongoDB connection error:', err));
*/
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/FileRouter');
const chartHistoryRoute = require("./routes/chartHistory");

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use("/api/chart-history", chartHistoryRoute);


app.get("/test", (req, res) => res.send("✅ Backend working"));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
