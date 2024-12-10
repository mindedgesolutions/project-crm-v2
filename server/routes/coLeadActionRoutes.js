import { Router } from "express";
const router = Router();
import {
  coReassignLead,
  coUpdateStatus,
} from "../controller/company/coLeadActionController.js";
import {
  validateLeadReassign,
  validateUpdateStatus,
} from "../middleware/coLeadActionMiddleware.js";
import {
  protectCoAdminManagerRoute,
  protectCoUserRoute,
} from "../middleware/authMiddleware.js";

router.post(`/re-assign/:leadId`, [validateLeadReassign], coReassignLead);
router.post(`/update-status/:leadId`, [validateUpdateStatus], coUpdateStatus);

export default router;
