const { getUserById, handleVacationDays } = require("./../DAL/user.DAL"); //to receive employee's role
const jwt = require("jsonwebtoken");
const {
  postVacation,
  getVacation,
  cancelVacation,
  getEmployeeVacations,
  getVacations,
} = require("./../DAL/vacation.DAL");
const fetch = require("node-fetch");
const vacationErrMsg = require("./../src/errorMesseges/vacation.errors");
const userErrMsg = require("./../src/errorMesseges/user.errors");
const res = require("express/lib/response");
const { isValidObjectId } = require("../validators/mongoId.validator");

const getVacationDetails = async (req, res, next) => {
  try {
    if (!req.params.id) throw new Error("vacationNotFound");
    const vacation = await getVacation(req, res);
    res.status(200).json({ vacation });
  } catch (error) {
    next({
      status: vacationErrMsg[error.message]?.status,
      message: vacationErrMsg[error.message]?.message,
    });
  }
};

const getAllEmployeeVacations = async (req, res, next) => {
  try {
    if (!req.params.employee_id) throw new Error(badRequest);
    const isValidId = isValidObjectId(req.params.employee_id);
    if (!isValidId) throw new Error("idNotExist");
    const result = await getEmployeeVacations(req);
    if (!result && result.length < 0) throw new Error("NoVacationsFound");
    res.status(200).json({ result });
  } catch (error) {
    next({
      status: vacationErrMsg[error.message]?.status,
      message: vacationErrMsg[error.message]?.message,
    });
  }
};

const cancelVacationStatus = async (req, res, next) => {
  try {
    if (!req.params.id) throw new Error("badRequest");

    const vacationToUpdate = await getVacation(req, res);
    if (!vacationToUpdate) throw new Error("vacationNotFound");

    if (vacationToUpdate.status === "cancelled") throw new Error("isCancelled");

    const result = await cancelVacation(req, res);
    if (!result) throw new Error("unableToCancel");
    const daysReturnedToUser = await datesDiffInDays(
      new Date(result.start_date),
      new Date(result.end_date)
    );

    const employee_id = result.employee_id;
    const updatedUser = await handleVacationDays(
      req,
      res,
      daysReturnedToUser,
      employee_id
    );
    if (!updatedUser) throw new Error("notUpdated");

    res.status(200).json({
      message: "success",
      Length_of_cancelled_vacation: `${daysReturnedToUser}`,
    });
  } catch (error) {
    next({
      status:
        vacationErrMsg[error.message]?.status ||
        userErrMsg[error.message]?.status,
      message:
        vacationErrMsg[error.message]?.message ||
        userErrMsg[error.message]?.message,
    });
  }
};

const createNewVacation = async (req, res, next) => {
  try {
      const token = req.cookies.token;
      const { userObj } = jwt.verify(token, process.env.TOKEN_SECRET);
      const user = await getUserById(req, res);
      if (!user) throw new Error("notFound");
      const vacationDetails = req.body;
      if (!req.body) throw new Error("badRequest");
    
      if (!vacationDetails.employee_id) throw new Error("idNotExist");

      const vacationL = await datesDiffInDays(
        new Date(vacationDetails.start_date),
        new Date(vacationDetails.end_date)
      );
    

      if (vacationL < 0 || !vacationL) throw new Error("badRequest");
      if (userObj.role === "manager") {
        const newVacation = await postVacation(vacationDetails, vacationL);
        if (!newVacation) throw new Error("UnableToUpdate");
        res.status(200).json({ newVacation });
      } else {
        const vacations = await getVacations(req, res);
        if (!vacations && vacations.length < 0)
          throw new Error("NoVacationsFound");

        const filteredVacations = vacations.filter(
          (vacation) => vacation.status === "approved"
        );
        if (!filteredVacations) throw new Error("unableToFilter");
      
        const answer = await validateVacationDays(
          res,
          vacationDetails.start_date,
          vacationDetails.end_date,
          user,
          filteredVacations,
          vacationL
        );
      
        if (answer.message === "decline") throw new Error("vacationDeclined");
        
        const vacation = await postVacation(vacationDetails, vacationL);
        if (!vacation) throw new Error("vacationNotSaved");
      
        const changedUser = await handleVacationDays(
          req,
          res,
          0 - vacationL,
          null
        );
        if (!changedUser) throw new Error("notUpdated");
        res.status(200).json({ messgae: "Vacation approved!" });
      }
  } catch (error) {
    next({
      status:
        vacationErrMsg[error.message]?.status ||
        userErrMsg[error.message]?.status,
      message:
        vacationErrMsg[error.message]?.message ||
        userErrMsg[error.message]?.message,
    });
  }
};

