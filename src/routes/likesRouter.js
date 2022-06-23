import { Router } from "express";
import { checkLiked, deleteLike, newComment, newLike } from "../controllers/likesController.js";

const likesRouter = Router();

likesRouter.post("/checkLiked", checkLiked);
likesRouter.post("/like", newLike);
likesRouter.post("/unlike", deleteLike);
likesRouter.post("/comment", newComment);

export default likesRouter;