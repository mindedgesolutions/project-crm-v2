import { Router } from "express";
const router = Router();
import { updatePassword } from "../controller/profileController.js";
import { validateChangePassword } from "../middleware/profileMiddleware.js";

router.post(`/change-password`, validateChangePassword, updatePassword);

export default router;
