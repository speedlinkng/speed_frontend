const express = require('express');
const router = express.Router();
const path = require('path');
const request = require("request");
const axios = require('axios');
const {sign, decode} = require("jsonwebtoken")
const serveStatic = require('serve-static'); 
const {deTokenize} = require('../middlewars/FunctionsController');

router.get('/test0', function(req, res) {
  console.log('its done')
  console.log(req.session.token)
  console.log(req.sessionID)
  
});

function decode1(token, res) {
  // TOKENIZE BACKEND USER ACCESS TOKEN, FOR FRONTEND SERVER-SIDE ACCESS
  if (!token) {
    res.redirect(`${process.env.BASE_URL}/auth/`);
    return null;  // Return early if there's no token
  }

  const decodedToken = decode(token);
  let this_user_token = decodedToken.this_user_token;
  return decode2(this_user_token);
}

function decode2(this_user_token) {
  const decodedToken = decode(this_user_token);
  const data = decodedToken.result; // Use 'const' to declare variables
  return data;
  // Handle the decoded data as needed
}
async function fetchUser(token) {
  return new Promise((resolve, reject) => {
    const decodedToken = decode(token);

    const decodedToken_ = decode(decodedToken.this_user_token);
    const data = decodedToken_.result
  
    request(
      {
        method: "GET",
        url: process.env.BACKEND_URL + `/api/app/checkonrefresh`,
        headers: {
          "Authorization": `Bearer ${decodedToken.this_user_token}`
        }
      },
      (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          let status = response.statusCode;

          if (status == 200) {
            const parsedBody = JSON.parse(body); 
            console.log(parsedBody.results)
            resolve(parsedBody.results);
          } else {
            reject(new Error(`Unexpected status code: ${status}`));
          }
        }
      }
    );
  });
}

  router.get('/', async function(req, res) {

    // fetch data again
    // ------------------------

    let userData;
    console.log(req.session.token)
    try {
      userData = await fetchUser(req.session.token)
      // console.log('@@@@@@@@@@@@@@@')
      // console.log(userData); // Do something with the response
     
    } catch (error) {
      console.error(error);
    }

    const _data = decode1(req.session.token, res);
  
    // console.log('&&&&&&&&&&&7')

      // console.log(_data)
      // console.log('_data')

    if (_data !== null) {
        // Handle the decoded data and render the response in this route handler.
        res.render("dashboard/home.ejs", { title: 'Home page', role: userData.role, data: userData });
    }
  });

  router.get('/share', function(req, res) {
    res.render(`dashboard/share.ejs`, { totle: 'Share Link' });
  });

  router.get('/create', function(req, res) {
    res.render("dashboard/create.ejs", { title: 'Create page'});
  });

  router.get('/todash/:pass', deTokenize, function(req, res) {
    console.log(res.decoded_access)
    res.render("dashboard/home.ejs", { title: 'Home page' });
  });

  router.get('/pricing', function(req, res) {
    res.render(`dashboard/pricing.ejs`, { root: 'views/dashboard' });
  });

  router.get('/upload/:id', function(req, res) {
    res.render(`dashboard/upload.ejs`, { root: 'views/dashboard' });
  });

  router.get('/testt', function(req, res) {
    res.render(`test/test1.ejs`, { root: 'views/dashoard' });
  });

  // router.post('/paystack', logout)


  

module.exports = router