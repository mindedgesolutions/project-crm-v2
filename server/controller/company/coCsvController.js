import { StatusCodes } from "http-status-codes";
import pool from "../../../db.js";
import { paginationLogic } from "../../utils/functions.js";

// ------
export const getListCsvs = async (req, res) => {
  const { page } = req.query;
  const pagination = paginationLogic(page, null);

  const data = await pool.query(
    `select cm.*, pt.platform as platform_name from csv_master cm left join platforms pt on cm.platform = pt.id order by cm.csv_date desc offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(`select * from csv_master`, []);

  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};

// ------
export const uploadCsv = async (req, res) => {
  // const {}
};