const datesDiffInDays = async (start_date, end_date) => {
  const date2 = Math.floor(end_date.getTime() / (24 * 60 * 60 * 1000));
  const date1 = Math.floor(start_date.getTime() / (24 * 60 * 60 * 1000));

  return date2 - date1;
};

const validateVacationDays = async (
  res,
  start_date,
  end_date,
  userReceiver,
  vacations,
  vacationL
) => {
  const requestedStartDate = new Date(start_date);
  const requestedEndDate = new Date(end_date);
  
  if (vacationL > userReceiver.vacation_days) {
    
    return {
      message: "decline",
      vacationLength: `${vacationL}`,
      reason: "Not enough vacation Days",
    };
  }

  for (const key in vacations) {
    let start = new Date(vacations[key].start_date);
    let end = new Date(vacations[key].end_date);

    const isOverlap = checkVacationOverlap(
      start,
      end,
      requestedStartDate,
      requestedEndDate
    );
    if (isOverlap) {
      
      return {
        message: "decline",
        vacationLength: `${vacationL}`,
        reason: "another employee has vacation",
        start,
        end,
      };
    }
  }

  const response = await fetch(
    "https://calendarific.com/api/v2/holidays?&api_key=a1e18904d65721020f4325e8fd7fd1197b56dde4&country=IL&year=2023"
  );
  if (!response) throw new Error("notGetHolidays");
  const data = await response.json();
  for (const i in data.response.holidays) {
    let holiday = new Date(data.response.holidays[i].date.iso);

    if (
      holiday.getMonth() === requestedStartDate.getMonth() &&
      holiday.getFullYear() === requestedStartDate.getFullYear()
    ) {
      const isHolidayOverlap = checkHolidayOverlap(
        requestedStartDate,
        requestedEndDate,
        holiday
      );

      if (isHolidayOverlap) {
        return res.status(400).json({
          message: "decline",
          vacationLength: `${vacationL}`,
          reason: "Holiday overlap",
        });
      }
    }
  }
  return res.status(200).json({
    message: "approved!",
  });
};

const checkVacationOverlap = (
  existingStart,
  existingEnd,
  reqStart,
  reqEnd,
  next
) => {
  const reqStartDate = reqStart.getTime();
  const reqEndDate = reqEnd.getTime();
  const exStartDate = existingStart.getTime();
  const exEndDate = existingEnd.getTime();
  
  if(reqStartDate > reqEndDate) return true;
  if(reqStartDate === exStartDate || reqStartDate === exEndDate){
    return true;
  };
  if(reqEndDate === exStartDate || reqEndDate === exEndDate) return true;
  if(reqStartDate < exStartDate && reqEndDate > exEndDate) return true;
  if(reqStartDate > exStartDate && reqEndDate < exEndDate) return true;
  if(reqStartDate > exStartDate && reqStartDate < exEndDate) return true;
  if(reqEndDate > exStartDate && reqEndDate < exEndDate) return true;

  return false;
};

const checkHolidayOverlap = (startDateCheck, endDateCheck, holiday) => {
  if (startDateCheck.getDate() === holiday.getDate()) {
    return true;
  }

  if (
    !(
      startDateCheck.getDate() < holiday.getDate() &&
      endDateCheck.getDate() < holiday.getDate()
    ) ||
    !(
      startDateCheck.getDate() > holiday.getDate() &&
      endDateCheck.getDate() > holiday.getDate()
    )
  ) {
    return false;
  }
  return true;
};

module.exports = {
  getVacationDetails,
  getAllEmployeeVacations,
  cancelVacationStatus,
  createNewVacation,
};
