import { StatusCodes } from "http-status-codes";
import pool from "../../../db.js";
import dayjs from "dayjs";
import { verifyJWT } from "../../utils/tokenUtils.js";
import { formatDate } from "../../utils/functions.js";

// ------
export const coReassignLead = async (req, res) => {
  const { leadId } = req.params;
  const { assignTo } = req.body;
  const { token_crm } = req.cookies;
  const { uuid } = verifyJWT(token_crm);
  const user = await pool.query(`select id from users where uuid=$1`, [uuid]);
  const timeStamp = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const leadStatus = 1;
  const leadComments = `lead re-assigned`;

  try {
    await pool.query(`BEGIN`);

    const prevAssigned = await pool.query(
      `select assigned_to from leads where id=$1`,
      [leadId]
    );

    await pool.query(
      `insert into lead_status(lead_id, user_id, lead_status, lead_comments, created_at, updated_at, assigned_from, assigned_to) values($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        leadId,
        user.rows[0].id,
        leadStatus,
        leadComments,
        timeStamp,
        timeStamp,
        prevAssigned.rows[0].assigned_to,
        assignTo,
      ]
    );

    await pool.query(`update leads set assigned_to=$1 where id=$2`, [
      assignTo,
      leadId,
    ]);

    await pool.query(`COMMIT`);

    res.status(StatusCodes.ACCEPTED).json(`success`);
  } catch (error) {
    console.log(error);
    await pool.query(`ROLLBACK`);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ data: `something went wrong!!` });
  }
};

// ------
export const coUpdateStatus = async (req, res) => {
  const { leadId } = req.params;
  const { status, annotation, followup } = req.body;
  const { token_crm } = req.cookies;
  const { uuid } = verifyJWT(token_crm);
  const user = await pool.query(`select id from users where uuid=$1`, [uuid]);
  const timeStamp = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const follwupDate = followup ? formatDate(followup, "start") : null;

  try {
    await pool.query(`BEGIN`);

    await pool.query(
      `insert into lead_status(lead_id, user_id, lead_status, lead_comments, follow_up_date, created_at, updated_at) values($1, $2, $3, $4, $5, $6, $7)`,
      [
        leadId,
        user.rows[0].id,
        status,
        annotation.trim(),
        follwupDate,
        timeStamp,
        timeStamp,
      ]
    );

    await pool.query(`update leads set latest_status=$1 where id=$2`, [
      status,
      leadId,
    ]);

    await pool.query(`COMMIT`);

    res.status(StatusCodes.ACCEPTED).json(`success`);
  } catch (error) {
    await pool.query(`ROLLBACK`);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ data: `something went wrong!!` });
  }
};
