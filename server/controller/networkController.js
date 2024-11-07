import { StatusCodes } from "http-status-codes";
import pool from "../../db.js";
import { verifyJWT } from "../utils/tokenUtils.js";

// ------
export const getAllNetworks = async (req, res) => {
  const { token_crm } = req.cookies;
  const { uuid } = verifyJWT(token_crm);
  const company = await pool.query(
    `select company_id from users where uuid=$1`,
    [uuid]
  );
  const company_id = company.rows[0].company_id;

  const data = await pool.query(
    `select * from network_master where company_id is null or company_id=$1 order by network`,
    [company_id]
  );
  res.status(StatusCodes.OK).json({ data });
};

// ------
export const addCoNetwork = async (req, res) => {};

// ------
export const editCoNetwork = async (req, res) => {
  const { id } = req.params;
};

// ------
export const deleteCoNetwork = async (req, res) => {
  const { id } = req.params;
};
