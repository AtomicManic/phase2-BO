module.exports = {
  notFound: {
    status: 404,
    message: "User not found",
  },
  notUpdated: {
    status: 400,
    message: "Couldn't update user",
  },
  notDeleted: {
    status: 400,
    message: "Couldn't delete user",
  },
  idNotExist: {
    status: 404,
    message: "User ID does not exist",
  },
  badRequest: {
    status: 400,
    message: "Bad Request",
  },
  notFoundMany: {
    status: 404,
    message: "No users where found",
  },
  notUpdatedMany: {
    status: 400,
    message: "Couldn't update users",
  },
  mailNotExist: {
    status: 400,
    message: "Email doesnt exist",
  },
  notRegistered: {
    status: 400,
    message: "Unable to register user",
  },
};
