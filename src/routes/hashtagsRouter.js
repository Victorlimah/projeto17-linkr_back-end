import { Router } from "express";
import { getTrending } from "../controllers/timelineController.js";

const hashtagRouter = Router();

hashtagRouter.get("/trending", getTrending);

export default hashtagRouter;
