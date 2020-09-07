const socket = io();

// Element
const messageForm = document.querySelector("#message-form");
const formInput = messageForm.querySelector("input");
const formbutton = messageForm.querySelector("button");
const locationButton = document.getElementById("send-location");
const messageDiv = document.querySelector("#message-div");
// Templete
const templeteDiv = document.querySelector("#message-templete").innerHTML;
const locationDiv = document.querySelector("#location-templete").innerHTML;

socket.on("message", (message) => {
  console.log(`Message :- ${message.message}`);
  const dommessage = Mustache.render(templeteDiv, {
    time: moment(message.createdAt).format("h:m:s A"),
    message: message.message,
    username: message.username,
  });
  messageDiv.insertAdjacentHTML("beforeend", dommessage);
});

socket.on("sharelocation", (message) => {
  console.log(message);
  const domlocation = Mustache.render(locationDiv, {
    url: message.message,
    time: moment(message.time).format("h:m:s A"),
    username: message.username,
  });
  messageDiv.insertAdjacentHTML("beforeend", domlocation);
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  formbutton.setAttribute("disabled", "disabled");
  const message = e.target.elements.Message.value;
  socket.emit("sendMessage", message, (error) => {
    formInput.value = "";
    formbutton.removeAttribute("disabled");
    formInput.focus;
    if (error) {
      return console.log(error);
    }
    console.log("Message was delivred");
  });
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    locationButton.remove();
    return alert("Your browser not support to shared location");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "send-location",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        locationButton.setAttribute("disabled", "disabled");
        setTimeout(() => {
          locationButton.removeAttribute("disabled");
        }, 2000);
        console.log("Location Shared");
      }
    );
  });
});

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(username, room);
socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
