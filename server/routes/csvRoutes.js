import { Router } from "express";
const router = Router();
import { getListCsvs } from "../controller/company/coCsvController.js";

router.get(`/csv/list`, getListCsvs);

export default router;
