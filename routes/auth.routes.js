const router = require("express").Router();
const {
  register,
  login,
  loginRequired,
  logout,
} = require("./../controllers/auth.controller");

router.post("/user", register); //to user.routes
router.post("/login", login);
router.get("/logout", loginRequired, logout);

module.exports = router;
