import { Router } from "express";
const router = Router();
import {
  coAddLeadStatus,
  coEditLeadStatus,
  getCoListLeads,
  getCoListLeadStatus,
} from "../controller/company/coLeadsController.js";
import { validateCoAddLeadStatus } from "../middleware/coLeadsMiddleware.js";
import {
  addCoNetwork,
  deleteCoNetwork,
  editCoNetwork,
  getAllNetworks,
} from "../controller/networkController.js";
import { validateAddNetwork } from "../middleware/networkMiddleware.js";
import { networkImage } from "../middleware/imageUploadMiddleware.js";

router
  .route(`/co-networks`)
  .get(getAllNetworks)
  .post(networkImage.single("networkImg"), validateAddNetwork, addCoNetwork);
router
  .route(`/co-networks/:id`)
  .put(networkImage.single("networkImg"), validateAddNetwork, editCoNetwork)
  .delete(deleteCoNetwork);

router
  .route(`/lead-status/:companyId`)
  .get(getCoListLeadStatus)
  .post(validateCoAddLeadStatus, coAddLeadStatus);
router
  .route(`/lead-status/:companyId/:id`)
  .put(validateCoAddLeadStatus, coEditLeadStatus);

router.get(`/leads`, getCoListLeads);

export default router;
