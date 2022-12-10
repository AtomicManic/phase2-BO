const router = require("express").Router();
const path = require("path");
const { loginRequired } = require("./auth.routes");
const jwt = require("jsonwebtoken");

router.get("/dashboard", (req, res) => {
  let filePath = "";
  const token = req.cookies.token;
  try {
    const { userObj } = jwt.verify(token, process.env.TOKEN_SECRET);
    if (userObj.role === "manager") {
      filePath = "dashboard/manager/dashboard.html";
    } else if (userObj.role === "employee") {
      filePath = "dashboard/employee/dashboard.html";
    } else {
      res.redirect("/");
      res.end();
    }
    res.sendFile(path.join(__dirname, "..", "client", "public", filePath));
  } catch (error) {
    res.redirect("/");
    res.end();
  }
});

router.get('/dashboard/edit-employee/:id', (req,res) =>{
  const token = req.cookies.token;
  const { userObj } = jwt.verify(token, process.env.TOKEN_SECRET);
  if(userObj.role === 'employee' || !userObj){
    res.redirect("/");
    res.end();
  } 
  res.sendFile(path.join(__dirname, "..", "client", "public", "editUser","editUser.html"));
});

router.get('/dashboard/vacation/:id', (req,res) => {
  const token = req.cookies.token;
  const { userObj } = jwt.verify(token, process.env.TOKEN_SECRET);
  if(!userObj){
    res.redirect("/");
    res.end();
  } 
  res.sendFile(path.join(__dirname, "..", "client", "public", "vacation","vacation.html"));
})

router.get('/dashboard/bulk-import', (req,res) => {
  const token = req.cookies.token;
  const { userObj } = jwt.verify(token, process.env.TOKEN_SECRET);
  if(!userObj){
    res.redirect("/dashboard");
    res.end();
  } 
  res.sendFile(path.join(__dirname, "..", "client", "public", "bulkImport","bulkImport.html"));
})
module.exports = router;
