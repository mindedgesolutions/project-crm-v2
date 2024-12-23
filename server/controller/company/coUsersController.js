import { StatusCodes } from "http-status-codes";
import pool from "../../../db.js";
import { generateSlug, paginationLogic } from "../../utils/functions.js";
import { verifyJWT } from "../../utils/tokenUtils.js";
import slug from "slug";
import dayjs from "dayjs";
import { hashPassword } from "../../utils/passwordUtils.js";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";

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

  let groupImg = null,
    groupImgPublicId = null;

  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    groupImg = response.secure_url;
    groupImgPublicId = response.public_id;
  }

  await pool.query(
    `insert into groups(company_id, name, created_by, created_at, updated_at, slug, short_desc, group_img, group_img_public_id) values($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      user.rows[0].company_id,
      name.trim(),
      user.rows[0].id,
      timeStamp,
      timeStamp,
      groupSlug,
      desc.trim(),
      groupImg,
      groupImgPublicId,
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

  let groupImg = null,
    groupImgPublicId = null;

  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    groupImg = response.secure_url;
    groupImgPublicId = response.public_id;
  }

  const oldData = await pool.query(
    `select group_img, group_img_public_id from groups where id=$1`,
    [id]
  );

  if (req.file && oldData.rows[0].group_img_public_id) {
    await cloudinary.v2.uploader.destroy(oldData.rows[0].group_img_public_id);
  }

  await pool.query(
    `update groups set name=$1, updated_at=$2, slug=$3, short_desc=$4, group_img=$5, group_img_public_id=$6 where id=$7`,
    [
      name.trim(),
      timeStamp,
      groupSlug,
      desc.trim(),
      groupImg ?? oldData.rows[0].group_img,
      groupImgPublicId ?? oldData.rows[0].group_img_public_id,
      id,
    ]
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

    const data = await pool.query(
      `select group_img_public_id from groups where id=$1`,
      [id]
    );

    if (data.rows[0].group_img_public_id) {
      await cloudinary.v2.uploader.destroy(data.rows[0].group_img_public_id);
    }

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
    const selectedGroups = JSON.parse(groups);

    if (selectedGroups.length > 0) {
      for (const element of selectedGroups) {
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
export const getCoUser = async (req, res) => {
  const { uuid } = req.params;

  const data = await pool.query(
    `select um.*,
      json_agg(
        json_build_object(
          'uid', ugm.user_id,
          'gid', ugm.group_id,
          'gname', gr.name
        )
      ) AS groups
      from users um
      left join user_group_mapping ugm on um.id = ugm.user_id
      left join groups gr on ugm.group_id = gr.id
      where um.uuid=$1 group by um.id
    `,
    [uuid]
  );

  return res.status(StatusCodes.OK).json({ data });
};

// ------
export const editCoUser = async (req, res) => {
  const { uuid } = req.params;
  const { name, email, mobile, role, groups, password } = req.body;
  const uSlug = await generateSlug(name);
  const timeStamp = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

  try {
    await pool.query(`BEGIN`);

    const updated = await pool.query(
      `update users set name=$1, email=$2, mobile=$3, slug=$4, role=$5, updated_at=$6 where uuid=$7 returning id`,
      [name.trim(), email, mobile, uSlug, role, timeStamp, uuid]
    );

    const id = updated.rows[0].id;

    const selectedGroups = JSON.parse(groups);

    if (selectedGroups[0]?.value) {
      await pool.query(`delete from user_group_mapping where user_id=$1`, [id]);

      for (const element of selectedGroups) {
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

// ------
export const getCoAllUsers = async (req, res) => {
  const { token_crm } = req.cookies;
  const { uuid } = verifyJWT(token_crm);
  const user = await pool.query(
    `select id, company_id from users where uuid=$1`,
    [uuid]
  );

  const data = await pool.query(
    `select id, name from users where company_id=$1 and is_active=true order by name`,
    [user.rows[0].company_id]
  );
  res.status(StatusCodes.OK).json({ data });
};
