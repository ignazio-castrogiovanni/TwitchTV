var usersElem = document.getElementsByClassName("user");
var arrUsers = ['freecodecamp', 'storbeck', 'terakilobyte', 'habathcx', 'RobotCaleb', 'thomasballinger', 'noobs2ninjas', 'beohoff', 'MedryBW', 'brunofin', 'comster404'];
var arrOnlineUsers = [];
var arrOfflineUsers = [];

//initUsers();
updateUsers('All');

// Create the html structure to initially show all the users.
// To be used when the page is loaded for the frst time and every time the 'All' button is pushed.
// View stands for 'All', 'Online', 'Offline'
function initUsers(view) {
    var usersCont = document.getElementById("usersContainer");
    switch (view) {
      case 'All':
        users = arrUsers;
        break;
      case 'Online':
        users = arrOnlineUsers;
        break;
      case 'Offline':
        users = arrOfflineUsers;
        break;
    }
  // Sort the array before showing, so to have a tidier list.
  users = users.sort();
    for (var i = 0; i < users.length; ++i) {
      var newRow = document.createElement('div');
      newRow.setAttribute('class', 'row');
      var emptyCol = document.createElement('div');
      emptyCol.setAttribute('class', 'col-md-4');
      newRow.appendChild(emptyCol);
      var userCol = document.createElement('div');
      userCol.setAttribute('class', 'col-md-4 user');
      userCol.innerHTML = users[i];
      newRow.appendChild(userCol);
      
      var statusSpan = document.createElement('span');
      var userStreamId = users[i] + 'CurrentStream';
      statusSpan.setAttribute('id', userStreamId);
      
      var streamLink = document.createElement('a');
      var linkStreamId = users[i] + 'LinkCurrStream';
      streamLink.setAttribute('id', linkStreamId);
      streamLink.appendChild(statusSpan);
      
      
      
      newRow.appendChild(streamLink);
      usersCont.appendChild(newRow);
    }
  }
  //
  // Check the status of the users and decide what to show (All/Online/Offline)
function updateUsers(view) {
  // There are arrays for online, offline and old user. When I click on 'All'. I refresh the info on the arrays or maps. When I click on Online, Offline I display only the interesting user. 
  removeElementsByClass('row');

  initUsers(view);
  if (view == 'All') {
    // Clear Online, Offline arrays
    arrOnlineUsers = [];
    arrOfflineUsers = [];
    for (var i = 0; i < usersElem.length; ++i) {
      var reqUrl = "https://api.twitch.tv/kraken/streams/" + usersElem[i].textContent;
      sendReq(reqUrl, i);
    }
    //removeElementsByClass("user");
    //initUsers();

  } else if (view == 'Online') {
    removeElementsByClass("offline");
    removeElementsByClass("closed");
  } else if (view == 'Offline') {
    removeElementsByClass("online");
    removeElementsByClass("closed");
  }
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
        arrOfflineUsers.push(usersElem[i].textContent);
      } else {
        status = "online";
        arrOnlineUsers.push(usersElem[i].textContent);
        
        // Show the current stream
        var userStreamId = users[i] + 'CurrentStream';
        var userStream = document.getElementById(userStreamId);
        userStream.textContent = myArr.stream.game;
        
        // Set a link to the current stream
        var linkStreamId = users[i] + 'LinkCurrStream';
        var linkStream = document.getElementById(linkStreamId);
        linkStream.href = myArr.stream.channel.url;
      }
    }

    //usersElem[i].textContent = usersElem[i].textContent + ' ' + status;

    if (usersElem[i].className.indexOf(status) == -1) {
      usersElem[i].classList.add(status);
    }
  }

  JSONReq.send();
}

function removeElementsByClass(className) {
  //alert("OK");
  var elementsOfTheClass = document.getElementsByClassName(className);
  while (elementsOfTheClass[0]) {
    //alert("OK");
    elementsOfTheClass[0].parentNode.removeChild(elementsOfTheClass[0]);
  }
}
var onlineButton = document.getElementById("online");
onlineButton.addEventListener("click", onlineClicked);

function onlineClicked() {
  // Change the button layout to be the active one
  if (!$("#online").hasClass("active")) {
    $("#offline").removeClass("active");
    $("#all").removeClass("active");
    $("#online").addClass("active");
  }
  updateUsers('Online');
}

var offlineButton = document.getElementById("offline");
offlineButton.addEventListener("click", offlineClicked);

function offlineClicked() {
  // Change the button layout to be the active one
  if (!$("#offline").hasClass("active")) {
    $("#online").removeClass("active");
    $("#all").removeClass("active");
    $("#offline").addClass("active");
  }
  updateUsers('Offline');
}

var allButton = document.getElementById("all");
allButton.addEventListener("click", allClicked);

function allClicked() {
  // Change the button layout to be the active one
  if (!$("#all").hasClass("active")) {
    $("#online").removeClass("active");
    $("#offline").removeClass("active");
    $("#all").addClass("active");
  }
  updateUsers('All');
}