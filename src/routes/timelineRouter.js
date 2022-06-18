import { Router } from "express";
import { publishSchema } from "../schemas/timelineSchema.js";

import { deletePostSchema } from "../schemas/deletePostSchema.js"
import { Timeline, PostUrl, TimelineUsers, TimelineUser, DeleteUserPost, getSpecificPublication } from "../controllers/timelineController.js";
import { validateSchemas } from "../middlewares/validateSchemas.js";

const timelineRouter = Router();

timelineRouter.get("/timeline", Timeline);
timelineRouter.get("/user/:id", TimelineUser);
timelineRouter.get("/publication/:postId", getSpecificPublication)
timelineRouter.post("/timeline-users", TimelineUsers);
timelineRouter.post("/timeline", validateSchemas(publishSchema), PostUrl);
timelineRouter.delete("/delete-post", validateSchemas(deletePostSchema), DeleteUserPost)

export default timelineRouter