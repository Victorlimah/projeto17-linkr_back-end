import { Router } from "express";
import { hashtagTimeline } from "../controllers/hashtagController.js";
import { getTrending } from "../controllers/timelineController.js";

const hashtagRouter = Router();

hashtagRouter.get("/trending", getTrending);
hashtagRouter.get("/hashtag-timeline/:hashtag", hashtagTimeline)

export default hashtagRouter;
