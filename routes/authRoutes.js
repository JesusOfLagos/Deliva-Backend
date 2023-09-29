import { Router } from "express";
import { local_scope, logout_post, register_post, smart_redirect } from "../controllers/authControllers.js";
import globalErrorHandler from "../utils/errorHandlers/global.js";

const authRouter = Router();


authRouter.post('/:role/register', register_post);
authRouter.post('/:role/login/', local_scope, smart_redirect);
authRouter.post('/:role/logout', logout_post);

export default authRouter; 