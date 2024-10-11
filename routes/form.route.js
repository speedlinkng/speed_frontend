const express = require('express');
const router = express.Router();
const request = require("request");
const axios = require('axios');
const path = require('path');
const {sign, decode} = require("jsonwebtoken")


  router.get('/preview', async function(req, res) {

    console.log('preview')
    res.render("dashboard/form/preview/preview", {urls: {backend: process.env.BACKEND_URL}, title: 'Preview Page'});
  })

router.get('/expired', async function (req, res) {
  res.render("dashboard/form/expired", { 
    title: 'EXPIRED page', 
    urls: {backend: process.env.BACKEND_URL}
});
  })
  router.get('/:record_id', async function(req, res) {
    // console.log(req.params.record_id)
    // GET RECORD_ID
    let record_id = req.params.record_id
    // check DB and gt the data record for form_id
    const http = require('http');
    request(
      {
        method: "GET",
        url:process.env.BACKEND_URL+`/api/app/getUploadRecordById/${record_id}`
      },
      (err, response, body) => {
        if (err) {
          console.log(err);
          
        }else {
          let bodyString = body;
          let result = JSON.parse(bodyString);
     
          // console.log(result);
          // console.log(result.data.allReplies);
          // console.log('#####################');
          // console.log(result.data.recordData.expiry_date);
      
          // Parse the expiry_date
          let expiryDate = new Date(result.data.recordData.expiry_date);
          let currentDate = new Date();

          console.log(currentDate);
          console.log(expiryDate);
      
          // Check if the expiry date has passed
          if (expiryDate < currentDate) {
            res.render("dashboard/form/expired", {
                  urls: {backend: process.env.BACKEND_URL},
                  title: 'Expired page', 
                  data: result, 
                  uploadToken: result.data.uploadToken, 
                  allRepliesFolder: result.data.allReplies 
            });
          } else {
              // Handle different status codes
              if (result.status == 404) {
                res.render("dashboard/form/form", { 
                    urls: {backend: process.env.BACKEND_URL},
                      title: 'Form page', 
                      data: result, 
                      uploadToken: result.data.uploadToken 
                  });
              } else if (result.status == 200) {
                res.render("dashboard/form/form", { 
                    urls: {backend: process.env.BACKEND_URL},
                      title: 'Form page', 
                      data: result, 
                      uploadToken: result.data.uploadToken, 
                      allRepliesFolder: result.data.allReplies 
                  });
              }
          }
      }
      
    })  
  

    // if (_data !== null) {
    //     // Handle the decoded data and render the response in this route handler.
    //     res.render("dashboard/home", { title: 'Home page', role: _data.role });
    // }
  });


  module.exports = router