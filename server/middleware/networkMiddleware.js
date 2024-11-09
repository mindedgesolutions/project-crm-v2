import { body } from "express-validator";
import { withValidationErrors } from "./withErrorsMiddleware.js";
import slug from "slug";
import { BadRequestError } from "../errors/customErrors.js";
import pool from "../../db.js";

// ------
export const validateAddNetwork = withValidationErrors([
  body("name")
    .notEmpty()
    .withMessage("Network is required")
    .bail()
    .isLength({ min: 3, max: 255 })
    .withMessage("Network must be between 3 to 255 characters")
    .bail()
    .custom(async (value, { req }) => {
      const { id } = req.params;
      const netSlug = slug(value);
      const query = id ? `slug=$1 and id!=$2` : `slug=$1`;
      const values = id ? [netSlug, id] : [netSlug];
      const data = await pool.query(
        `select count(id) from network_master where ${query}`,
        values
      );
      if (data.rows[0].count > 0) {
        throw new BadRequestError(`Network exists`);
      }
      return true;
    }),
]);
