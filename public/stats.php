<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Leaderboard</title>
<link href="https://fonts.googleapis.com/css?family=Roboto+Mono" rel="stylesheet" />
<link href="/css/style.css" rel="stylesheet"/>
<link rel="shortcut icon" href="https://cdn.worldvectorlogo.com/logos/minecraft-1.svg"/>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="/js/script.js"></script>
<script>
async function updateDatabase() {
  await fetch("api/update", { method: "post" }).catch(console.log);
}
</script>
</head>
<body onload="updateDatabase()">
<div class="card" style="width:480px; min-width:420px">
  <div class="icon"><img src="https://cdn.worldvectorlogo.com/logos/minecraft-1.svg"></div>
  <div class="header">
    <div class="image"> <img src="https://res.cloudinary.com/lmn/image/upload/e_sharpen:100/f_auto,fl_lossy,q_auto/v1/gameskinnyc/u/n/t/untitled-a5150.jpg" alt="" /> </div> 
      <h2>Server's Leaderboard</h2>
    </div>
	  <?php
      $servername = "localhost";
      $username = "exampleuser";
      $password = "pimylifeup";
      $dbname = "exampledb";

      $conn = mysqli_connect($servername, $username, $password, $dbname);
      if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
      }
      $sql = "SELECT NickHours, horas, NickDeaths, deaths FROM Leaderboard";
      $result = mysqli_query($conn, $sql);

      echo '<div class="popup" style="color:#4a6d62; margin-top:35px">
            <table style="width:100%; margin-left:30px; margin-bottom:20px">
            <tr>
              <th>Top Time Played</th>
              <th>Top Deaths</th>
            </tr>';
      $a = 1;
      if (mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_assoc($result)) {
          echo "<tr>";
          echo "<td><b>" . $a . ".</b>" . $row["NickHours"] . " - " . $row["horas"] . "h</td>";
          echo "<td><b>" . $a++ . ".</b>" . $row["NickDeaths"] . " - " . $row["deaths"] . "</td>";
          echo "</tr>";
        }
      } else {
        echo "No data";
      }

      mysqli_close($conn);
      ?>
      </table>
      <br>
      </div>
      <a href="/" style="text-decoration:none"><button id="buttonNotify" class="open-button" style="margin-left:41%">Home</button></a>
    </div>
  </div>
</div>
</body>
</html>