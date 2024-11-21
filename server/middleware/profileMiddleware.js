import { body } from "express-validator";
import { withValidationErrors } from "./withErrorsMiddleware.js";
import { BadRequestError } from "../errors/customErrors.js";

// ------
export const validateChangePassword = withValidationErrors([
  body("newPassword")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6, max: 14 })
    .withMessage("Password must be between 6 to 14 characters"),
  body("cPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      const { newPassword } = req.body;
      if (value.trim() !== newPassword.trim()) {
        throw new BadRequestError("Passwords don't match");
      }
      return true;
    }),
]);
