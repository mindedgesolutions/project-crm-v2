import { Router } from "express";
const router = Router();
import { coReassignLead } from "../controller/company/coLeadActionController.js";
import { validateLeadReassign } from "../middleware/coLeadActionMiddleware.js";

router.post(`/re-assign/:leadId`, validateLeadReassign, coReassignLead);

export default router;
