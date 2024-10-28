import { StatusCodes } from "http-status-codes";
import pool from "../../../db.js";
import slug from "slug";
import dayjs from "dayjs";
import { paginationLogic } from "../../utils/functions.js";

// ------
export const getListPlanAttributes = async (req, res) => {
  const { page } = req.query;
  const pagination = paginationLogic(page, null);

  const data = await pool.query(
    `select * from plan_attributes order by attribute offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(`select * from plan_attributes`, []);

  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};

// ------
export const getAllPlanAttributes = async (req, res) => {
  const data = await pool.query(
    `select id, attribute, type, name from plan_attributes order by attribute`,
    []
  );

  res.status(StatusCodes.OK).json({ data });
};

// ------
export const addPlanAttribute = async (req, res) => {
  const { attribute, type } = req.body;
  const attrSlug = slug(attribute);
  const timeStamp = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

  try {
    await pool.query(`BEGIN`);

    const data = await pool.query(
      `insert into plan_attributes(attribute, type, created_at, updated_at, slug) values($1, $2, $3, $4, $5) returning id`,
      [attribute.trim(), type, timeStamp, timeStamp, attrSlug]
    );

    const id = data.rows[0].id;
    const slugArr = attrSlug.split("-");
    let name = "";
    slugArr.forEach((element) => {
      name += element.substring(0, 1);
    });
    name = `${name}_${id}`;

    await pool.query(`update plan_attributes set name=$1 where id=$2`, [
      name,
      id,
    ]);

    await pool.query(`COMMIT`);
    res.status(StatusCodes.CREATED).json(`success`);
  } catch (error) {
    await pool.query(`ROLLBACK`);
    console.log(error);
    return error;
  }
};

// ------
export const editPlanAttribute = async (req, res) => {
  const { attribute, type } = req.body;
  const { id } = req.params;
  const attrSlug = slug(attribute);
  const timeStamp = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

  try {
    await pool.query(`BEGIN`);

    await pool.query(
      `update plan_attributes set attribute=$1, type=$2, updated_at=$3, slug=$4 where id=$5`,
      [attribute.trim(), type, timeStamp, attrSlug, id]
    );

    const slugArr = attrSlug.split("-");
    let name = "";
    slugArr.forEach((element) => {
      name += element.substring(0, 1);
    });
    name = `${name}_${id}`;

    await pool.query(`update plan_attributes set name=$1 where id=$2`, [
      name,
      id,
    ]);

    await pool.query(`COMMIT`);
    res.status(StatusCodes.ACCEPTED).json(`success`);
  } catch (error) {
    await pool.query(`ROLLBACK`);
    console.log(error);
    return error;
  }
};

// ------
export const deleteListPlanAttribute = async (req, res) => {
  const { id } = req.params;

  await pool.query(`update plan_attributes set is_active=false where id=$1`, [
    id,
  ]);

  res.status(StatusCodes.NO_CONTENT).json(`success`);
};

// ------
export const activatePlanAttribute = async (req, res) => {
  const { id } = req.params;

  await pool.query(`update plan_attributes set is_active=true where id=$1`, [
    id,
  ]);

  res.status(StatusCodes.NO_CONTENT).json(`success`);
};

// ------
export const getListPlans = async (req, res) => {
  const { page } = req.query;
  const pagination = paginationLogic(page, null);

  const data = await pool.query(
    `select pm.id,
    pm.name,
    pm.price,
    pm.tenure,
    pm.slug,
    pm.id,
    pm.is_active,
    pm.updated_at,
    json_agg(
      json_build_object(
        'plan_id', pd.plan_id,
        'attr_id', pd.attr_id,
        'attr_value', pd.attr_value
      )
    ) AS details
    from plans pm
    left join plan_details pd on pm.id = pd.plan_id
    group by pm.id
    order by pm.name offset $1 limit $2`,
    [pagination.offset, pagination.pageLimit]
  );

  const records = await pool.query(`select * from plans`, []);

  const totalPages = Math.ceil(records.rowCount / pagination.pageLimit);
  const meta = {
    totalPages: totalPages,
    currentPage: pagination.pageNo,
    totalRecords: records.rowCount,
  };

  res.status(StatusCodes.OK).json({ data, meta });
};

// ------
export const addNewPlan = async (req, res) => {
  const obj = { ...req.body };
  const { name, shortDesc, tenure, price } = obj;
  let planSlug = slug(name);
  const timeStamp = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

  let addSlug = "";
  switch (tenure) {
    case "1":
      addSlug = "-monthly";
      break;
    case "3":
      addSlug = "-quarterly";
      break;
    case "12":
      addSlug = "-yearly";
      break;
  }
  planSlug = planSlug + addSlug;

  try {
    await pool.query(`BEGIN`);

    const data = await pool.query(
      `insert into plans(name, short_desc, price, created_at, updated_at, slug, tenure) values($1, $2, $3, $4, $5, $6, $7) returning id`,
      [
        name.trim(),
        shortDesc.trim(),
        price,
        timeStamp,
        timeStamp,
        planSlug,
        tenure,
      ]
    );

    const planId = data.rows[0].id;

    const arr = Object.entries(obj);

    for (const element of arr) {
      const field = element[0];
      const value = element[1];

      if (
        field !== "name" &&
        field !== "shortDesc" &&
        field !== "tenure" &&
        field !== "price"
      ) {
        const fieldId = await pool.query(
          `select id from plan_attributes where name=$1`,
          [field]
        );

        const dbValue = value || null;

        await pool.query(
          `insert into plan_details(plan_id, attr_id, attr_value) values($1, $2, $3)`,
          [planId, fieldId.rows[0].id, dbValue]
        );
      }
    }

    await pool.query(`COMMIT`);

    res.status(StatusCodes.CREATED).json({ data: `success` });
  } catch (error) {
    console.log(error);
    await pool.query(`ROLLBACK`);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ data: `something went wrong!!` });
  }
};

// ------
export const editPlanDetails = async (req, res) => {
  const obj = { ...req.body };
  const { id } = req.params;
  const { name, shortDesc, tenure, price } = obj;
  let planSlug = slug(name);
  const timeStamp = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

  let addSlug = "";
  switch (tenure) {
    case "1":
      addSlug = "-monthly";
      break;
    case "3":
      addSlug = "-quarterly";
      break;
    case "12":
      addSlug = "-yearly";
      break;
  }
  planSlug = planSlug + addSlug;

  try {
    await pool.query(`BEGIN`);

    await pool.query(
      `update plans set name=$1, short_desc=$2, price=$3, updated_at=$4, slug=$5, tenure=$6 where id=$7`,
      [name.trim(), shortDesc.trim(), price, timeStamp, planSlug, tenure, id]
    );

    await pool.query(`delete from plan_details where plan_id=$1`, [id]);

    const arr = Object.entries(obj);

    for (const element of arr) {
      const field = element[0];
      const value = element[1];

      if (
        field !== "name" &&
        field !== "shortDesc" &&
        field !== "tenure" &&
        field !== "price"
      ) {
        const fieldId = await pool.query(
          `select id from plan_attributes where name=$1`,
          [field]
        );

        const dbValue = value || null;

        await pool.query(
          `insert into plan_details(plan_id, attr_id, attr_value) values($1, $2, $3)`,
          [id, fieldId.rows[0].id, dbValue]
        );
      }
    }

    await pool.query(`COMMIT`);

    res.status(StatusCodes.CREATED).json({ data: `success` });
  } catch (error) {
    console.log(error);
    await pool.query(`ROLLBACK`);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ data: `something went wrong!!` });
  }
};

// ------
export const getSinglePlan = async (req, res) => {
  const { id } = req.params;
  const data = await pool.query(
    `select pm.*,
      json_agg(
        json_build_object(
          'plan_id', pd.plan_id,
          'attr_id', pd.attr_id,
          'attr_value', pd.attr_value
        )
      ) AS details
    from plans pm
    left join plan_details pd on pm.id=pd.plan_id
    where pm.id=$1
    group by pm.id`,
    [id]
  );

  let dynamic = {};
  const attributes = await pool.query(`select id, name from plan_attributes`);

  for (const element of attributes.rows) {
    const data = await pool.query(
      `select attr_id, attr_value from plan_details where plan_id=$1 and attr_id=$2`,
      [id, element.id]
    );
    let key = element.name;
    dynamic[key] = data.rows[0].attr_value;
  }

  res.status(StatusCodes.OK).json({ data, dynamic });
};

// ------
export const deletePlan = async (req, res) => {
  const { id } = req.params;

  await pool.query(`update plans set is_active=false where id=$1`, [id]);

  res.status(StatusCodes.NO_CONTENT).json(`success`);
};

// ------
export const activatePlan = async (req, res) => {
  const { id } = req.params;

  await pool.query(`update plans set is_active=true where id=$1`, [id]);

  res.status(StatusCodes.ACCEPTED).json(`success`);
};
