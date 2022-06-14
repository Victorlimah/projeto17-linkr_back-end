import { Router } from "express";
import { userSchema } from "../schemas/userSchema.js";
import { loginSchema } from "../schemas/authSchema.js";
import { SignIn } from "../controllers/authController.js";
import { createUser } from "../controllers/userController.js";
import { sanitizeData } from "../middlewares/userMiddleware.js";
import { validateSchemas } from "../middlewares/validateSchemas.js";
import { sanitizeDataLogin } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post("/signin", validateSchemas(loginSchema), sanitizeDataLogin, SignIn);
authRouter.post('/signup', validateSchemas(userSchema), sanitizeData, createUser );

export default authRouter;
