var url = "https://api.minetools.eu/ping/andrerpi4.ddns.net/25565";

ping();
function ping() {
   $.getJSON(url, function(r) {
     document.getElementById("buttonNotify").style.visibility="visible";
     $('#rest').html("<b style='margin-left:0%; color: red'>The server is under maintenance</b>");
     return false;
   });
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

function openForm() {
  document.getElementById("myForm").style.display = "block";
}
function closeForm() {
  document.getElementById("myForm").style.display = "none";
}