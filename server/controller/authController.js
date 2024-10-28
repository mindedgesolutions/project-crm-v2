import { StatusCodes } from "http-status-codes";
import pool from "../../db.js";
import { BadRequestError } from "../errors/customErrors.js";
import { checkPassword } from "../utils/passwordUtils.js";
import { createJWT, verifyJWT } from "../utils/tokenUtils.js";
import { v4 as uuidv4 } from "uuid";

// Admin signin ------
export const signIn = async (req, res) => {
  const { username, password, remember } = req.body;

  const checkUsername = await pool.query(
    `select count(*) from users where email=$1 and is_active=true`,
    [username]
  );
  if (Number(checkUsername.rows[0].count) === 0)
    throw new BadRequestError(`Incorrect username`);

  const user = await pool.query(
    `select * from users where email=$1 and role=1 and is_active=true`,
    [username]
  );

  if (Number(user.rowCount) === 0) {
    throw new BadRequestError(`You're not an admin`);
  }

  const checkPass = await checkPassword(password, user.rows[0].password);

  if (!checkPass) throw new BadRequestError(`Incorrect password`);

  const payload = {
    uuid: user.rows[0].uuid,
  };
  const oneDay = 1000 * 60 * 60 * 24;
  const oneMonth = 1000 * 60 * 60 * 24 * 30;

  const token = createJWT(payload, remember);

  const expiryDate = remember
    ? new Date(Date.now() + oneMonth)
    : new Date(Date.now() + oneDay);

  res.cookie("token_crm", token, {
    httpOnly: true,
    expires: expiryDate,
    secure: process.env.APP_ENV === "production",
  });

  res.status(StatusCodes.ACCEPTED).json({ data: user.rows[0], token: token });
};

// Company signin ------
export const cSignIn = async (req, res) => {
  const { username, password, remember } = req.body;

  const checkUsername = await pool.query(
    `select count(*) from users where email=$1 and is_active=true`,
    [username]
  );
  if (Number(checkUsername.rows[0].count) === 0)
    throw new BadRequestError(`Incorrect username`);

  const user = await pool.query(
    `select u.*, c.slug as cslug from users u join companies c on u.company_id = c.id where u.email=$1 and u.is_active=true and c.is_active=true`,
    [username]
  );

  const checkPass = await checkPassword(password, user.rows[0].password);

  if (!checkPass) throw new BadRequestError(`Incorrect password`);

  const payload = {
    uuid: user.rows[0].uuid,
  };
  const oneDay = 1000 * 60 * 60 * 24;
  const oneMonth = 1000 * 60 * 60 * 24 * 30;

  const token = createJWT(payload, remember);

  const expiryDate = remember
    ? new Date(Date.now() + oneMonth)
    : new Date(Date.now() + oneDay);

  res.cookie("token_crm", token, {
    httpOnly: true,
    expires: expiryDate,
    secure: process.env.APP_ENV === "production",
  });

  res.status(StatusCodes.ACCEPTED).json({ data: user.rows[0], token: token });
};

// Admin current user ------
export const currentUser = async (req, res) => {
  const { token_crm } = req.cookies;
  const { uuid } = verifyJWT(token_crm);

  const data = await pool.query(
    `select id, name, role, is_active, slug from users where uuid=$1`,
    [uuid]
  );
  return res.status(StatusCodes.OK).json({ data });
};

// Company current user ------
export const coCurrentUser = async (req, res) => {
  const { token_crm } = req.cookies;
  const { uuid } = verifyJWT(token_crm);
  const data = await pool.query(
    `select u.*, c.slug as cslug from users u join companies c on u.company_id = c.id where u.uuid=$1 and u.is_active=true and c.is_active=true`,
    [uuid]
  );
  return res.status(StatusCodes.OK).json({ data });
};

// ------
export const logout = async (req, res) => {
  res.cookie("token_crm", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.NO_CONTENT).json({ msg: "User logged out" });
};

// ------
export const loginStatus = async (req, res) => {
  const { token_crm } = req.cookies;
  let status = true;
  if (token_crm) {
    const { uuid } = verifyJWT(token_crm);
    status = uuid ? true : false;
  } else {
    status = false;
  }
  res.status(StatusCodes.OK).json({ status });
};

// ------
