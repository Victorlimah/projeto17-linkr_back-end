import { Router } from "express";
import { publishSchema } from "../schemas/timelineSchema.js";
import { Timeline, PostUrl } from "../controllers/timelineController.js";
import { validateSchemas } from "../middlewares/validateSchemas.js";

const timelineRouter = Router();

timelineRouter.get("/timeline", Timeline);
timelineRouter.post("/timeline",  validateSchemas(publishSchema), PostUrl);

export default timelineRouter