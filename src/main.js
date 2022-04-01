const createBtn = document.getElementById("create_room");
const joinBtn = document.getElementById("join_room");

createBtn.addEventListener("click", create_room)
joinBtn.addEventListener("click", join_room);

function create_room(){
  let userName = document.getElementById("username").value;

    location.href = "/new_room"+ "?username=" + userName
}

function join_room() {
  let userName = document.getElementById("username");
  let roomId = document.getElementById("roomId").value;
  location.href = "/chat/" + roomId + "?username:" + userName;
}
