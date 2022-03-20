const joinBtn = document.getElementById("join_room")
const roomId = document.getElementById("roomId").value

joinBtn.addEventListener("click", join)

function join() {
    location.href = '/chat/' + roomId
}
