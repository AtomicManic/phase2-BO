const { addAutoVacationDays } = require("./../DAL/user.DAL");

exports.addVacationDays = async (req, res) => {
  try {
    await addAutoVacationDays(req, res);
    res.status(200).json({ message: "Days Added" });
  } catch (error) {
    console.log(error.message);
  }
};
