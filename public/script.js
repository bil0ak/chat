var socket = io();

var peer = new Peer({
  host: location.hostname,
  port: 3001,
  path: "/peerjs",
});

//create user id
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

var myId = uuidv4();
console.log(myId);

var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");

var vidbtn = document.getElementById("video-call");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const user_name = urlParams.get("username");

vidbtn.addEventListener("click", videocall);

function videocall() {
  location.href = "/video/" + ROOM_ID;
}

//Join room
peer.on("open", (id) => {
  socket.emit("joinRoom", ROOM_ID, id, user_name);
  myId = id;
});

//send chat message
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    if (socket.connected) {
      socket.emit("chat message", input.value, myId, user_name);
      input.value = "";
    }
  }
});

//Show message from agent (When someone joins)
socket.on("user-joind", function (msg) {
  var item = document.createElement("li");
  item.textContent = msg;
  item.style.backgroundColor = "red";
  item.style.clear = "both";
  item.style.float = "left";
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

//Show chat messgae
socket.on("chat message", function (msg, usId, userName) {
  var item = document.createElement("li");
  var idev = document.createElement("div");
  idev.innerHTML = `
  <p>${userName}</p>
  <p>${msg}</p>
  `;
  item.appendChild(idev);
  if (usId == myId) {
    item.style.backgroundColor = "green";
    item.style.clear = "both";
    item.style.float = "right";
  } else {
    item.style.backgroundColor = "gray";
    item.style.clear = "both";
    item.style.float = "left";
  }
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
