import { StatusCodes } from "http-status-codes";
import pool from "../../db.js";

// ------
export const getAllNetworks = async (req, res) => {
  const data = await pool.query(
    `select * from network_master order by network`,
    []
  );
  res.status(StatusCodes.OK).json({ data });
};
