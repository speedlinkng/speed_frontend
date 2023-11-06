const express = require('express');
const router = express.Router();
const request = require('request')
const url = require('url');
const crypto = require('crypto');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path'); // Import the path module
    
router.use(bodyParser.raw({ type: 'application/json' }));
    
router.post('/webhook', function(req, res){
    const express = require('express');
    const crypto = require('crypto');
    const fs = require('fs');
    const bodyParser = require('body-parser');
    const app = express();
    
    // Replace with your Paystack secret key
    const PAYSTACK_SECRET_KEY = 'sk_test_143c3d3f8f72daacfcbbefadc281ad757f884686';

      if (req.method !== 'POST' || !req.get('X-Paystack-Signature')) {
        res.status(400).end();
        return;
      }
    
      
        const signatureHeader = req.get('X-Paystack-Signature');
        const body = req.body;

        // Ensure that 'body' is a buffer or a string
        if (!Buffer.isBuffer(body)) {
            // If 'body' is an object, convert it to a string using JSON.stringify
            if (typeof body === 'object') {
            body = JSON.stringify(body);
            } else {
            res.status(400).end(); // Handle other data types
            return;
            }
        }

        // Validate the signature
        const computedSignature = crypto
            .createHmac('sha512', PAYSTACK_SECRET_KEY)
            .update(body)
            .digest('hex');

        if (computedSignature !== signatureHeader) {
            res.status(403).end();
            return;
        }

    
      // Save the request body to a file (optional)
      const filePath = 'https://speedlink-frontend.onrender.com/dash/paystack.html';
      fs.appendFile(filePath, body, (err) => {
        if (err) {
          console.error('Error saving webhook data:', err);
        }
      });
    
      // Parse the request body as JSON
      try {
        const event = JSON.parse(body);
        // Do something with the event
        console.log('Received event:', event);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    
      res.status(200).end();
    });

    


router.get('/verify', function(req, res) {
    console.log('hi')
    const sampleUrl = req.query;
    console.log(sampleUrl.trxref)
    

        const options = {
        url: 'https://api.paystack.co/transaction/verify/'+sampleUrl.trxref,
        method: 'GET',
        headers: {
            Authorization: 'Bearer sk_test_5388c69b71e0348ae0fbc13d3fa337b26c7db7c3',
        },
        };

        request(options, (error, response, body) => {
        if (error) {
            console.error(error);
        } else {
            const responseData = JSON.parse(body);
           
            if (responseData.data.authorization.authorization_code != '') {
                console.log('Auth: '+responseData.data.authorization.authorization_code);
                console.log('Customer code: '+responseData.data.customer.customer_code);
                console.log('Customer email: '+responseData.data.customer.email);
                console.log('Customer plan: '+sampleUrl.plan);
                res.send(responseData.data.authorization.authorization_code);
            }else{
                res.send(responseData);
            }
        }
        });


})

router.get('/', async function(req, res) {
    console.log('paystack')
    async function init() {
        try {
            const plan = await createPlan();
            // const plan = '000';
            console.log('<><><><>');
            console.log(plan);
            const options = {
                url: 'https://api.paystack.co/transaction/initialize',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer sk_test_5388c69b71e0348ae0fbc13d3fa337b26c7db7c3',
                    'Content-Type': 'application/json',
                },
                json: {
                    email: 'customer@email.com',
                    amount: 20000,
                    plan: plan,
                    callback_url: 'https://speedlink-frontend.onrender.com/paystack/verify?plan='+plan
                },
            };

            request(options, (error, response, body) => {
                if (error) {
                    console.error(error);
                } else {
                    res.send(body.data.authorization_url);
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function createPlan() {
        return new Promise((resolve, reject) => {
            const params = {
                name: 'Speedlink Plus',
                interval: 'hourly',
                amount: 500000,
            };

            const options = {
                url: 'https://api.paystack.co/plan',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer sk_test_5388c69b71e0348ae0fbc13d3fa337b26c7db7c3',
                    'Content-Type': 'application/json',
                },
                json: params,
            };

            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    console.log(body.data.name);
                    console.log(body.data.interval);
                    console.log(body.data.plan_code);
                    resolve(body.data.plan_code);
                }
            });
        });
    }

    init();
});


module.exports = router