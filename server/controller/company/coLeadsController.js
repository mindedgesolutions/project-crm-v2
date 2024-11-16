import { StatusCodes } from "http-status-codes";
import pool from "../../../db.js";
import { paginationLogic } from "../../utils/functions.js";
import slug from "slug";
import dayjs from "dayjs";
import { verifyJWT } from "../../utils/tokenUtils.js";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import csv from "fast-csv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

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

// ------
export const getCoListLeads = async (req, res) => {
  const { companyId } = req.params;
  const { page } = req.query;
  const pagination = paginationLogic(page, null);

  const data = await pool.query(
    `select
    ld.*,
    um.name as assigned,
    nm.network,
    nm.network_img
    from leads ld
    join users um on cast(ld.assigned_to as integer) = um.id
    left join network_master nm on nm.id = ld.network
    where ld.company_id=$3
    offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit, companyId]
  );

  const records = await pool.query(`select * from leads where company_id=$1`, [
    companyId,
  ]);

  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};

// CSV UPLOAD RELATED FUNCTIONS START ------
// ------
// ------
export const coUploadCsv = async (req, res) => {
  const { token_crm } = req.cookies;
  const { uuid } = verifyJWT(token_crm);
  const user = await pool.query(
    `select id, company_id from users where uuid=$1`,
    [uuid]
  );
  const { network, assignType, assignGroup, assignUsers } = req.body;
  const timeStamp = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const networkId = JSON.parse(network).value ?? null;

  // Gettings users starts ------
  let users = [];

  if (assignType === "1") {
    const data = await pool.query(`select id from users where company_id=$1`, [
      user.rows[0].company_id,
    ]);

    for (const value of data.rows) {
      users.push(Number(value.id));
    }
  } else if (assignType === "2") {
    const assignGroupId = JSON.parse(assignGroup).value;
    const data = await pool.query(
      `select um.id
      from users um
      left join user_group_mapping ugm on um.id = ugm.user_id
      where ugm.group_id=$1`,
      [assignGroupId]
    );

    for (const user of data.rows) {
      users.push(Number(user.id));
    }
  } else if (assignType === "3") {
    JSON.parse(assignUsers).map((user) => {
      users.push(Number(user.value));
    });
  }
  // Getting users ends ------

  const additional = {
    company_id: user.rows[0].company_id,
    added_by: user.rows[0].id,
    added_at: timeStamp,
    created_at: timeStamp,
    updated_at: timeStamp,
    network: networkId,
    users,
  };

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const filePath = path.resolve(
    __dirname,
    "../../public",
    "csv",
    req.file.filename
  );

  try {
    await pool.query(`BEGIN`);

    const mobileSet = new Set();
    const uniqueRows = [];

    fs.createReadStream(path.resolve(filePath), { encoding: "utf8" })
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        if (!mobileSet.has(row.mobile_no)) {
          mobileSet.add(row.mobile_no);
          uniqueRows.push(row);
        }
      })
      .on("end", () => {
        insertUniqueLeads(uniqueRows, additional);
      });

    fs.unlink(path.resolve(filePath), (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return;
      }

      console.log("File deleted successfully.");
    });

    await pool.query(`COMMIT`);

    res.status(StatusCodes.CREATED).json(`success`);
  } catch (error) {
    console.log(error);
    await pool.query(`ROLLBACK`);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ data: `something went wrong!!` });
  }
};

// ------
export const insertUniqueLeads = async (uniqueRows, additional) => {
  const {
    company_id,
    added_by,
    added_at,
    created_at,
    updated_at,
    network,
    users,
  } = additional;

  try {
    await pool.query(`BEGIN`);
    const dbIds = [];

    for (const row of uniqueRows) {
      const entries = Object.entries(row);
      const filteredEntries = entries.slice(7);
      const filteredObject = Object.fromEntries(filteredEntries);

      const check = await pool.query(
        `select count(*) from leads where company_id=$1 and mobile=$2`,
        [company_id, row.mobile_no]
      );

      if (Number(check.rows[0].count) === 0) {
        const leadUuid = uuidv4();

        const insert = await pool.query(
          `insert into leads(company_id, added_by, added_at, name, mobile, whatsapp, email, address, city, state, created_at, updated_at, network, uuid, other) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) returning id`,
          [
            company_id,
            added_by,
            added_at,
            row.name,
            row.mobile_no,
            row.whatsapp_no,
            row.email || null,
            row.address || null,
            row.city || null,
            row.state || null,
            created_at,
            updated_at,
            network,
            leadUuid,
            filteredObject,
          ]
        );
        dbIds.push(insert.rows[0].id);
      }
    }
    const lastId = dbIds[dbIds.length - 1];

    await pool.query(
      `WITH user_ids AS (SELECT ARRAY[${users.join(", ")}] AS ids)
      UPDATE leads
      SET assigned_to = (SELECT ids[(leads.id - 1) % ${
        users.length
      } + 1] FROM user_ids)
      WHERE leads.id <= ${lastId} and assigned_to is null`,
      []
    );

    await pool.query(`COMMIT`);
  } catch (error) {
    console.log(error);
    await pool.query(`ROLLBACK`);
  }
};
// ------
// ------
// CSV UPLOAD RELATED FUNCTIONS END ------
