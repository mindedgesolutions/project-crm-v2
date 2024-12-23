import { body, check } from "express-validator";
import { withValidationErrors } from "./withErrorsMiddleware.js";
import slug from "slug";
import { BadRequestError } from "../errors/customErrors.js";
import pool from "../../db.js";

// ------
export const validateCoAddLeadStatus = withValidationErrors([
  body("name")
    .notEmpty()
    .withMessage("Status is required")
    .bail()
    .isLength({ min: 3, max: 255 })
    .withMessage("Status must be between 3 to 255 characters")
    .bail()
    .custom(async (value, { req }) => {
      const { id, companyId } = req.params;
      const leadSlug = slug(value);
      const query = id ? ` and slug=$2 and id!=$3` : `and slug=$2`;
      const values = id ? [companyId, leadSlug, id] : [companyId, leadSlug];
      const count = await pool.query(
        `select count(*) from lead_status_master where (company_id=$1 or company_id is null) ${query}`,
        values
      );
      if (count.rows[0].count > 0) {
        throw new BadRequestError(`Status exists`);
      }
      return true;
    }),
]);

// ------
export const validateCoAddLeadCategory = withValidationErrors([
  body("name")
    .notEmpty()
    .withMessage("Category is required")
    .bail()
    .isLength({ min: 3, max: 255 })
    .withMessage("Category must be between 3 to 255 characters")
    .bail()
    .custom(async (value, { req }) => {
      const { id, companyId } = req.params;
      const leadSlug = slug(value);
      const query = id ? ` and slug=$2 and id!=$3` : `and slug=$2`;
      const values = id ? [companyId, leadSlug, id] : [companyId, leadSlug];
      const count = await pool.query(
        `select count(*) from lead_status_master where (company_id=$1 or company_id is null) ${query}`,
        values
      );
      if (count.rows[0].count > 0) {
        throw new BadRequestError(`Status exists`);
      }
      return true;
    }),
]);

// ------
export const validateCoCsvUpload = withValidationErrors([
  check("leads").custom((value, { req }) => {
    if (!req.file) {
      throw new BadRequestError("No file selected");
    }
    return true;
  }),
  body("assignType")
    .notEmpty()
    .withMessage("Select whom you wish to assign the leads"),
  body("assignGroup")
    .if(body("assignType").equals("2"))
    .notEmpty()
    .withMessage(`Select a group`),
  body("assignUsers")
    .if(body("assignType").equals("3"))
    .notEmpty()
    .withMessage(`Select a user`),
]);
