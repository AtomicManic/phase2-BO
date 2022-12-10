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
const registerValidator = require("./../validators/register.validator");
const bcrypt = require("bcrypt");

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

exports.importCsv = async (req, res , next) => {

  try {
    const csvFile = req.params.filename;

    if(!csvFile) {
      throw new Error("Missing file name");
    }

    CSVtoJSON({
      colParser: {
        //change type from string to number
        vacation_days: {
          cellParser: "number",
        }
      },
    })
        .fromFile(`data/${csvFile}`)       //from csv file
        .then(async (csvUsers) => {

          const newUsers = [];

          for(const i in csvUsers) {

            const validationResult = registerValidator(csvUsers[i]);
            if (!validationResult) {
              throw new Error();
            }
            const hashedPassword = await bcrypt.hash(csvUsers[i].password, 12);
            const user = { ...csvUsers[i], password: hashedPassword };
            newUsers.push(user);
          }
          console.log(newUsers);
          const bulk = await addUsers(req, res, newUsers);
          if (!bulk) {
            throw new Error("insert failed");
          }
          if(bulk.message === "failed") {
            res.status(402).json({message: "failed"});
          } else {
            res.status(200).json({message: "bulk complete"});
          }
        });
  } catch (error) {
    next({
      status: userErrMsg[error.message]?.status,
      message: userErrMsg[error.message]?.message,
    });
  }
}
