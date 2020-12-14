var url = "https://api.minetools.eu/ping/andreraspberry.ddns.net/25565";

ping();
function ping() {
   $.getJSON(url, function(r) {
     document.getElementById("buttonNotify").style.visibility="visible";
     $('#rest').html("<b style='margin-left:0%; color: red'>The server is under maintenance</b>");
     return false;
   });
}
