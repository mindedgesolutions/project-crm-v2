import { Router } from "express";
const router = Router();
import {
  coAddLeadCategory,
  coAddLeadStatus,
  coAllLeadStatus,
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
import { protectCoAdminRoute } from "../middleware/authMiddleware.js";

router
  .route(`/co-networks`)
  .get(getAllNetworks)
  .post(
    networkImage.single("networkImg"),
    [protectCoAdminRoute, validateAddNetwork],
    addCoNetwork
  );
router
  .route(`/co-networks/:id`)
  .put(
    networkImage.single("networkImg"),
    [protectCoAdminRoute, validateAddNetwork],
    editCoNetwork
  )
  .delete(deleteCoNetwork);

router
  .route(`/lead-status/:companyId`)
  .get(getCoListLeadStatus)
  .post([protectCoAdminRoute, validateCoAddLeadStatus], coAddLeadStatus);
router
  .route(`/lead-status/:companyId/:id`)
  .put([protectCoAdminRoute, validateCoAddLeadStatus], coEditLeadStatus);
router.get(`/all-lead-status/:companyId`, coAllLeadStatus);

router
  .route(`/lead-category/:companyId`)
  .get(getCoListLeadCategories)
  .post([protectCoAdminRoute, validateCoAddLeadCategory], coAddLeadCategory);
router
  .route(`/lead-category/:companyId/:id`)
  .put([protectCoAdminRoute, validateCoAddLeadCategory], coEditLeadCategory);

router.get(`/leads/:companyId`, getCoListLeads);
router.post(
  `/leads/upload`,
  leadCsv.single("leads"),
  validateCoCsvUpload,
  coUploadCsv
);

export default router;
