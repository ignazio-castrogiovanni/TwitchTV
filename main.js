var usersElem = document.getElementsByClassName("user");

for (var i = 0; i < usersElem.length; ++i) {
  var reqUrl = "https://api.twitch.tv/kraken/streams/" + usersElem[i].textContent;
  //alert(reqUrl);
  sendReq(reqUrl, i);
}

function sendReq(url, i) {
  var status = "";
  var JSONReq = new XMLHttpRequest();
  JSONReq.open("GET", url, true);
  JSONReq.onreadystatechange = function() {

    if (JSONReq.readyState == 4 && JSONReq.status == 422) {
      status = "closed";
    }
    // alert(JSON.stringify(JSON.parse(JSONReq.responseText)));
    else if (JSONReq.readyState == 4 && JSONReq.status == 200) {
      // alert("fdfdf");
      var myArr = JSON.parse(JSONReq.responseText);

      if (myArr['stream'] === null) {
        status = "offline";
      } else {
        status = "online";
      }
    }
    var usersElem = document.getElementsByClassName("user");
    usersElem[i].textContent = usersElem[i].textContent + ' ' + status;
  }

  JSONReq.send();
}