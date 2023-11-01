const express = require('express');
const router = express.Router();
const path = require('path');
const serveStatic = require('serve-static'); 


//   router.get('/create', function(req, res) {
//     res.sendFile(`create.html`, { root: 'static/dashboard' });
//   });

  router.get('/', function(req, res) {
    res.sendFile(`admin.html`, { root: 'static/admin' });
  });

//   router.get('/pricing', function(req, res) {
//     res.sendFile(`pricing.html`, { root: 'static/dashboard' });
//   });
  

module.exports = router