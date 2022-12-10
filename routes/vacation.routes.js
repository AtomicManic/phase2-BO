const router = require("express").Router();
const {
  createNewVacation,
  cancelVacationStatus,
  getAllEmployeeVacations,
  getVacationDetails,
} = require("./../controllers/vacation.controller");

router.post("/", createNewVacation);
//create an instance of express.router - router that handles users

//localhost:4000/api/vacations/vacationId
router.get("/:id", getVacationDetails);

//localhost:4000/api/vacations/vacationId
router.put("/:id", cancelVacationStatus);

//localhost:4000/api/vacations/employee/employee (not sure if this is the right route)
router.get("/employee/:employee_id", getAllEmployeeVacations);

module.exports = router;
