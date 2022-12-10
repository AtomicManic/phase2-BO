module.exports = {
  userAdded: {
    status: 201,
    message: "user added successfully!",
  },
  wrong: {
    status: 400,
    result: {
      isLoggedIn: false,
      message: "wrong username or password",
    },
  },
  loggedIn: {
    status: 200,
    result: {
      isLoggedIn: true,
      message: "You are logged in!",
    },
  },
};
