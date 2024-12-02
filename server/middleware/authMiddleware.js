import { body } from "express-validator";
import { withValidationErrors } from "./withErrorsMiddleware.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";
import pool from "../../db.js";

export const validateAdSignin = withValidationErrors([
  body("username")
    .notEmpty()
    .withMessage(`Username is required`)
    .bail()
    .isEmail()
    .withMessage(`Username must be a valid email`),
  body("password").notEmpty().withMessage(`Password is required`),
]);

// ------
export const protectSuperAdminRoute = async (req, res, next) => {
  const { token_crm } = req.cookies;
  const { uuid } = verifyJWT(token_crm);
  const check = await pool.query(
    `select count(*) from users where uuid=$1 and role=1 and is_active=true`,
    [uuid]
  );
  if (check.rows[0].count === "0") {
    res.cookie("token_crm", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    throw new UnauthenticatedError(`Not a Super Admin!`);
  }
  next();
};

// ------
export const protectCoRoute = async (req, res, next) => {
  const { token_crm } = req.cookies;
  const { companyId } = req.params;
  const { uuid } = verifyJWT(token_crm);
  const check = await pool.query(
    `select count(*) from users where uuid=$1 and company_id=$2 and is_active=true`,
    [uuid, companyId]
  );
  if (check.rows[0].count === "0") {
    res.cookie("token_crm", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    throw new UnauthenticatedError(`Not a Company User!`);
  }
  next();
};

// ------
export const protectCoAdminRoute = async (req, res, next) => {
  const { token_crm } = req.cookies;
  const { companyId } = req.params;
  const { uuid } = verifyJWT(token_crm);
  const check = await pool.query(
    `select count(*) from users where uuid=$1 and company_id=$2 and role=2 and is_active=true`,
    [uuid, companyId]
  );
  if (check.rows[0].count === "0") {
    res.cookie("token_crm", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    throw new UnauthenticatedError(`Not an Admin!`);
  }
  next();
};

// ------
export const protectCoManagerRoute = async (req, res, next) => {
  const { token_crm } = req.cookies;
  const { companyId } = req.params;
  const { uuid } = verifyJWT(token_crm);
  const check = await pool.query(
    `select count(*) from users where uuid=$1 and company_id=$2 and role=3 and is_active=true`,
    [uuid, companyId]
  );
  if (check.rows[0].count === "0") {
    res.cookie("token_crm", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    throw new UnauthenticatedError(`Not a Manager!`);
  }
  next();
};

// ------
export const protectCoAdminManagerRoute = async (req, res, next) => {
  const { token_crm } = req.cookies;
  const { companyId } = req.params;
  const { uuid } = verifyJWT(token_crm);
  const check = await pool.query(
    `select count(*) from users where uuid=$1 and company_id=$2 and (role=2 or role=3) and is_active=true`,
    [uuid, companyId]
  );
  if (check.rows[0].count === "0") {
    res.cookie("token_crm", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    throw new UnauthenticatedError(`Not an Admin / a Manager!`);
  }
  next();
};

// ------
export const protectCoUserRoute = async (req, res, next) => {
  const { token_crm } = req.cookies;
  const { companyId } = req.params;
  const { uuid } = verifyJWT(token_crm);
  const check = await pool.query(
    `select count(*) from users where uuid=$1 and company_id=$2 and role=4 and is_active=true`,
    [uuid, companyId]
  );
  if (check.rows[0].count === "0") {
    res.cookie("token_crm", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    throw new UnauthenticatedError(`Not a User!`);
  }
  next();
};
