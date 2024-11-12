import { Router } from "express";
const router = Router();
import {
  addCoGroup,
  addCoUser,
  deleteCoGroup,
  editCoGroup,
  editCoUser,
  getCoAllUsers,
  getCoGroups,
  getCoListUsers,
  getCoUser,
} from "../controller/company/coUsersController.js";
import {
  validateAddCoGroup,
  validateAddCoUser,
} from "../middleware/coUsersMiddleware.js";
import { groupImage } from "../middleware/fileUploadMiddleware.js";

router
  .route(`/groups`)
  .get(getCoGroups)
  .post(groupImage.single("groupImg"), validateAddCoGroup, addCoGroup);
router
  .route(`/groups/:id`)
  .put(groupImage.single("groupImg"), validateAddCoGroup, editCoGroup)
  .delete(deleteCoGroup);

router.route(`/users`).get(getCoListUsers).post(validateAddCoUser, addCoUser);
router.route(`/users/:uuid`).get(getCoUser).put(validateAddCoUser, editCoUser);

router.get(`/all-users`, getCoAllUsers);

export default router;
