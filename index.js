// for change the path
const Path = require("path");
const express = require("express");
// for create node srver
const http = require("http");
// for comunicate between client and server
const socketio = require("socket.io");
// for find bad words
const filterMessage = require("bad-words");
const messagefunc = require("./src/messagefunc");
const { adduser, removeuser, getuser, getuserinroom } = require("./src/user");
const app = express();

app.use(express.static(Path.join(__dirname, "./public")));

const server = http.createServer(app);
const io = socketio(server);

// socket is only run a pharticuler connection
io.on("connection", (socket) => {
  socket.on("join", (options, callback) => {
    const { error, user } = adduser({ id: socket.id, ...options });
    // console.log(error);
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    // to send one one user
    socket
      .to(user.room)
      .emit("message", messagefunc(`welcome ${user.username}`));
    // to send message when new use joined
    socket.broadcast
      .to(user.room)
      .emit("message", messagefunc(`${user.username} has joined`));
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getuser(socket.id);
    const filter = new filterMessage();
    if (filter.isProfane(message)) {
      return callback("Bad word not Allow!!");
    }
    // to send all the user
    io.to(user.room).emit("message", messagefunc(user.username, message));
    callback("Delivere");
  });

  socket.on("send-location", ({ latitude, longitude }, callback) => {
    const user = getuser(socket.id);
    io.to(user.room).emit(
      "sharelocation",
      messagefunc(
        user.username,
        `http://www.google.com/maps?q=${latitude},${longitude}`
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeuser(socket.id);
    console.log(user);
    if (user) {
      io.to(user.room).emit(
        "message",
        messagefunc(`${user.username} has been disconncted`)
      );
    }
  });
});

const PORT = process.env.PORT | 3000;
server.listen(PORT, () => {
  console.log(`App Listen on ${PORT}`);
});
