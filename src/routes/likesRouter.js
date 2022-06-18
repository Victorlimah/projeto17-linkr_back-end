import { Router } from "express";
import { checkLiked, deleteLike, newLike } from "../controllers/likesController.js";

const likesRouter = Router();

likesRouter.post("/checkLiked", checkLiked);
likesRouter.post("/like", newLike);
likesRouter.post("/unlike", deleteLike);

export default likesRouter;