var url = "https://api.minetools.eu/ping/andrerpi4.ddns.net/25565";

ping();
function ping() {
   $.getJSON(url, function(r) {
      if(r.error){  //If the Server is Offline
        document.getElementById("buttonNotify").style.visibility="visible";
        $('#rest').html("<b style='margin-left:38%; color: red'>Server Offline</b> <button style='margin-left:33%' id='myBtn' class='my-button' onclick='postToServer();myPopupFunction();myCountDown()'>Turn Server ON<span class='popuptext' id='myPopup'></span></button>");
        return false;
      }
      var info = '<br><br><b>Latency: </b>'+r.latency + 'ms<br><b>Version: </b>'+r.version.name;
      var plist = "";
      if(r.players.online != "0") {  //If there are players to list
        var i;
        plist = "<br><b>Player List: </b>";
        for(i = 0; i < r.players.online; i++) {
          plist +="<br>" +  r.players.sample[i].name;
        }
      }
      var now = new Date();
      now = now.getHours();
      document.getElementById("buttonNotify").style.visibility="visible";
      $('#rest').html("<b style='margin-top: 20%'>" + r.description.substring(2) + "</b>" +"<br><b>Players Online: </b>"+r.players.online+plist+info);
   });
}
var refreshInterval = setInterval(ping, 4 * 60 * 1000);  //Ping server every 4mins (client side)

async function postToServer() {
  await fetch("api/bash", { method: "post" }).catch(console.log);
}

async function notifyOwner(ele) {
  const name = document.getElementById("name");
  const context = document.getElementById("context");
  await fetch("api/notify", { 
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({sub: name.value, cont: context.value})
  }).catch(console.log);
}

function myPopupFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}

function myCountDown() {
  document.getElementById("myBtn").disabled = true;
  var countDownDat = new Date();
  var countDownDate = new Date(countDownDat.getTime() + 2*60000).getTime();

  // Update the count down every 1 second
  var x = setInterval(function() {
    var now = new Date().getTime();
    var distance = countDownDate - now;
    
    // Time calculations for days, hours, minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById("myPopup").innerHTML ="The server is turning ON<br>please wait " + minutes + "m " + seconds + "s ";
    
    if (distance < 0) {
      document.getElementById("myBtn").disabled = false;
      clearInterval(x);
      window.location.reload();
    }
  }, 1000);
}

function openForm() {
  document.getElementById("myForm").style.display = "block";
}
function closeForm() {
  document.getElementById("myForm").style.display = "none";
}