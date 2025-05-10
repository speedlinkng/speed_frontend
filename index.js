const express = require('express');
const app = express();
const path = require('path');
const crypto = require('crypto');
const redisClient = require('./redisClient'); // Import the Redis client
const dotenv = require('dotenv');
const cors = require('cors');
const { sign } = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// No need for express-session or connect-redis

// Set view engine
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'views/includes')));
app.use(express.static(path.join(__dirname, 'views/dashboard')));
app.use(express.static(path.join(__dirname, 'views/admin')));
app.use('/auth', express.static(path.join(__dirname, 'public')));

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: 'http://127.0.0.1:5502',
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Routes
const dashboard = require('./routes/dahboard.route');
const form = require('./routes/form.route');
const admin = require('./routes/admin.route');
const auth = require('./routes/auth.route');
const paystack = require('./routes/paystack.route');

app.use("/dash/", dashboard);
app.use("/form/", form);
app.use("/auth/", auth);
app.use("/admin/", admin);
app.use("/paystack/", paystack);

// Token exchange endpoint
app.get('/exchange/:email', async (req, res) => {
  console.log('exch');
  const email = req.params.email;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Store the user's email in Redis under the key "frontendlogin"
  try {
    await redisClient.set("frontendlogin", email, 'EX', 60 * 60); // Short expiration (30 minutes?)
    console.log(`Frontend login email stored in Redis: ${email}`);
  } catch (err) {
    console.error("Redis error:", err);
    return res.status(500).json({ message: 'Failed to store login information' });
  }

  return res.status(200).json({ message: 'Email stored successfully' });
});

// Home route
app.get('/', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/dash`);
});

// Catch-all route for unmatched URLs
app.use((req, res) => {
  res.redirect("/home");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
