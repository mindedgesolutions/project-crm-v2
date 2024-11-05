import { Router } from "express";
const router = Router();
import {
  addCoGroup,
  addCoUser,
  deleteCoGroup,
  editCoGroup,
  editCoUser,
  getCoGroups,
  getCoListUsers,
  getCoUser,
} from "../controller/company/coUsersController.js";
import {
  validateAddCoGroup,
  validateAddCoUser,
} from "../middleware/coUsersMiddleware.js";

router.route(`/groups`).get(getCoGroups).post(validateAddCoGroup, addCoGroup);
router
  .route(`/groups/:id`)
  .put(validateAddCoGroup, editCoGroup)
  .delete(deleteCoGroup);

router.route(`/users`).get(getCoListUsers).post(validateAddCoUser, addCoUser);
router.route(`/users/:uuid`).get(getCoUser).put(validateAddCoUser, editCoUser);

export default router;
