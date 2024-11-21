import { body } from "express-validator";
import { withValidationErrors } from "./withErrorsMiddleware.js";
import { BadRequestError } from "../errors/customErrors.js";
import pool from "../../db.js";
import { verifyJWT } from "../utils/tokenUtils.js";

// ------
export const validateLeadReassign = withValidationErrors([
  body("assignTo").notEmpty().withMessage("Select user"),
]);

// ------
export const validateUpdateStatus = withValidationErrors([
  body("status")
    .notEmpty()
    .withMessage("Latest status is required")
    .bail()
    .custom(async (value, { req }) => {
      const { token_crm } = req.cookies;
      const { uuid } = verifyJWT(token_crm);
      const user = await pool.query(
        `select id, company_id from users where uuid=$1`,
        [uuid]
      );
      const check = await pool.query(
        `select count(id) from lead_status_master where (company_id is null or company_id=$1) and id=$2`,
        [user.rows[0].company_id, value]
      );
      if (Number(check.rows[0].count) === 0) {
        throw new BadRequestError(`Don't fuck with the system, Dude!`);
      }
      return true;
    }),
  body("annotation")
    .notEmpty()
    .withMessage("Your comment is required")
    .bail()
    .isLength({ min: 3, max: 255 })
    .withMessage("Comment must be between 3 to 255 characters"),
  body("followup")
    .optional({ checkFalsy: true })
    .bail()
    .custom((value) => {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        throw new BadRequestError("Date cannot be in the past");
      }
      return true;
    }),
]);
