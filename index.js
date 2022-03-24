// modified from the sockit.io example.

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const { v4: uuidv4 } = require("uuid");
const port = process.env.PORT || 3000;

const path_name = __dirname + "/res";
var id = "room";
app.get("/", (req, res) => {
  res.sendFile(path_name + "/main.html");
  // res.redirect("/chat/" + uuidv4());
  // res.sendFile(path_name + "/index.html");
});

app.get("/chat/:id", function (req, res) {
  res.sendFile(path_name + "/index.html");
  id = req.params.id;
});

app.get("/res/:path", (req, res) => {
  res.sendFile(path_name + "/" + req.params.path);
});

app.get("/new_room", (req, res) => {
  res.redirect("/chat/" + uuidv4() + "?username=" + req.query.username);
});

io.on("connection", async (socket) => {
  const userId = socket.id;

  // socket.join(id);

  socket.on("joinRoom", (socket_id, userName) => {
    socket.join(id);
    socket.to(id).emit("agentMessage", "A new person has connected 🤗 " + userName);
  });

  console.log(socket.rooms);

  socket.on("chat message", (msg, usID, userName) => {
    io.to(id).emit("chat message", msg, usID, userName);
  });

  io.to(id).emit("hi");
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
