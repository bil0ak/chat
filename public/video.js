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

const myVidDiv = document.getElementById("my-vid");
const vids = document.getElementById("vids");
const enablePIP = document.getElementById("enable_picture_in_picture");

const myVideo = createVideoElement();
myVideo.id = "my-video";
myVideo.muted = true;

const mute_btn = document.getElementById("mute_btn");
const disable_camera = document.getElementById("disable_camera");

mute_btn.addEventListener("click", () => {
  const i = mute_btn.getElementsByTagName("i")[0];
  myVideo.srcObject.getAudioTracks()[0].enabled =
    !myVideo.srcObject.getAudioTracks()[0].enabled;

  if (myVideo.srcObject.getAudioTracks()[0].enabled) {
    i.classList.remove("fa-microphone-slash");
    i.classList.add("fa-microphone");
    i.style.color = "";
  } else {
    i.classList.remove("fa-microphone");
    i.classList.add("fa-microphone-slash");
    i.style.color = "red";
  }
});

disable_camera.addEventListener("click", () => {
  const i = disable_camera.getElementsByTagName("i")[0];
  myVideo.srcObject.getVideoTracks()[0].enabled =
    !myVideo.srcObject.getVideoTracks()[0].enabled;

  if (myVideo.srcObject.getVideoTracks()[0].enabled) {
    i.classList.remove("fa-video-slash");
    i.classList.add("fa-video");
    i.style.color = "";
  } else {
    i.classList.remove("fa-video");
    i.classList.add("fa-video-slash");
    i.style.color = "red";
  }
});

enablePIP.addEventListener("click", () => {
  const videos = document.getElementById("vids").children;

  let pip_enabled = document.pictureInPictureElement;
  // check if there is a video in PIP
  if (pip_enabled) {
    // if there is a video in PIP, exit PIP
    document.exitPictureInPicture();

    enablePIP.style.display = "block";
  } else {
    if (videos.length > 1) {
      // If there are more than 1 video, show the second one in PIP
      videos[0].requestPictureInPicture();
    } else {
      // If there is only 1 video, show it in PIP
      videos[0].requestPictureInPicture();
    }

    enablePIP.style.display = "block";
  }
});

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addMyVidStream(myVideo, stream);

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
  console.log("left");
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

function addMyVidStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  myVidDiv.appendChild(video);
}
x;
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
