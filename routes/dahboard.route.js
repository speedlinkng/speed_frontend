const express = require('express');
const router = express.Router();
const path = require('path');
const request = require("request");
const axios = require('axios');
const {sign, decode} = require("jsonwebtoken")
const serveStatic = require('serve-static'); 
const redisClient = require('../redisClient'); // Import the Redis client
const {deTokenize} = require('../middlewars/FunctionsController');

router.get('/doc', function(req, res) {
  console.log('its done')
  res.render(`test/test1.ejs`, {urls: {backend: process.env.BACKEND_URL}, title: 'Test Tables' });
  
});

async function fetchUser(email) { // Modified to accept email
  console.log(`Fetching user data for email: `, email);
  try {
    const token = await redisClient.get("userToken:" + email);
    console.log("Token from Redis for fetchUser:", token);
    if (!token) {
      throw new Error("User token not found in Redis for this email.");
    }
    return new Promise((resolve, reject) => {
      let decodedToken;
      try {
        decodedToken = decode(token);
      } catch (err) {
        console.error('Error decoding token:', err);
        return reject(err);
      }

      let decodedToken_;
      try {
        decodedToken_ = decode(decodedToken.this_user_token);
      } catch (err) {
        console.error('Error decoding this_user_token:', err);
        return reject(err);
      }

      const data = decodedToken_.result;

      request(
        {
          method: "GET",
          url: `${process.env.BACKEND_URL}/api/app/checkonrefresh`,
          headers: {
            "Authorization": `Bearer ${decodedToken.this_user_token}`
          }
        },
        (err, response, body) => {
          if (err) {
            return reject(err);
          } else {
            let status = response.statusCode;

            if (status === 200) {
              const parsedBody = JSON.parse(body);
              console.log(parsedBody.results);
              resolve(parsedBody.results);
            } else {
              reject(new Error(`Unexpected status code: ${status}`));
            }
          }
        }
      );
    });
  } catch (error) {
    console.error("Error in fetchUser:", error);
    throw error; // Re-throw the error to be caught in the route handler
  }
}

router.get('/', async function (req, res) {
  try {
    const email = await redisClient.get("frontendlogin");
    console.log("Email from Redis:", email);
    if (!email) {
      return res.redirect('/auth'); // Or handle as needed if no email in Redis
    }

    const userData = await fetchUser(email);

    res.render("dashboard/home.ejs", {
      urls: { base: process.env.BASE_URL, backend: process.env.BACKEND_URL },
      title: 'Home page',
      role: userData.role,
      data: userData
    });

  } catch (error) {
    console.error("Error fetching user data:", error);
    res.redirect('/auth'); // Redirect on error
    // Or res.status(500).send('Error fetching user data');
  }
});

  router.get('/bridge', function(req, res) {
    res.render(`dashboard/bridge.ejs`, {urls: {backend: process.env.BACKEND_URL}, title: 'Bridge' });
  });

  router.get('/share', function(req, res) {
    res.render(`dashboard/share.ejs`, {urls: {backend: process.env.BACKEND_URL}, title: 'Share Link' });
  });

  router.get('/create', function(req, res) {
    res.render("dashboard/create.ejs", {urls: {backend: process.env.BACKEND_URL}, title: 'Create page'});
  });

  router.get('/todash/:pass', deTokenize, function(req, res) {
    console.log(res.decoded_access)
    res.render("dashboard/home.ejs", {urls: {backend: process.env.BACKEND_URL}, title: 'Dashboard' });
  });

  router.get('/pricing', function(req, res) {
    res.render(`dashboard/pricing.ejs`, {urls: {backend: process.env.BACKEND_URL}, root: 'views/dashboard' });
  });

  router.get('/upload/:id', function(req, res) {
    res.render(`dashboard/upload.ejs`, {urls: {backend: process.env.BACKEND_URL}, root: 'views/dashboard' });
  });

  router.get('/testt', function(req, res) {
    res.render(`test/test1.ejs`, {urls: {backend: process.env.BACKEND_URL}, root: 'views/dashoard' });
  });

  // router.post('/paystack', logout)


  

module.exports = router