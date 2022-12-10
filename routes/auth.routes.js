const router = require("express").Router();
const {
  register,
  login,
  loginRequired,
  logout,
  getInfoFromToken
} = require("./../controllers/auth.controller");

router.post("/user", register);
router.post("/login", login);
router.get("/logout", loginRequired, logout);
router.get('/token-info', getInfoFromToken);

module.exports = router;
