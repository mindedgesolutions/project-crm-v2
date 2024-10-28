import { body } from "express-validator";
import { withValidationErrors } from "./withErrorsMiddleware.js";
import slug from "slug";
import { BadRequestError } from "../errors/customErrors.js";
import pool from "../../db.js";

// ------
export const validatePlanAttribute = withValidationErrors([
  body("attribute")
    .notEmpty()
    .withMessage("Attribute is required")
    .bail()
    .isLength({ min: 3, max: 255 })
    .withMessage("Attribute must be between 3 to 255 characters")
    .bail()
    .custom(async (value, { req }) => {
      const { id } = req.params;
      const attrSlug = slug(value);
      const query = id ? `slug=$1 and id!=$2` : `slug=$1`;
      const values = id ? [attrSlug, id] : [attrSlug];
      const data = await pool.query(
        `select count(id) from plan_attributes where ${query}`,
        values
      );
      if (data.rows[0].count > 0) {
        throw new BadRequestError(`Attribute exists`);
      }
      return true;
    }),
  body("type").notEmpty().withMessage("Select attribute type"),
]);

// ------
export const validateAddPlan = withValidationErrors([
  body("name")
    .notEmpty()
    .withMessage(`Plan name is required`)
    .bail()
    .isLength({ min: 3, max: 255 })
    .withMessage(`Plan name must be between 3 and 255 characters`),
  body("shortDesc")
    .notEmpty()
    .withMessage(`Short description is required`)
    .bail()
    .isLength({ min: 3, max: 255 })
    .withMessage(`Short description must be between 3 and 255 characters`),
  body("tenure")
    .notEmpty()
    .withMessage(`Plan tenure is required`)
    .bail()
    .custom(async (value) => {
      if (value !== "1" && value !== "3" && value !== "12") {
        throw new BadRequestError(`Invalid value`);
      }
      return true;
    }),
  body("price")
    .notEmpty()
    .withMessage(`Price is required`)
    .bail()
    .isNumeric()
    .withMessage(`Price must be a valid number`),
]);
