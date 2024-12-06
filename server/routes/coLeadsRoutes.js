import { Router } from "express";
const router = Router();
import {
  coAddLeadCategory,
  coAddLeadStatus,
  coAllLeadStatus,
  coEditLeadCategory,
  coEditLeadStatus,
  coLeadDetails,
  coUploadCsv,
  getCoListLeadCategories,
  getCoListLeads,
  getCoListLeadStatus,
  getCoUserListLeads,
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
import {
  protectCoAdminRoute,
  protectCoUserRoute,
} from "../middleware/authMiddleware.js";

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

router.get(`/leads/:companyId`, protectCoAdminRoute, getCoListLeads);
router.post(
  `/leads/upload`,
  leadCsv.single("leads"),
  validateCoCsvUpload,
  coUploadCsv
);

router.get(`/leads/:companyId/:userId`, protectCoUserRoute, getCoUserListLeads);

router.get(`/single-lead-info/:leadUuid`, coLeadDetails);

export default router;
