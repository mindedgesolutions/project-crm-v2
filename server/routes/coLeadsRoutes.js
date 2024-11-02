import { Router } from "express";
const router = Router();
import {
  coAddLeadStatus,
  coEditLeadStatus,
  getCoListLeadStatus,
} from "../controller/company/coLeadsController.js";
import { validateCoAddLeadStatus } from "../middleware/coLeadsMiddleware.js";

router
  .route(`/lead-status/:companyId`)
  .get(getCoListLeadStatus)
  .post(validateCoAddLeadStatus, coAddLeadStatus);
router
  .route(`/lead-status/:companyId/:id`)
  .put(validateCoAddLeadStatus, coEditLeadStatus);

export default router;
