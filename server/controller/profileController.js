import { StatusCodes } from "http-status-codes";
import pool from "../../db.js";
import { verifyJWT } from "../utils/tokenUtils.js";
import { hashPassword } from "../utils/passwordUtils.js";

// ------
export const updatePassword = async (req, res) => {
  const { token_crm } = req.cookies;
  const { uuid } = verifyJWT(token_crm);
  const { newPassword } = req.body;
  const encPassword = await hashPassword(newPassword);

  await pool.query(`update users set password=$1 where uuid=$2`, [
    encPassword,
    uuid,
  ]);
  res.status(StatusCodes.ACCEPTED).json(`success`);
};
