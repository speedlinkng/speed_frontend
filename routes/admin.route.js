const express = require('express');
const router = express.Router();
const path = require('path');
const request = require("request");
const serveStatic = require('serve-static');
const dotenv = require('dotenv');
const crypto = require('crypto');
const {sign, decode} = require("jsonwebtoken")
dotenv.config(); 


async function fetchAdminGoogle(token) {
  return new Promise((resolve, reject) => {

  
    request(
      {
        method: "GET",
        url: process.env.BACKEND_URL + `/api/admin/getAdminDrive`,
        headers: {
          "Authorization": `Bearer ${token}`
        }
      },
      (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          let status = response.statusCode;
          if (status == 200) {
            const parsedBody = JSON.parse(body); 
            console.log(parsedBody.admin_drive)
            resolve(parsedBody);
          } else {
            reject(new Error(`Unexpected status code: ${status}`));
          }
        }
      }
    );
  });
}

function decrypt(data, key) {
  const iv = Buffer.from(data.iv, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(data.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
  router.get('/:encryptData', async function(req, res) {
    console.log('render admin panel')
    let adminData = ''
    const encryptData = req.params.encryptData;
    if (!encryptData) {
      return res.status(701).json({ message: 'Unauthorized' });
    }

    req.session.encryptData = encryptData
    console.log(req.session.encryptData)
    req.session.save()

    
    try {
      adminData = await fetchAdminGoogle(encryptData)
      console.log('ADMIN DATA',adminData) 
    } catch (error) {
      console.error(error);
    }
    const decodedToken = decode(encryptData);
    const data = decodedToken.result


    res.render("admin/admin.ejs", {title:'Speedlink Admin Panel', drive:adminData.admin_drive, data: data});
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