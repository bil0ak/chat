// modified from the sockit.io example.

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const { v4: uuidv4 } = require("uuid");
const port = process.env.PORT || 3000;

var id = "room";
app.get("/", (req, res) => {
  res.redirect("/chat/" + uuidv4());
  // res.sendFile(__dirname + "/index.html");
});

app.get("/chat/:id", function (req, res) {
  res.sendFile(__dirname + "/index.html");
  id = req.params.id;
});

io.on("connection", async (socket) => {
  const userId = socket.id;

  // socket.join(id);

  socket.on("joinRoom", (socket_id) => {
    socket.join(id);
    socket.to(id).emit("agentMessage", "A new person has connected 🤗");
  });

  console.log(socket.rooms);

  socket.on("chat message", (msg, usID) => {
    io.to(id).emit("chat message", msg, usID);
  });

  io.to(id).emit("hi");
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
