// modified from the sockit.io example.
const express = require("express");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const { v4: uuidv4 } = require("uuid");
const port = process.env.PORT || 3000;
const dotenv = require("dotenv");
dotenv.config();

app.set("view engine", "ejs");
app.enable("trust proxy");

app.use(express.static("public"));

const path_name = __dirname + "/views";
var id = "room";

app.get("/", (req, res) => {
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV != "development" && !req.secure) {
    res.redirect("https://" + req.headers.host + req.url);
  } else {
    res.render("main");
  }
});

app.get("/chat/:id", function (req, res) {
  res.render("room", { roomId: req.params.id });
  id = req.params.id;
});

app.get("/views/:path", (req, res) => {
  res.sendFile(path_name + "/" + req.params.path);
});

app.get("/new_room", (req, res) => {
  res.redirect("/chat/" + uuidv4() + "?username=" + req.query.username);
});

app.get("/video/:id", (req, res) => {
  res.render("video", { roomId: req.params.id });
});

io.on("connection", async (socket) => {
  const userId = socket.id;

  // socket.join(id);

  socket.on("joinRoom", (roomId, userId, userName) => {
    socket.join(roomId);
    socket
      .to(roomId)
      .emit("user-joind", `A new person has connected 🤗 name: ${userName}`);
  });

  console.log(socket.rooms);

  socket.on("chat message", (msg, usID, userName) => {
    io.to(id).emit("chat message", msg, usID, userName);
  });

  socket.on("joinCall", (roomId, userId) => {
    socket.join(roomId);
    io.to(roomId).emit("joind-call", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("left-call", userId);
    });
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
