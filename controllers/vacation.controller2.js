const { getUserById, handleVacationDays } = require("./../DAL/user.DAL"); //to receive employee's role
const jwt = require("jsonwebtoken");
const {
  postVacation,
  getVacation,
  cancelVacation,
  getEmployeeVacations,
  vacationErrorHandler,
  getVacations,
} = require("./../DAL/vacation.DAL");
const fetch = require("node-fetch");

// Main
const getVacationDetails = async (req, res) => {
  try {
    if (!req.params.id) res.status(404).json({ message: "vacation not found" });
    const vacation = await getVacation(req, res);
    res.status(200).json({ vacation });
  } catch (error) {
    res.status(400).json({ message: "Couldnt get vacation..." });
  }
};

const getAllEmployeeVacations = async (req, res) => {
  try {
    if (!req.params.employee_id) {
      res.status(400).json({ message: "vacation not found" });
    }
    const vacations = await getAllEmployeeVacations(req, res);
    if (!vacations && vacations.length < 0) {
      res.status(400).json({ message: "no vacations found" });
    }
    res.status(200).json({ vacations });
  } catch (error) {}
};
const cancelVacationStatus = (req, res) => {};
const createNewVacation = (req, res) => {};

// Utils
const datesDiffInDays = async (start_date, end_date) => {
  const date2 = Math.floor(end_date.getTime() / (24 * 60 * 60 * 1000));
  const date1 = Math.floor(start_date.getTime() / (24 * 60 * 60 * 1000));

  return date2 - date1;
};

const validateVacationDays = async () => {};
const checkVacationOverlap = async () => {};
const checkHolidayOverlap = async () => {};

module.exports = {
  getVacationDetails,
  createNewVacation,
};
