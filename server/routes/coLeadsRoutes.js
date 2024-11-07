import { Router } from "express";
const router = Router();
import {
  coAddLeadStatus,
  coEditLeadStatus,
  getCoListLeadStatus,
} from "../controller/company/coLeadsController.js";
import { validateCoAddLeadStatus } from "../middleware/coLeadsMiddleware.js";
import {
  addCoNetwork,
  deleteCoNetwork,
  editCoNetwork,
  getAllNetworks,
} from "../controller/networkController.js";

router.route(`/co-networks`).get(getAllNetworks).post(addCoNetwork);
router.route(`/co-networks/:id`).put(editCoNetwork).delete(deleteCoNetwork);

router
  .route(`/lead-status/:companyId`)
  .get(getCoListLeadStatus)
  .post(validateCoAddLeadStatus, coAddLeadStatus);
router
  .route(`/lead-status/:companyId/:id`)
  .put(validateCoAddLeadStatus, coEditLeadStatus);

export default router;
