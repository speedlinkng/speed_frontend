const express = require('express');
const app = express();
const path = require('path');
const crypto = require('crypto');
const session = require('express-session');
const Redis = require('ioredis');
const RedisStore = require('connect-redis').default;
const dotenv = require('dotenv');
const cors = require('cors');
const { sign } = require('jsonwebtoken'); // Import the sign function


// Load environment variables
dotenv.config();

const redisClient = new Redis(process.env.REDIS_PUBLIC_URL);

// Configure session middleware with Redis store
app.use(
  session({
    store: new RedisStore({ client: redisClient }), // Use Redis as the session store
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Session secret
    resave: false, // Don't resave unchanged sessions
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    },
  })
);

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
app.get('/exchange', (req, res) => {
  console.log('exch');
  let token = req.headers.authorization; // Assuming the token is in the request headers
  if (!token) {
    return res.status(701).json({ message: 'Unauthorized' });
  }
  token = token && token.split(' ')[1];
  const accessToken = sign({ this_user_token: token }, process.env.REFRESH_TOK_SEC, {
    expiresIn: "30d",
  });
  req.session.token = accessToken;
  req.session.save();
  return res.status(200).json({ token: accessToken });
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