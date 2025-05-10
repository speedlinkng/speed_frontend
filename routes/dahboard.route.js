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

async function fetchUser(token) {
  console.log(`Token is: `, token);
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
}

function decode1(token, res) {
  // TOKENIZE BACKEND USER ACCESS TOKEN, FOR FRONTEND SERVER-SIDE ACCESS
  if (!token) {
    console.log('Token is missing, redirecting...');
    res.redirect(`${process.env.BASE_URL}/auth/`);
    return null;
  }

  let decodedToken;
  try {
    decodedToken = decode(token);
  } catch (err) {
    console.error('Error decoding token:', err);
    res.redirect(`${process.env.BASE_URL}/auth/`);
    return null;
  }

  let this_user_token = decodedToken.this_user_token;
  if (!this_user_token) {
    console.error('this_user_token is missing from decoded token.');
    res.redirect(`${process.env.BASE_URL}/auth/`);
    return null;
  }

  return decode2(this_user_token);
}

function decode2(this_user_token) {
  let decodedToken;
  try {
    decodedToken = decode(this_user_token);
  } catch (err) {
    console.error('Error decoding this_user_token:', err);
    return null;
  }

  const data = decodedToken.result;
  return data;
}

router.get('/', async function (req, res) {
  let userData;
  let token;

  // 1. Get the token from Redis
  try {
    token = await redisClient.get('userToken:' + req.sessionID); // Use a key associated with the user, e.g., session ID
    console.log("TOKEN FROM REDIS: ", token);
  } catch (error) {
    console.error('Error fetching token from Redis:', error);
    return res.status(500).send('Error accessing Redis');
  }

  if (!token) {
    console.log("Token not found in Redis, redirecting to auth");
    return res.redirect('/auth'); // Redirect if no token
  }

  // 2. Fetch user data
  try {
    userData = await fetchUser(token);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.redirect('/auth');
    //removed  return res.status(500).send('Error fetching user data');
  }
  const _data = decode1(token, res);
  if (_data !== null) {
    res.render("dashboard/home.ejs", {
      urls: { base: process.env.BASE_URL, backend: process.env.BACKEND_URL },
      title: 'Home page',
      role: userData.role,
      data: userData
    });
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