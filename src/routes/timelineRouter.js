import { Router } from "express";
import { publishSchema } from "../schemas/timelineSchema.js";
import { Timeline, PostUrl, TimelineUsers, TimelineUser, DeleteUserPost, getSpecificPublication, PutPost } from "../controllers/timelineController.js";
import { validateSchemas } from "../middlewares/validateSchemas.js";
import { verifyJWT } from "../utils/verifyJWT.js"

const timelineRouter = Router();

timelineRouter.get("/timeline", Timeline);
timelineRouter.get("/user/:id", TimelineUser);
timelineRouter.get("/publication/:postId", getSpecificPublication)
timelineRouter.post("/timeline-users", TimelineUsers);
timelineRouter.post("/timeline", validateSchemas(publishSchema), PostUrl);
timelineRouter.delete("/delete-post", verifyJWT, DeleteUserPost)
timelineRouter.put("/put-post", verifyJWT, PutPost)

export default timelineRouter