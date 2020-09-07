const messageFunction = (username, message) => {
  return {
    username,
    message,
    createdAt: new Date().getTime(),
  };
};

module.exports = messageFunction;
