import { StatusCodes } from "http-status-codes";
import pool from "../../../db.js";
import { paginationLogic } from "../../utils/functions.js";

// ------
export const adListUsers = async (req, res) => {
  const { page, type, search } = req.query;
  const pagination = paginationLogic(page, null);

  let searchStr = "";

  searchStr = type ? searchStr + ` and rm.role='${type}'` : searchStr;
  searchStr = search
    ? searchStr +
      ` and (um.name ilike '%${search.trim()}%' or um.email ilike '%${search.trim()}%' or um.mobile ilike '%${search.trim()}%')`
    : searchStr;

  const data = await pool.query(
    `select um.*, rm.role from users um join roles rm on rm.id = um.role where um.id is not null ${searchStr} order by um.name offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(
    `select um.*, rm.role from users um join roles rm on rm.id = um.role where um.id is not null ${searchStr}`,
    []
  );

  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};
