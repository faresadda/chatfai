const { check } = require("express-validator");
const passwordValidator = [
  check("password")
    .notEmpty()
    .withMessage("gender is required")
    .isLength({ min: 8 })
    .withMessage("password is too short")
    .custom(value => {
      if (!/[A-Z]/.test(value)) {
        throw new Error('Password must contain with an uppercase letter');
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
module.exports = passwordValidator;
