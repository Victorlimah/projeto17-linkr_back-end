import { Router } from "express";
import authRouter from "./authRouter.js";
import hashtagRouter from '../routes/hashtagsRouter.js'
import timelineRouter from "./timelineRouter.js";

const router = Router();

router.use(authRouter);
router.use(timelineRouter);
router.use(hashtagRouter)

export default router;
