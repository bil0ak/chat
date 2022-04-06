var socket = io();

var peers = {};

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

const vids = document.getElementById("vids");

const myVideo = createVideoElement();
myVideo.muted = true;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVidStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);

      const video = createVideoElement();

      call.on("stream", (userVidStream) => {
        addVidStream(video, userVidStream);
      });
    });

    socket.on("joind-call", (userId) => {
      if (userId != peer.id) {
        console.log(userId);

        setTimeout(connectToUser, 3000, userId, stream);
      }
    });
  });

socket.on("left-call", (userId) => {
  if (peers[userId]) {
    peers[userId].close();
  }
});

//Join room
peer.on("open", (id) => {
  socket.emit("joinCall", ROOM_ID, id);

  //Add the room Id to the page (make it easy to copy)
  var room_id_txt = document.getElementById("room_id_txt");
  room_id_txt.innerText = `ROOM ID: ${ROOM_ID}`;
});

function connectToUser(userId, stream) {
  const call = peer.call(userId, stream);

  const video = createVideoElement();

  call.on("stream", function (remoteVidStream) {
    addVidStream(video, remoteVidStream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVidStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  vids.appendChild(video);
}

function createVideoElement() {
  const video = document.createElement("video");
  video.setAttribute("autoplay", "autoplay");
  video.playsInline = true;

  return video;
}
