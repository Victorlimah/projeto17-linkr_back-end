import { Router } from "express";
import { publishSchema } from "../schemas/timelineSchema.js";
import {
    Timeline, PostUrl, TimelineUsers, TimelineUser, DeleteUserPost, getSpecificPublication, PutPost,
    postFollow, postFollowUser
} from "../controllers/timelineController.js";
import { validateSchemas } from "../middlewares/validateSchemas.js";
import { verifyJWT } from "../utils/verifyJWT.js"
import { repostSchema } from "../schemas/repostSchema.js";

const timelineRouter = Router();

timelineRouter.get("/timeline", Timeline);
timelineRouter.get("/user/:id", TimelineUser);
timelineRouter.get("/publication/:postId", getSpecificPublication)
timelineRouter.post("/timeline-users", TimelineUsers);
timelineRouter.post("/timeline", validateSchemas(publishSchema), PostUrl);
timelineRouter.post("/follow/", postFollow);
timelineRouter.post("/follow-user/", postFollowUser);
timelineRouter.delete("/delete-post", verifyJWT, DeleteUserPost);
timelineRouter.put("/put-post", verifyJWT, PutPost);

export default timelineRouter