import { Router } from "express";
import { publishSchema } from "../schemas/timelineSchema.js";
import { Timeline, PostUrl, TimelineUsers } from "../controllers/timelineController.js";
import { validateSchemas } from "../middlewares/validateSchemas.js";

const timelineRouter = Router();

timelineRouter.get("/timeline", Timeline);
timelineRouter.post("/timeline-users", TimelineUsers);
timelineRouter.post("/timeline",  validateSchemas(publishSchema), PostUrl);

export default timelineRouter