import { StatusCodes } from "http-status-codes";
import pool from "../../db.js";
import { verifyJWT } from "../utils/tokenUtils.js";
import slug from "slug";
import dayjs from "dayjs";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";

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
export const addCoNetwork = async (req, res) => {
  const { token_crm } = req.cookies;
  const { uuid } = verifyJWT(token_crm);
  const user = await pool.query(
    `select id, company_id from users where uuid=$1`,
    [uuid]
  );
  const { name } = req.body;

  const networkSlug = slug(name);
  const timeStamp = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

  let networkImg = null,
    networkImgPublicId = null;

  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    networkImg = response.secure_url;
    networkImgPublicId = response.public_id;
  }

  await pool.query(
    `insert into network_master(network, created_at, updated_at, slug, company_id, network_img, network_img_public_id) values($1, $2, $3, $4, $5, $6, $7)`,
    [
      name.trim(),
      timeStamp,
      timeStamp,
      networkSlug,
      user.rows[0].company_id,
      networkImg,
      networkImgPublicId,
    ]
  );

  res.status(StatusCodes.CREATED).json(`success`);
};

// ------
export const editCoNetwork = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const networkSlug = slug(name);
  const timeStamp = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

  let networkImg = null,
    networkImgPublicId = null;

  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    networkImg = response.secure_url;
    networkImgPublicId = response.public_id;
  }

  const oldData = await pool.query(
    `select network_img, network_img_public_id from network_master where id=$1`,
    [id]
  );

  if (req.file && oldData.rows[0].network_img_public_id) {
    await cloudinary.v2.uploader.destroy(oldData.rows[0].network_img_public_id);
  }

  await pool.query(
    `update network_master set network=$1, updated_at=$2, slug=$3, network_img=$4, network_img_public_id=$5 where id=$6`,
    [
      name.trim(),
      timeStamp,
      networkSlug,
      networkImg ?? oldData.rows[0].network_img,
      networkImgPublicId ?? oldData.rows[0].network_img_public_id,
      id,
    ]
  );

  res.status(StatusCodes.ACCEPTED).json(`success`);
};

// ------
export const deleteCoNetwork = async (req, res) => {
  const { id } = req.params;
};
