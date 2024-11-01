import { body } from "express-validator";
import { withValidationErrors } from "./withErrorsMiddleware.js";
import slug from "slug";
import { BadRequestError } from "../errors/customErrors.js";
import pool from "../../db.js";
import { isMobileNumber } from "../utils/formatValidation.js";

// ------
export const validateAddCoGroup = withValidationErrors([
  body("name")
    .notEmpty()
    .withMessage("Group name is required")
    .bail()
    .isLength({ min: 3, max: 255 })
    .withMessage("Group name must be between 3 to 255 characters")
    .bail()
    .custom(async (value, { req }) => {
      const { id } = req.params;
      const groupSlug = slug(value);
      const query = id ? `slug=$1 and id!=$2` : `slug=$1`;
      const values = id ? [groupSlug, id] : [groupSlug];
      const data = await pool.query(
        `select count(id) from groups where ${query}`,
        values
      );
      if (data.rows[0].count > 0) {
        throw new BadRequestError(`Group exists`);
      }
      return true;
    }),
  body("desc")
    .optional()
    .isLength({ min: 3, max: 255 })
    .withMessage("Description must be between 3 to 255 characters"),
]);

// ------
export const validateAddCoUser = withValidationErrors([
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ min: 3, max: 255 })
    .withMessage("Name must be between 3 to 255 characters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Must be a valid email address")
    .bail()
    .custom(async (value, { req }) => {
      const { uuid } = req.params;
      const query = uuid ? `email=$1 and uuid!=$2` : `email=$1`;
      const values = uuid ? [value, uuid] : [value];
      const data = await pool.query(
        `select count(*) from users where ${query}`,
        values
      );
      if (data.rows[0].count > 0) {
        throw new BadRequestError(`Email exists`);
      }
      return true;
    }),
  body("mobile")
    .notEmpty()
    .withMessage("Mobile is required")
    .bail()
    .custom(isMobileNumber)
    .withMessage("Must be a valid mobile no.")
    .bail()
    .custom(async (value, { req }) => {
      const { uuid } = req.params;
      const query = uuid ? `mobile=$1 and uuid!=$2` : `mobile=$1`;
      const values = uuid ? [value, uuid] : [value];
      const data = await pool.query(
        `select count(*) from users where ${query}`,
        values
      );
      if (data.rows[0].count > 0) {
        throw new BadRequestError(`Mobile exists`);
      }
      return true;
    }),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .bail()
    .custom(async (value) => {
      const data = await pool.query(`select count(*) from roles where id=$1`, [
        value,
      ]);
      if (data.rows[0].count === 0) {
        throw new BadRequestError(`Role doesn't exist`);
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6, max: 14 })
    .withMessage("Password must be between 6 to 14 characters"),
]);
