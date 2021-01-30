const express = require('express');
const request = require('request');
const child_process = require('child_process');
const app = express();
const nodemailer = require('nodemailer');
const fs = require('fs');
var path = require('path');
const port = process.env.NODE_PORT || 80;
var phpExpress = require('php-express')({
  binPath: 'php'
});
'use strict';
require('dotenv').config();


app.use(express.static('/var/www/html/myapp/public'))
app.get('/', (req, res) => {
  res.send('');
})

app.set('views', './views');
app.engine('php', phpExpress.engine);
app.set('view engine', 'php');
app.all(/.+\.php$/, phpExpress.router);

app.get('/leaderboard', (req, res) => {
  try {
    res.render(path.join(__dirname + '/public/stats.php'));
  }catch(error) {
    console.log("Erro no php");
  }
})

app.post("/api/bash", async (req, res) => {
  try{
    child_process.execSync('sudo systemctl start minecraft.service');
    var date = new Date();
    fs.appendFileSync('/var/www/html/myapp/debug.log', 'Server Manually Turned ON at ' + date + '\n');
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
    text: req.body.cont + '\nUser\'s Information: ' + req['headers']['user-agent']
  };
  
  transporter.sendMail(mailOptions, function(err, data) {
    if(err) {
      console.log(err);
    } else {
      fs.appendFileSync('/var/www/html/myapp/debug.log', 'Email sent by: ' + req.body.sub + '\n');
      console.log('Email sent!');
    }
  });
});

setInterval(function() {
    var url = process.env.WEBSITE;
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
      } else if (current_hour >= 10 && current_hour <= 22) {
        try {
          if (data.error != null) {
            child_process.execSync('sudo systemctl start minecraft.service');
            fs.appendFileSync('/var/www/html/myapp/debug.log', 'Time to wakeup turning ON at ' + date + '\n');
          }
        } catch (err) {
        }
      } else {
        try {
          if(data.players.online == 0 && (current_hour >= 22 || current_hour < 10)) {
            child_process.execSync('sudo systemctl stop minecraft.service');
            fs.appendFileSync('/var/www/html/myapp/debug.log', 'Shutting down due to inactivity at ' + date + '\n');
          }
        } catch(err) {
        }
     }
   });
}, 30 * 60 * 1000);

app.listen(port, () => {
  console.log(`app listening at ` + process.env.IP + ` :${port}`);
})
