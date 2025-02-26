const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const fetch = require('node-fetch'); // Use fetch instead of request
const { saveUserSession } = require('../handlers/Session_handler');
const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_PUBLIC_URL);

// Helper function to render the auth page
const renderAuthPage = (res, activeFile, error = null, data = null, data2 = null) => {
  console.log(activeFile, data, error, data2)
  res.render(`auth/auth.ejs`, {
    urls: { base: process.env.BASU_URL, backend: process.env.BACKEND_URL },
    activeFile,
    data,
    data2,
    error,
    baseUrl: process.env.BASE_URL,
    title: "Authorization"
  });
};

// Helper function to render the activate page
const renderActivatePage = (res, data = null, error = null) => {
  res.render(`auth/activate.ejs`, {
    urls: { base: process.env.BASU_URL, backend: process.env.BACKEND_URL },
    activeFile: null,
    data,
    error,
    baseUrl: process.env.BASE_URL,
    title: "Authorization"
  });
};

// Signup route
router.get('/signup', (req, res) => {
  renderAuthPage(res, "signup");
});

// Signin route
router.get('/signin', (req, res) => {
  const { error } = req.query;
  renderAuthPage(res, "signin", error);
});

// Verify recovery token route
router.get("/verify", async (req, res) => {
  const { recovery_id, email } = req.query;

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/users/verifyrecovery?recovery_id=${recovery_id}&email=${email}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const status = response.status;

    if (status === 404) {
      console.log('404 from frontend')
      return res.redirect(`/auth/signin?error=Recovery token not found or expired.`);
    } else if (status === 400) {
      console.log('400 from frontend')
      return res.redirect(`/auth/signin?error=Invalid recovery token.`);
    } else if (status === 200) {
      console.log('200 from frontend')
      return res.redirect(`/auth/newpwd`);
    } else {
      return res.redirect(`/auth/signin?error=Unexpected response from the server.`);
    }
  } catch (err) {
    console.error("Error verifying recovery token:", err);
    return res.redirect(`/auth/signin?error=Internal server error`);
  }
});

// Home route
router.get('/', (req, res) => {
  const { error } = req.query;
  renderAuthPage(res, 'signin', error);
});

// New password route
router.get('/newpwd', async (req, res) => {
  const { recovery_id, email } = req.query;

  if (!recovery_id || !email) {
    return res.redirect('/auth/signin?error=Recovery ID and email are required.');
  }

  try {
    // Retrieve the stored recovery_id from Redis using the email as the key
    const storedRecoveryId = await redisClient.get(`password_recovery:${email}`);

    console.log("Stored Recovery ID:", storedRecoveryId); // Debugging

    if (!storedRecoveryId) {
      console.log('404: Recovery token not found or expired');
      return res.redirect('/auth/signin?error=Recovery token not found or expired.');
    }

    // Compare the user-sent recovery_id with the stored recovery_id
    if (recovery_id !== storedRecoveryId) {
      console.log('400: Invalid recovery token');
      return res.redirect('/auth/signin?error=Invalid recovery token.');
    }

    // Save "access granted" in Redis with a 5-minute expiration
    // await redis.set(`access_granted:${email}`, "access granted", "EX", 300); // 300 seconds = 5 minutes
    console.log('200: Access granted');

    // Render the new password page with the email
    renderAuthPage(res, "newPwd", null, "_050_", email);
  } catch (err) {
    console.error('Error verifying recovery token:', err);
    return res.redirect('/auth/signin?error=Internal server error');
  }
});
// Activate route with dynamic data
router.get('/activate/:data', (req, res) => {
  const { error } = req.query;
  const data = req.params.data;
  renderActivatePage(res, data, error);
});

// Forget password route
router.get('/forget', (req, res) => {
  const { error } = req.query;
  renderAuthPage(res, 'forgot', error);
});

// Activate route
router.get('/activate', (req, res) => {
  const { error } = req.query;
  renderActivatePage(res, null, error);
});

// Catch-all route for unmatched routes
router.use((req, res) => {
  res.status(404).redirect('/auth');
});

module.exports = router;