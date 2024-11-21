import { body } from "express-validator";
import { withValidationErrors } from "./withErrorsMiddleware.js";
import { BadRequestError } from "../errors/customErrors.js";
import pool from "../../db.js";

// ------
export const validateLeadReassign = withValidationErrors([
  body("assignTo").notEmpty().withMessage("Select user"),
]);
