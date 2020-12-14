var url = "https://api.minetools.eu/ping/andreraspberry.ddns.net/25565";

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
      $('#rest').html("<b style='margin-top: 20%'>" + r.description + "</b>" +"<br><b>Players Online: </b>"+r.players.online+plist+info);
   });
}
var refreshInterval = setInterval(ping, 4 * 60 * 1000);  //Ping server every 4mins (client side)
