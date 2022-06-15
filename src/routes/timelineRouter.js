import { Router } from "express";
import { publishSchema } from "../schemas/timelineSchema.js";
import { Timeline, PostUrl } from "../controllers/timelineController.js";

const timelineRouter = Router();

timelineRouter.get("/timeline", Timeline);
timelineRouter.post("/timeline", publishSchema, PostUrl);

export default timelineRouter