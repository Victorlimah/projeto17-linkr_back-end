import { Router } from "express";
import { validateSchemas } from "../middlewares/validateSchemas.js";
import { verifyJWT } from "../utils/verifyJWT.js"
import { repostSchema } from "../schemas/repostSchema.js";
import { getRepostsAmount, RepostPublication } from "../controllers/repostsController.js";

const repostRouter = Router();

repostRouter.post("/repost", verifyJWT, validateSchemas(repostSchema), RepostPublication)
repostRouter.get("/reposts", getRepostsAmount)


export default repostRouter