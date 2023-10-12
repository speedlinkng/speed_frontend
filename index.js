const express = require('express');
const app = express();
const path = require('path');
const allRoute = require('./routes/all.route');
const dotenv = require('dotenv');
const cors=require("cors");
const corsOptions ={
   origin:'http://127.0.0.1:5502', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.set('view engine', 'ejs');


// app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, './views')));
// index page
app.get('/', function(req, res) {
  res.redirect('/dashboard/home.html?app_email=822');
//   +'&app_email=' + res.decoded_access.id
});
 

app.use(cors(corsOptions))
app.use(express.urlencoded({extended: true}));
app.use(express.json()) 
app.use("/dash/", allRoute)


// Handling GET request
app.get('/', (req, res) => {
    res.send('A simple Node App is '
        + 'running on this server')
    res.end()
})
 
// Port Number
const PORT = process.env.PORT ||8000;
 
// Server Setup
app.listen(PORT,console.log(
  `Server started on port ${PORT}`));