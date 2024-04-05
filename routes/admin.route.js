const express = require('express');
const router = express.Router();
const path = require('path');
const serveStatic = require('serve-static');
const dotenv = require('dotenv');
const crypto = require('crypto');
dotenv.config(); 




function decrypt(data, key) {
  const iv = Buffer.from(data.iv, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(data.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

  router.get('/', function(req, res) {
    console.log('render admin panel')
    res.render("admin/admin", {title:'Speedlink Admin Panel' });
  })

  // router.get('/dash/:encryptData/:iv', function(req, res) {
    
  //   const encryptData = req.params.encryptData;
  //   const iv = req.params.iv;

  //   if (!encryptData || !iv) {
  //     return res.status(400).send('Invalid or missing encryption data or initialization vector');
  //   }
  
  //   try {
  //       // console.log(encryptData)
  //       // Store decrypted data in the session
  //       req.session.encryptData = encryptData;
  //       req.session.iv = iv;
  //       console.log(req.session.iv)
  //       console.log(req.session.encryptData)
  //       data = 
  //         {
  //           iv: req.session.iv,
  //           encryptedData: req.session.encryptData
  //         }
        
  //     const decypted = decrypt(data, process.env.ADMIN_KEY)
  //     req.session.decypted = decypted;
  //       res.redirect('http://localhost:4000/admin/admin/');  
        
  //   }catch(err){
  //     console.log(err)
  //   }
  // });

//   router.get('/pricing', function(req, res) {
//     res.sendFile(`pricing.html`, { root: 'static/dashboard' });
//   });
  

module.exports = router