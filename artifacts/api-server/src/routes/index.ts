import { Router, type IRouter } from "express";
import healthRouter from "./health";
import qvacRouter from "./qvac";
import solanaRouter from "./solana";
import privacyRouter from "./privacy";

const router: IRouter = Router();

router.use(healthRouter);
router.use(qvacRouter);
router.use(solanaRouter);
router.use(privacyRouter);

export default router;
