const registerValidator = require("./../validators/register.validator");
const loginValidator = require("./../validators/login.validator");
const User = require("./../classes/User");
const jwt = require("jsonwebtoken");
const {
  addNewUser,
  getUserByEmail,
  getUserById,
} = require("./../DAL/user.DAL");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { dbSecretFields } = require("./../config/config");
const authErrMsg = require("./../src/errorMesseges/auth.errors");
const userErrMgs = require("./../src/errorMesseges/user.errors");
const authResponse = require("./../src/responses/login.response");

exports.register = async (req, res, next) => {
  const validationResult = registerValidator(req.body);
  try {
    if (!validationResult) {
      throw new Error();
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const user = { ...req.body, password: hashedPassword };

    const addedUser = await addNewUser(user);

    return res.status(authResponse.userAdded.status).json({
      message: authResponse.userAdded.message,
      user: _.omit((await addedUser).toObject(), dbSecretFields),
    });
  } catch (error) {
    next({
      status: authErrMsg[error.message]?.status || 400,
      message: authErrMsg[error.message]?.message || error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const validationResult = loginValidator(req.body);
    if (!validationResult) {
      throw new Error();
    }
    const user = await getUserByEmail(req, res);
    if (!user) {
      return res
        .status(authResponse.wrong.status)
        .json(authResponse.wrong.result);
    }

    await validatePassword(req, res, user);

    setToken(req, res, user);

    res.status(authResponse.loggedIn.status).json({
      ...authResponse.loggedIn.result,
      role: user.role,
    });
  } catch (error) {
    next({
      status:
        authErrMsg[error.message]?.status || userErrMgs[error.message]?.status,
      message:
        authErrMsg[error.message]?.message ||
        userErrMgs[error.message]?.message ||
        error.message,
    });
  }
};

const validatePassword = async (req, res, user) => {
  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordCorrect) {
    return res
      .status(authResponse.wrong.status)
      .json(authResponse.wrong.result);
  }
};

const setToken = (req, res, user) => {
  const userObj = new User(user.id, user.role);
  const token = jwt.sign({ userObj }, process.env.TOKEN_SECRET, {
    expiresIn: "15m",
  });

  res.cookie("token", token, {
    httpOnly: true,
  });
};

exports.logout = (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.end();
};

exports.loginRequired = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    const { userObj } = jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch (error) {
    res
      .status(authErrMsg.unverified.status)
      .json({ message: authErrMsg.unverified.message });
  }
};
