import { Router, type IRouter } from "express";
import healthRouter from "./health";
import factoryRouter from "./factory";

const router: IRouter = Router();

router.use(healthRouter);
router.use(factoryRouter);

export default router;
