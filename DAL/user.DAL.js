const User = require("./../modules/user.module");
const { isValidObjectId } = require("./../validators/mongoId.validator");

const getUserByEmail = async (req, res, next) => {
  let email;
  if (req.params.email) {
    email = req.params.email;
  } else if (req.body.email) {
    email = req.body.email;
  }

  const foundUser = await User.findOne({ email });
  if (!foundUser) throw new Error("mailNotExist");
  return foundUser;
};

const getUserById = async (req, res) => {
  let id;
  if (req.params.id) {
    id = req.params.id;
  } else if (req.body.id) {
    id = req.body.id;
  } else if (req.body.employee_id) {
    id = req.body.employee_id;
  } else {
    throw new Error("idNotExist");
  }

  if (!isValidObjectId(id)) throw new Error("idNotExist");
  const foundUser = await User.findById(id);
  if (!foundUser) throw new Error("notFound");
  return foundUser;
};

const addNewUser = async (user) => {
  const userObj = new User({ ...user });
  const newUser = await userObj.save();
  if (!newUser) throw new Error("notRegistered");
  return newUser;
};

//get all employees
const getAllUsers = async (req, res) => {
  const employees = await User.find({ role: "employee" });
  if (!employees && employees.length < 0) throw new Error("notFoundMany");
  return employees;
};

//edit user info
const updateUser = async (req, res) => {
  if (!req.body) throw new Error("badRequest");
  const {
    params: { id },
    body,
  } = req;
  if (!isValidObjectId(id)) throw new Error("idNotExist");

  const oldUser = await User.findByIdAndUpdate({ _id: id }, body);
  if (!oldUser) throw new Error("notUpdated");
  return oldUser;
};

//remove user
const deleteUser = (req, res) => {
  if (!req.params.id) throw new Error("badRequest");
  if (!isValidObjectId(req.params.id)) throw new Error("idNotExist");
  const deletedUser = User.findByIdAndRemove(req.params.id);
  if (!deletedUser) throw new Error("notDeleted");
  return deletedUser;
};

const addAutoVacationDays = async (req, res) => {
  const result = await User.updateMany({}, { $inc: { vacation_days: 0.3 } });
  if (result.modifiedCount >= 0) throw new Error("notUpdatedMany");
};

const handleVacationDays = async (req, res, days, employeeId) => {
  console.log(employeeId || req.body.employee_id, days);
  let id;
  if (employeeId) {
    id = employeeId;
  } else if (req.body.employee_id) {
    id = req.body.employee_id;
  } else {
    throw new Error("bad request");
  }
  if (!id || !days) throw new Error("badRequest");
  const updatedUser = await User.findByIdAndUpdate(id, {
    $inc: { vacation_days: days },
  });
  if (!updatedUser) throw new Error("notUpdated");
  return updatedUser;
};

const addUsers = (req, res, csvUsers) => {
  users.users.push(...csvUsers);
  //add to db..
  console.log(JSON.stringify(users, null, 2));
  return {
    message: "success!",
  };
};

module.exports = {
  getUserByEmail,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  addAutoVacationDays,
  handleVacationDays,
  addNewUser,
  addUsers,
};
