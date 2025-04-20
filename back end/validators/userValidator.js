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
    .withMessage("gender is required")
    .isEmail(),
    
  check("password")
    .notEmpty()
    .withMessage("gender is required")
    .isLength({ min: 8 })
    .withMessage("password is too short")
    .custom(value => {
      if (!/^[A-Z]/.test(value)) {
        throw new Error('Password must start with an uppercase letter');
      }
      if (!/\d/.test(value)) {
        throw new Error('Password must contain at least one number');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        throw new Error('Password must contain at least one special character');
      }
      return true;
    })

]
module.exports = userValidator;
