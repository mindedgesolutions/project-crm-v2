import { Router } from "express";
const router = Router();
import {
  signIn,
  currentUser,
  logout,
  loginStatus,
  cSignIn,
  coCurrentUser,
  coLoginStatus,
} from "../controller/authController.js";
import {
  protectCoRoute,
  validateAdSignin,
} from "../middleware/authMiddleware.js";

router.post(`/sign-in`, validateAdSignin, signIn);
router.get(`/current-user`, currentUser);
router.post(`/logout`, logout);
router.get(`/check-login`, loginStatus);

router.post(`/company/sign-in`, validateAdSignin, cSignIn);
router.get(`/company/current-user`, coCurrentUser);

router.get(`/company/check-login/:companyId`, protectCoRoute, coLoginStatus);

export default router;
