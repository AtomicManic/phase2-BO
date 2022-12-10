const router = require("express").Router();
const {
  createNewVacation,
  cancelVacationStatus,
  getAllEmployeeVacations,
  getVacationDetails,
} = require("./../controllers/vacation.controller");

router.post("/", createNewVacation);

router.get("/:id", getVacationDetails);

router.put("/:id", cancelVacationStatus);

router.get("/employee/:employee_id", getAllEmployeeVacations);

module.exports = router;
