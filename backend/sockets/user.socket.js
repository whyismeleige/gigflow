module.exports = (io, socket) => {
  socket.on("register-user", (userId) => {
    console.log("New User registered", userId);
    socket.join(`user-${userId.toString()}`);
  });

  socket.on("deregister-user", (userId) => {
    console.log("User deregistered successfully", userId);
    socket.leave(`user-${userId.toString()}`);
  });
};
