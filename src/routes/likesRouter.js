import { Router } from "express";
import { checkLiked } from "../controllers/likesController.js";

const likesRouter = Router();

likesRouter.post("/checkLiked", checkLiked);
likesRouter.post("/like");
likesRouter.post("/unlike");

export default likesRouter;