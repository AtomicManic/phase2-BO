const vacation = require("./../modules/vacation.model");

const getVacations = async (req, res) => {
  const allVacations = vacation.find({});
  if (!allVacations) throw new Error("NoVacationsFound");
  return allVacations;
};

const getVacation = async (req, res) => {
  if (!req.params.id) throw new Error("badRequest");
  const foundVacation = await vacation.findById({ _id: req.params.id });
  if (!foundVacation) throw new Error("vacationNotFound");
  return foundVacation;
};

const getEmployeeVacations = async (req, res) => {
  if (!req.params.employee_id) throw new Error("badRequest");
  const foundEmployeeVacations = await vacation.find({
    employee_id: `${req.params.employee_id}`,
  });
  if (!foundEmployeeVacations && foundEmployeeVacations.length < 0)
    throw new Error("NoVacationsFound");
  return foundEmployeeVacations;
};

const cancelVacation = async (req, res) => {
  if (!req.params.id) throw new Error("badRequest");
  const filter = { _id: req.params.id };
  const update = { status: "cancelled" };

  const modified = await vacation.findOneAndUpdate(filter, update, {
    new: true,
  });

  if (!modified) throw new Error("UnableToUpdate");
  return modified;
};

const postVacation = (vacationDetails, vacationL) => {
  console.log(vacationDetails);
  if (
    !vacationDetails ||
    !vacationL ||
    !vacationDetails.employee_id ||
    !vacationDetails.start_date ||
    !vacationDetails.end_date
  ) {
    throw new Error("badRequest");
  }

  const { employee_id, start_date, end_date } = vacationDetails;

  const newVacation = new vacation({
    employee_id: employee_id,
    start_date: start_date,
    end_date: end_date,
    status: "approved",
  });

  const result = newVacation.save();

  if (!result) throw new Error("vacationNotSaved");
  return result;
  // return {
  //   message: "success",
  //   length: `${vacationL}`,
  //   dates: `${start_date} - ${end_date}`,
  // };
};

const vacationErrorHandler = (req, res, head, message) => {
  res.status(head);
  res.json({ message });
  res.end();
};

module.exports = {
  getVacation,
  getEmployeeVacations,
  cancelVacation,
  postVacation,
  vacationErrorHandler,
  getVacations,
};
