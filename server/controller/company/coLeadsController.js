import { StatusCodes } from "http-status-codes";
import pool from "../../../db.js";
import { generateSlug, paginationLogic } from "../../utils/functions.js";
import { verifyJWT } from "../../utils/tokenUtils.js";
import slug from "slug";
import dayjs from "dayjs";
import { hashPassword } from "../../utils/passwordUtils.js";
import { v4 as uuidv4 } from "uuid";

// ------
export const coAddLeadStatus = async (req, res) => {
  const { companyId } = req.params;
  const { name } = req.body;
  const leadSlug = slug(name);
  const timeStamp = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

  await pool.query(
    `insert into lead_status_master(status, company_id, created_at, updated_at, slug) values($1, $2, $3, $4, $5)`,
    [name.trim(), companyId, timeStamp, timeStamp, leadSlug]
  );

  res.status(StatusCodes.CREATED).json(`success`);
};

// ------
export const coEditLeadStatus = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const leadSlug = slug(name);
  const timeStamp = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

  await pool.query(
    `update lead_status_master set status=$1, updated_at=$2, slug=$3 where id=$4`,
    [name.trim(), timeStamp, leadSlug, id]
  );

  res.status(StatusCodes.CREATED).json(`success`);
};

// ------
export const getCoListLeadStatus = async (req, res) => {
  const { companyId } = req.params;
  const { page } = req.query;
  const pagination = paginationLogic(page, null);

  const data = await pool.query(
    `select lsm.* from lead_status_master lsm where lsm.company_id is null or lsm.company_id=$3 order by lsm.company_id desc offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit, companyId]
  );

  const records = await pool.query(
    `select lsm.* from lead_status_master lsm where lsm.company_id is null or lsm.company_id=$1`,
    [companyId]
  );

  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};
