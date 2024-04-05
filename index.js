const express = require('express');
const app = express();
const path = require('path');
const crypto = require('crypto');
const dashboard = require('./routes/dahboard.route');
const form = require('./routes/form.route');
const admin = require('./routes/admin.route');
const auth = require('./routes/auth.route');
const paystack = require('./routes/paystack.route');

const {sign, decode} = require("jsonwebtoken")
const dotenv = require('dotenv');
const cors=require("cors");
const corsOptions ={
   origin:'http://127.0.0.1:5502', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}


app.set('view engine', 'ejs');

// app.set("views", process.cwd()+"/view")


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'views/includes')));
app.use(express.static(path.join(__dirname, 'views/dashboard')));
app.use('/auth', express.static(path.join(__dirname, 'public')));



app.use(cors(corsOptions))
app.use(express.urlencoded({extended: true}));
app.use(express.json()) 


app.use("/dash/", dashboard)
app.use("/form/", form)
app.use("/auth/", auth)
app.use("/admin/", admin)
app.use("/paystack/", paystack)



app.get('/', function(req, res, next) {
  res.render("main.ejs");
});


let count = 0
app.get('/count', function(req, res, next) {
  count += 1
  res.send('count is:' + count)
});


// Port Number
const PORT = process.env.PORT ||4000;
 
// Server Setup
app.listen(PORT,console.log(
  `Server started on port ${PORT}`));