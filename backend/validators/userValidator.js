const { check } = require("express-validator");
const userValidator = [
  check("name")
    .notEmpty()
    .withMessage("first name is required")
    .isLength({ min: 2 })
    .withMessage("first name is too short")
    .trim(),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail(),
    

]
module.exports = userValidator;
