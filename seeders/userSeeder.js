import { faker } from "@faker-js/faker";
import pool from "../db.js";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../server/utils/passwordUtils.js";
import dayjs from "dayjs";
import { generateSlug } from "../server/utils/functions.js";

const insertUserDb = async () => {
  try {
    await pool.query(`BEGIN`);

    const users = [];
    let fakeName;

    for (let index = 0; index < 100; index++) {
      const user = {
        name: (fakeName = faker.person.fullName()),
        email: faker.internet.email().toLowerCase(),
        mobile: faker.phone.number(),
        password: await hashPassword(`welcome123`),
        role: faker.number.int({ min: 1, max: 4 }),
        uuid: uuidv4(),
        created_at: dayjs(new Date(), "Asia/Kolkata").format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        updated_at: dayjs(new Date(), "Asia/Kolkata").format(
          "YYYY-MM-DD HH:mm:ss"
        ),
      };
      users.push(user);
    }

    for (const user of users) {
      const nameSlug = await generateSlug(user.name);

      await pool.query(
        `insert into users(name, email, mobile, password, role, uuid, slug, created_at, updated_at) values($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          user.name,
          user.email,
          user.mobile,
          user.password.toString(),
          user.role,
          user.uuid,
          nameSlug,
          user.created_at,
          user.updated_at,
        ]
      );
    }

    await pool.query(`COMMIT`);
  } catch (error) {
    await pool.query(`ROLLBACK`);
    console.log(error);
    return error;
  }
};

insertUserDb();
