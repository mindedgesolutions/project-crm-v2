import { Router } from "express";
const router = Router();
import {
  coAddLeadCategory,
  coAddLeadStatus,
  coEditLeadCategory,
  coEditLeadStatus,
  coUploadCsv,
  getCoListLeadCategories,
  getCoListLeads,
  getCoListLeadStatus,
} from "../controller/company/coLeadsController.js";
import {
  validateCoAddLeadCategory,
  validateCoAddLeadStatus,
  validateCoCsvUpload,
} from "../middleware/coLeadsMiddleware.js";
import {
  addCoNetwork,
  deleteCoNetwork,
  editCoNetwork,
  getAllNetworks,
} from "../controller/networkController.js";
import { validateAddNetwork } from "../middleware/networkMiddleware.js";
import { networkImage, leadCsv } from "../middleware/fileUploadMiddleware.js";

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

router
  .route(`/lead-category/:companyId`)
  .get(getCoListLeadCategories)
  .post(validateCoAddLeadCategory, coAddLeadCategory);
router
  .route(`/lead-category/:companyId/:id`)
  .put(validateCoAddLeadCategory, coEditLeadCategory);

router.get(`/leads/:companyId`, getCoListLeads);
router.post(
  `/leads/upload`,
  leadCsv.single("leads"),
  validateCoCsvUpload,
  coUploadCsv
);

export default router;
