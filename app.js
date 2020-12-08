const express = require('express');
const child_process = require('child_process');
const app = express();
const nodemailer = require('nodemailer');
const port = 80;
'use strict';
require('dotenv').config();
var request = require('request');

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('');
})

app.post("/api/bash", async (req, res) => {
  try{
    child_process.execSync('sudo systemctl start minecraft.service');
  }catch(error){
    console.error(error);
  }
});

app.use(express.json());
app.post("/api/notify", async (req, res) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'andreclerigo@gmail.com',
        pass: process.env.PASSWORD
    }
  });
  
  let mailOptions = {
    from: 'andreclerigo@gmail.com',
    to:   'andreclerigo@gmail.com',
    subject: 'Minecraft Notification from: ' + req.body.sub,
    text: req.body.cont
  };
  
  transporter.sendMail(mailOptions, function(err, data) {
    if(err) {
      console.log(err);
    } else {
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
         if(data.players.online == 0 && current_hour >= 22 || current_hour <= 10) {
           child_process.execSync('sudo systemctl stop minecraft.service');
	   console.log("Shuting down due to inactivity");
         }
       } catch(err) {
         console.log("Já está desligado");
       }
     }
   });
}, 30 * 60 * 1000);


setInterval(function() {
  var date = new Date();
  var current_hour = date.getHours();
  if (current_hour >= 10 && current_hour <= 22) {
    child_process.execSync('sudo systemctl start minecraft.service');
    console.log("Time to wake up turning ON");  //Debug
  }
}, 60 * 60 * 1000);


app.listen(port, () => {
  console.log(`app listening at http://andreraspberry.ddns.net:${port}`)
})
