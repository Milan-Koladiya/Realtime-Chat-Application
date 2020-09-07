const users = [];

// add user // remove user

const adduser = ({ id, username, room }) => {
  //   console.log(username, room);
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username OR Room is not valid",
    };
  }

  const existinguser = users.find(
    (user) => user.username === username && user.room === room
  );

  if (existinguser) {
    return {
      error: "Username or Room already exist",
    };
  }

  const user = { id, username, room };

  users.push(user);

  return { user };
};

const removeuser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  console.log(index);
  // record found = index = 0,1
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getuser = (id) => {
  const user = users.find((user) => user.id === id);
  if (!user) {
    return { Error: "User not found as you give id" };
  }
  return user;
};

const getuserinroom = (room) => {
  const user = users.filter((user) => user.room === room);
  if (!user) {
    return { Error: "Room is not found" };
  }
  return user;
};
module.exports = {
  adduser,
  removeuser,
  getuser,
  getuserinroom,
};
