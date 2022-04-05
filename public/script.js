var socket = io();

var peer = new Peer({
  config: {
    iceServers: [
      { url: "stun:stun01.sipphone.com" },
      { url: "stun:stun.ekiga.net" },
      { url: "stun:stun.fwdnet.net" },
      { url: "stun:stun.ideasip.com" },
      { url: "stun:stun.iptel.org" },
      { url: "stun:stun.rixtelecom.se" },
      { url: "stun:stun.schlund.de" },
      { url: "stun:stun.l.google.com:19302" },
      { url: "stun:stun1.l.google.com:19302" },
      { url: "stun:stun2.l.google.com:19302" },
      { url: "stun:stun3.l.google.com:19302" },
      { url: "stun:stun4.l.google.com:19302" },
      { url: "stun:stunserver.org" },
      { url: "stun:stun.softjoys.com" },
      { url: "stun:stun.voiparound.com" },
      { url: "stun:stun.voipbuster.com" },
      { url: "stun:stun.voipstunt.com" },
      { url: "stun:stun.voxgratia.org" },
      { url: "stun:stun.xten.com" },
      {
        url: "turn:numb.viagenie.ca",
        credential: "muazkh",
        username: "webrtc@live.com",
      },
      {
        url: "turn:192.158.29.39:3478?transport=udp",
        credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
        username: "28224511:1379330808",
      },
      {
        url: "turn:192.158.29.39:3478?transport=tcp",
        credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
        username: "28224511:1379330808",
      },
    ],
  },
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

var myId;
// console.log(myId);

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
