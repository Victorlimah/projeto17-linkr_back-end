import { Router } from "express";
import authRouter from "./authRouter.js";
import hashtagRouter from '../routes/hashtagsRouter.js'
import timelineRouter from "./timelineRouter.js";
import likesRouter from "./likesRouter.js";
import repostRouter from "./repostRouter.js";

const router = Router();

router.use(authRouter);
router.use(timelineRouter);
router.use(hashtagRouter);
router.use(likesRouter);
router.use(repostRouter)

export default router;
