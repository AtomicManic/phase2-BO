const router = require("express").Router();
const { addVacationDays } = require("../src/sceduledTasks");
const {
  getUserWithEmail,
  getUserWithId,
  getUsersList,
  changeUser,
  removeUser,
  calcVacationDays,
  importCsv,
} = require("./../controllers/user.controller");

router.put("/update/:id", changeUser);
router.get("/list", getUsersList);
router.get("/email/:email", getUserWithEmail);
router.get("/id/:id", getUserWithId);
router.delete("/delete/:id", removeUser);
router.put("/add-days", addVacationDays);
router.post("/vacation-days", calcVacationDays);
router.post("/bulk-import/:filename", importCsv);

module.exports = router;
