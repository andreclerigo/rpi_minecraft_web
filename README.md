# rpi_minecraft_web
My little project on a home made minecraft server and website

# Structure
<pre>
myapp  
├── app.js  
├── debug.log  
├── package.json  
├── package-lock.json  
├── public  
│   ├── css  
│   │   └── style.css  
│   ├── index.html  
│   ├── js  
│   │   ├── maintenance.js  
│   │   └── script.js  
│   ├── maintenance.html  
│   └── stats.php  
├── README.md  
└── updatedb.py  
</pre>

Don't forget to ```npm init``` on the directory and ```npm install <package>``` listed in package.json  
To run the application ```sudo node app.js``` (better to run inside a screen)

# Design
![](https://i.imgur.com/4YnCpTx.png)

# Create a service
On `line 8` in `website.service`  
Change `/var/www/html/myapp/app.js` to `your_path_to_file/app.js`  
If you aren't sure what's the path to the file go inside the directory that contains the file and do `pwd` on the terminal  

Now open the terminal on `myapp/` and run  
```
sudo cp website.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl start website.service
sudo systemctl enable website.service
```
The last command is to make sure that the service is started on system startup
