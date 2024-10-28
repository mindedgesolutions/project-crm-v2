import { StatusCodes } from "http-status-codes";
import pool from "../../../db.js";
import { generateSlug, paginationLogic } from "../../utils/functions.js";
import { verifyJWT } from "../../utils/tokenUtils.js";
import slug from "slug";
import dayjs from "dayjs";
import { hashPassword } from "../../utils/passwordUtils.js";
import { v4 as uuidv4 } from "uuid";

// ------
export const addCoGroup = async (req, res) => {
  const { token_crm } = req.cookies;
  const { uuid } = verifyJWT(token_crm);
  const user = await pool.query(
    `select id, company_id from users where uuid=$1`,
    [uuid]
  );
  const { name, desc } = req.body;
  const groupSlug = slug(name);
  const timeStamp = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

  await pool.query(
    `insert into groups(company_id, name, created_by, created_at, updated_at, slug, short_desc) values($1, $2, $3, $4, $5, $6, $7)`,
    [
      user.rows[0].company_id,
      name.trim(),
      user.rows[0].id,
      timeStamp,
      timeStamp,
      groupSlug,
      desc.trim(),
    ]
  );

  res.status(StatusCodes.CREATED).json(`success`);
};

// ------
export const editCoGroup = async (req, res) => {
  const { id } = req.params;
  const { name, desc } = req.body;
  const groupSlug = slug(name);
  const timeStamp = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

  await pool.query(
    `update groups set name=$1, updated_at=$2, slug=$3, short_desc=$4 where id=$5`,
    [name.trim(), timeStamp, groupSlug, desc.trim(), id]
  );

  res.status(StatusCodes.ACCEPTED).json(`success`);
};

// ------
export const getCoGroups = async (req, res) => {
  const { token_crm } = req.cookies;
  const { uuid } = verifyJWT(token_crm);
  const user = await pool.query(
    `select id, company_id from users where uuid=$1`,
    [uuid]
  );

  const data = await pool.query(
    `select gr.*,
    json_build_object(
      'total_users', COUNT(ugm.user_id),
      'users', json_agg(
        json_build_object(
          'uname', u.name,
          'uid', u.id
        )
      )
    ) AS details
    from groups gr
    left join user_group_mapping ugm on gr.id = ugm.group_id
    left join users u on u.id = ugm.user_id
    where gr.company_id=$1
    group by gr.id`,
    [user.rows[0].company_id]
  );

  res.status(StatusCodes.OK).json({ data });
};

// ------
export const deleteCoGroup = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(`BEGIN`);

    await pool.query(`delete from user_group_mapping where group_id=$1`, [id]);

    await pool.query(`delete from groups where id=$1`, [id]);

    await pool.query(`COMMIT`);

    res.status(StatusCodes.NO_CONTENT).json(`success`);
  } catch (error) {
    console.log(error);
    await pool.query(`ROLLBACK`);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ data: `something went wrong!!` });
  }
};

// ------
export const addCoUser = async (req, res) => {
  const { token_crm } = req.cookies;
  const { uuid } = verifyJWT(token_crm);
  const user = await pool.query(
    `select id, company_id from users where uuid=$1`,
    [uuid]
  );
  const { name, email, mobile, role, groups, password } = req.body;
  const encPass = await hashPassword(password);
  const uSlug = await generateSlug(name);
  const userUuid = uuidv4();
  const timeStamp = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

  try {
    await pool.query(`BEGIN`);

    const newUser = await pool.query(
      `insert into users(name, email, mobile, password, slug, uuid, role, created_at, updated_at, company_id) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning id`,
      [
        name.trim(),
        email,
        mobile,
        encPass,
        uSlug,
        userUuid,
        role,
        timeStamp,
        timeStamp,
        user.rows[0].company_id,
      ]
    );

    const id = newUser.rows[0].id;

    if (groups.length > 0) {
      for (const element of groups) {
        await pool.query(
          `insert into user_group_mapping(user_id, group_id) values($1, $2)`,
          [id, element.value]
        );
      }
    }

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
export const getCoListUsers = async (req, res) => {
  const { token_crm } = req.cookies;
  const { page, type, search } = req.query;
  const { uuid } = verifyJWT(token_crm);
  const user = await pool.query(
    `select id, company_id from users where uuid=$1`,
    [uuid]
  );

  const pagination = paginationLogic(page, null);

  let searchStr = "";

  searchStr = type ? searchStr + ` and rm.role='${type}'` : searchStr;
  searchStr = search
    ? searchStr +
      ` and (um.name ilike '%${search.trim()}%' or um.email ilike '%${search.trim()}%' or um.mobile ilike '%${search.trim()}%')`
    : searchStr;

  const data = await pool.query(
    `select um.*, rm.role from users um join roles rm on rm.id = um.role where um.id is not null ${searchStr} and um.company_id=$3 and um.id!=$4 order by um.name offset $1 limit $2`,
    [
      pagination.offset,
      pagination.pageLimit,
      user.rows[0].company_id,
      user.rows[0].id,
    ]
  );

  const records = await pool.query(
    `select um.*, rm.role from users um join roles rm on rm.id = um.role where um.id is not null ${searchStr} and um.company_id=$1 and um.id!=$2`,
    [user.rows[0].company_id, user.rows[0].id]
  );

  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};
