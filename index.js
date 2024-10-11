const express = require('express');
const app = express();
const path = require('path');
const crypto = require('crypto');
const dashboard = require('./routes/dahboard.route');
const form = require('./routes/form.route');
const admin = require('./routes/admin.route');
const auth = require('./routes/auth.route');
const paystack = require('./routes/paystack.route');
const session = require('express-session');
const {sign, decode} = require("jsonwebtoken")
const dotenv = require('dotenv');
const cors = require("cors");
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');

const corsOptions ={
  origin:'http://127.0.0.1:5502', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379' // Use environment variable or default
});

// Connect to Redis
redisClient.connect().catch(console.error);

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
  
});

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 20 * 60 * 1000, // 2 minutes in milliseconds
      secure: process.env.NODE_ENV === 'production', // Secure cookie in production
      httpOnly: true,
      // sameSite: 'strict' 
  }

  })
);


app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'views/includes')));
app.use(express.static(path.join(__dirname, 'views/dashboard')));
app.use(express.static(path.join(__dirname, 'views/admin')));
app.use('/auth', express.static(path.join(__dirname, 'public')));


// app.use(cors(corsOptions))
app.use(express.urlencoded({extended: true}));
app.use(express.json()) 


app.use("/dash/", dashboard)
app.use("/form/", form)
app.use("/auth/", auth)
app.use("/admin/", admin)
app.use("/paystack/", paystack)


app.get('/exchange', function(req, res, next) {
  console.log('exch')
  // TOKENIZE BACKEN USER ACCESS TOKEN, FOR FRONTEND SERVERSIDE ACCESS
  let token = req.headers.authorization; // Assuming the token is in the request headers
  if (!token) {
      return res.status(701).json({ message: 'Unauthorized' });
  }
  token = token && token.split(' ')[1];
  //  const decodedToken = decode(token);
  //  console.log(decodedToken)
  const accessToken = sign({this_user_token : token}, process.env.REFRESH_TOK_SEC, {
      expiresIn: "30d"
  })
  // console.log(accessToken)
  req.session.token = accessToken
  // console.log(req.sessionID)
  // console.log(req.session.token)
  req.session.save()
  return res.status(200).json({
     token:accessToken
  })


})
app.get('/', function(req, res, next) {
  // req.session.username = 'JohnDoe';
  // req.session.save()
  // console.log(req.sessionID)
  // console.log(req.session.token)
  // use redirect 
  res.redirect(`${process.env.FRONTEND_URL}/dash`);
  // res.render("dashboard/home.ejs");
});

// Port Number
const PORT = process.env.PORT ||4000;
 
// Server Setup
app.listen(PORT,console.log(
  `Server started on port ${PORT}`));