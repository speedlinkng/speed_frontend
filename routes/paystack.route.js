const express = require('express');
const router = express.Router();
const request = require('request')
const https = require('https');
const url = require('url');
const crypto = require('crypto');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path'); // Import the path module

    
router.use(bodyParser.raw({ type: 'application/json' }));
    




router.get('/cancel', function(req, res){

     function cancel(){
    

        const options = {
        url: 'https://api.paystack.co/subscription/disable',
        method: 'POST',
        headers: {
            Authorization: 'Bearer sk_test_143c3d3f8f72daacfcbbefadc281ad757f884686',
            'Content-Type': 'application/json'
        },
        json: {
            code: 'SUB_q43eot2ku0l7v7k',
            token: 'wrqwk3bi9mf006y'
        }
        };
        
        request(options, (error, response, body) => {
        if (error) {
            console.error(error);
        } else {
            confirmCancel()
            console.log(body);
        }
        });
    }

     function confirmCancel(){
      

        const options = {
        url: 'https://api.paystack.co/subscription/SUB_fde32hknzjuup5j',
        method: 'GET',
        headers: {
            Authorization: 'Bearer sk_test_143c3d3f8f72daacfcbbefadc281ad757f884686',
        },
        // json: {
        //     code: 'SUB_fde32hknzjuup5j',
        //     token: '6ltghw44x01ck5k'
        // }
        };
        
        request(options, (error, response, body) => {
        if (error) {
            console.error(error);
            res.send(error)
            return
        } else {
            confirmCancel()
            console.log(body);
            res.send(body)
            return
        }
        });
    }

    cancel()
    
})

app.post('/webhook', function(req, res) {
    console.log('Webhook received');

    // Get the signature from the headers
    const signatureHeader = req.get('X-Paystack-Signature');
    if (!signatureHeader) {
        return res.status(400).send('No signature header');
    }

    // Get the raw request body
    let body = req.body;

    // Ensure that 'body' is a buffer or a string
    if (!Buffer.isBuffer(body)) {
        // If 'body' is an object, convert it to a string using JSON.stringify
        if (typeof body === 'object') {
            body = JSON.stringify(body);
        } else {
            return res.status(400).end(); // Handle other data types
        }
    }

    // Validate the signature
    const computedSignature = crypto
        .createHmac('sha512', PAYSTACK_SECRET_KEY)
        .update(body)
        .digest('hex');

    if (computedSignature !== signatureHeader) {
        return res.status(403).send('Invalid signature');
    }

    // Parse the request body as JSON
    const event = JSON.parse(body);
    console.log('Received event:', event);


    
    if (event.event === 'subscription.create') { 
        console.log('Charge was successful and subscription was created: ', event.data);
    }
    if (event.event === 'invoice.create') { 
        console.log('An invoice was crested ', event.data);
    }
    if (event.event === 'invoice.payment_failed') { 
        console.log('An invoice to be sent failed: ', event.data);
    }
    if (event.event === 'subscription.not_renew') { 
        console.log('subscription.not_renew : ', event.data);
    }

    if (event.event === 'invoice.update') { 
        console.log('invoice.updated : ', event.data);
        console.log(event.data.subscription.status)
    }
    // Check if the event is "charge.success"
    if (event.event === 'charge.success') {
        console.log('Charge was successful:', event.data);

        // Save the event data to a file (for logging purposes)
        fs.appendFile('paystack.json', body, (err) => {
            if (err) {
                console.error('Error appending to paystack.json:', err);
            } else {
                console.log('Appended to paystack.json');
                fs.readFile('paystack.json', 'utf8', (readErr, data) => {
                    if (readErr) {
                        console.error('Error reading paystack.json:', readErr);
                    } else {
                        console.log('Content of paystack.json:');
                        console.log(data);
                    }
                });
            }
        });
    } else {
        console.log('Event is not charge.success, ignoring.');
    }

    res.status(200).send('Webhook processed successfully');
});

router.post('/webhooks', function(req, res){
    console.log('webhook running')


    
    // Replace with your Paystack secret key
    const PAYSTACK_SECRET_KEY = 'sk_test_143c3d3f8f72daacfcbbefadc281ad757f884686';

      if (req.method !== 'POST' || !req.get('X-Paystack-Signature')) {
        res.status(400).end();
        return;
      }
    
      
        const signatureHeader = req.get('X-Paystack-Signature');
        let body = req.body;

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


        // Append the 'body' variable to package.json
        fs.appendFile('paystack.json', body, (err) => {
            if (err) {
            console.error('Error appending to package.json:', err);
            } else {
            console.log('Appended to package.json');
            // Now, let's read the content from package.json
            fs.readFile('paystack.json', 'utf8', (readErr, data) => {
                if (readErr) {
                console.error('Error reading paystack.json:', readErr);
                } else {
                console.log('Content of paystack.json:');
                console.log(data);
                }
            });
            }
        });

    
    //   // Save the request body to a file (optional)
    //   const filePath = 'https://speedlink-frontend.onrender.com/dash/paystack.html';
    //   fs.appendFile(filePath, body, (err) => {
    //     if (err) {
    //       console.error('Error saving webhook data:', err);
    //     }else{
    //         console.log(body)
    //     }
    //   });

    //             const url = 'https://speedlink-frontend.onrender.com/dash/paystack.html';

    //             https.get(url, (response) => {
    //             let data = '';

    //             response.on('data', (chunk) => {
    //                 data += chunk;
    //             });

    //             response.on('end', () => {
    //                 console.log(data); // Display the content of paystack.html
    //             });
    //             }).on('error', (error) => {
    //             console.error('Error fetching content:', error);
    //             });

    
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
    async function verify() {
        try {

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
                    res.send(responseData);
                    createSub(responseData.data.customer.customer_code)
                }else{
                    res.send(responseData);
                }
            }
            });
        }
        catch(error){
            console.log(error)
        }
    }

    async function createSub(CUS_ccode) {
        return new Promise((resolve, reject) => {
            const params = {
                customer: CUS_ccode , plan: sampleUrl.plan
            };

            const options = {
                url: 'https://api.paystack.co/subscription',
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
                    console.log(body.data.subscription_code);
                    console.log(body.data.email_token);
                    console.log(body.data.status);
                }
            });
        });
    }

        verify()
})

router.get('/', async function(req, res) {
    console.log('paystack')
    async function init() {
        try {
            const plan = await createPlan();
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
                    first_name: 'Divine ',
                    first_name: 'iso',
                    amount: 20000,
                    // plan: plan,
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
                interval: 'daily',
                amount: 30000,
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