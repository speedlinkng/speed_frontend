const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const fetch = require('node-fetch'); // Use fetch instead of request
const { saveUserSession } = require('../handlers/Session_handler');

// Helper function to render the auth page
const renderAuthPage = (res, activeFile, error = null, data = null) => {
  res.render(`auth/auth.ejs`, {
    urls: { base: process.env.BASU_URL, backend: process.env.BACKEND_URL },
    activeFile,
    data,
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
      return res.redirect(`/auth/signin?error=Recovery token not found or expired.`);
    } else if (status === 400) {
      return res.redirect(`/auth/signin?error=Invalid recovery token.`);
    } else if (status === 200) {
      return res.redirect(`/auth`);
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
  renderAuthPage(res, null, error);
});

// New password route
router.get('/newpwd', (req, res) => {
  const { error } = req.query;
  renderAuthPage(res, 'newPwd', error);
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