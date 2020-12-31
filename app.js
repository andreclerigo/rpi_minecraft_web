const express = require('express');
const request = require('request');
const child_process = require('child_process');
const app = express();
const nodemailer = require('nodemailer');
const fs = require('fs');
var path = require('path');
const port = 80;
var phpExpress = require('php-express')({
  binPath: 'php'
});
'use strict';
require('dotenv').config();


app.use(express.static('public/'))
app.get('/', (req, res) => {
  res.send('');
})

app.engine('php', phpExpress.engine);
app.set('view engine', 'php');
app.all(/.+\.php$/, phpExpress.router);
app.get('/leaderboard', (req, res) => {
  res.render(path.join(__dirname + '/public/stats.php'));
})

app.post("/api/bash", async (req, res) => {
  try{
    child_process.execSync('sudo systemctl start minecraft.service');
    var date = new Date();
    fs.appendFileSync('/var/www/html/myapp/log.txt', 'Server Manually Turned ON at ' + date);
  }catch(error){
    console.error(error);
  }
});

app.post("/api/update", async (req, res) => {
  try{
    child_process.execSync('python3 updatedb.py');
  }catch(error){
    console.error(error);
  }
});

app.use(express.json());
app.post("/api/notify", async (req, res) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
  });
  
  let mailOptions = {
    from: process.env.EMAIL,
    to:   process.env.EMAIL,
    subject: 'Minecraft Notification from: ' + req.body.sub,
    text: req.body.cont
  };
  
  transporter.sendMail(mailOptions, function(err, data) {
    if(err) {
      console.log(err);
    } else {
      fs.appendFileSync('/var/www/html/myapp/log.txt', 'Email sent by: ' + req.body.sub);
      console.log('Email sent!');
    }
  });
});

setInterval(function() {
   var url = 'https://api.minetools.eu/ping/andreraspberry.ddns.net/25565';
   var date = new Date();
   var current_hour = date.getHours();

   request.get({
     url: url,
     json: true,
     headers: {'User-Agent': 'request'}
   }, (err, res, data) => {
     if (err) {
       console.log('Error:', err);
     } else if (res.statusCode !== 200) {
       console.log('Status:', res.statusCode);
     } else {
       try {
         if(data.players.online == 0 && (current_hour >= 22 || current_hour < 10)) {
           child_process.execSync('sudo systemctl stop minecraft.service');
	   console.log("Shuting down due to inactivity at " + date);
       	   fs.appendFileSync('/var/www/html/myapp/log.txt', 'Shutting down due to inactivity at ' + date);
         }
       } catch(err) {
       }
     }
   });
}, 30 * 60 * 1000);


setInterval(function() {
  var date = new Date();
  var current_hour = date.getHours();
  if (current_hour >= 10 && current_hour <= 22) {
    child_process.execSync('sudo systemctl start minecraft.service');
    console.log("Time to wake up turning ON às " + date);  //Debug
    fs.appendFileSync('/var/www/html/myapp/log.txt', 'Time to wakeup turning ON at ' + date);
  }
}, 60 * 60 * 1000);


app.listen(port, () => {
  console.log(`app listening at http://andreraspberry.ddns.net:${port}`)
})
