const express = require('express');
const app = express();
const path = require('path');
const dahboard = require('./routes/dahboard.route');
const admin = require('./routes/admin.route');
const auth = require('./routes/auth.route');
const dotenv = require('dotenv');
const cors=require("cors");
const corsOptions ={
   origin:'http://127.0.0.1:5502', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.set('view engine', 'ejs');


// app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static/dashboard')));
// app.use(express.static(path.join(__dirname, 'static/Admin')));
app.use(express.static(path.join(__dirname, 'static/auth')));
// app.use(express.static(path.join(__dirname, 'static')));

app.use(cors(corsOptions))
app.use(express.urlencoded({extended: true}));
app.use(express.json()) 
app.use("/dash/", dahboard)
app.use("/auth/", auth)
app.use("/admin/", admin)


app.get('/', function(req, res) {
  res.sendFile(`index.html`, { root: 'static' });
});

// Port Number
const PORT = process.env.PORT ||4000;
 
// Server Setup
app.listen(PORT,console.log(
  `Server started on port ${PORT}`));