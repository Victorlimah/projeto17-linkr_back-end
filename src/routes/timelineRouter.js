import { Router } from "express";
import { publishSchema } from "../schemas/timelineSchema.js";
import { Timeline, PostUrl, TimelineUsers, TimelineUser } from "../controllers/timelineController.js";
import { validateSchemas } from "../middlewares/validateSchemas.js";

const timelineRouter = Router();

timelineRouter.get("/timeline", Timeline);
timelineRouter.get("/user/:id", TimelineUser);
timelineRouter.post("/timeline-users", TimelineUsers);
timelineRouter.post("/timeline", validateSchemas(publishSchema), PostUrl);

export default timelineRouter