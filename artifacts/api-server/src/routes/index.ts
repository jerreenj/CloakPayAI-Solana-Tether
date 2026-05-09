import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import qvacRouter from "./qvac.js";
import solanaRouter from "./solana.js";
import privacyRouter from "./privacy.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(qvacRouter);
router.use(solanaRouter);
router.use(privacyRouter);

export default router;
