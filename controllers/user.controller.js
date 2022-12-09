const UserObj = require("../classes/User");
const {
  getUserByEmail,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  handleVacationDays,
  addUsers,
  addNewUser
} = require("./../DAL/user.DAL");
const userErrMsg = require("./../src/errorMesseges/user.errors");
const CSVtoJSON = require('csvtojson');
const constants = require("constants");

exports.addNewUser = async (req, res, next) => {
  try {
    const newUser = await addNewUser(req, res);
    if (!newUser) throw new Error("notRegistered");
    res.status(200).json({ newUser });
  } catch (error) {
    next({
      status: userErrMsg[error.message]?.status,
      message: userErrMsg[error.message]?.message,
    });
  }
};

exports.getUserWithEmail = async (req, res, next) => {
  try {
    const user = await getUserByEmail(req, res);
    if (user) {
      res.status(200).json({ user });
    }
  } catch (error) {
    next({
      status: userErrMsg[error.message]?.status,
      message: userErrMsg[error.message]?.message,
    });
  }
};

exports.getUserWithId = async (req, res, next) => {
  try {
    const user = await getUserById(req, res);
    if (user) {
      res.status(200).json({ user });
    }
  } catch (error) {
    next({
      status: userErrMsg[error.message]?.status,
      message: userErrMsg[error.message]?.message,
    });
  }
};

exports.getUsersList = async (req, res, next) => {
  try {
    const employees = await getAllUsers(req, res);
    if (employees) {
      res.status(200).json({ employees });
    }
  } catch (error) {
    next({
      status: userErrMsg[error.message]?.status,
      message: userErrMsg[error.message]?.message,
    });
  }
};

exports.changeUser = async (req, res, next) => {
  try {
    const user = await updateUser(req, res);
    if (!user) {
      throw new Error("notFound");
    }
    res.status(201).json({ user });
  } catch (error) {
    next({
      status: userErrMsg[error.message]?.status,
      message: userErrMsg[error.message]?.message,
    });
  }
};

exports.removeUser = async (req, res, next) => {
  try {
    const user = await deleteUser(req, res);
    if (!user) {
      throw new Error("notFound");
    }
    res.status(200).json({ user });
  } catch (error) {
    next({
      status: userErrMsg[error.message]?.status,
      message: userErrMsg[error.message]?.message,
    });
  }
};

exports.calcVacationDays = async (req, res, next) => {
  try {
    const user = await handleVacationDays(req, res);
    if (!user) {
      throw new Error("notFound");
    }
    res.status(200).json({ user });
  } catch (error) {
    next({
      status: userErrMsg[error.message]?.status,
      message: userErrMsg[error.message]?.message,
    });
  }
};

exports.importCsv = async (req, res) => {

  const csvFileName = JSON.stringify(req.body); //cant get the csv file name from request.body

  try {
    CSVtoJSON({
      colParser: {
        //change type from string to number
        vacation_days: {
          cellParser: "number",
        }
      },
    })
        .fromFile(`data/users.csv`)       //from csv file
        .then(async (csvUsers) => {
          const bulk = await addUsers(req, res, csvUsers);
          if (!bulk) {
            throw new Error("insert failed");
          } else {
            res.status(200).json({message: "bulk complete"});
          }
        });
  } catch (error) {
   // next({
   //   status: userErrMsg[error.message]?.status,
     // message: userErrMsg[error.message]?.message,
    throw error;
   // });
  }
}
