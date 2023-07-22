import { Router } from "express";
import { local_scope, logout_post, register_post, smart_redirect } from "../controllers/authControllers.js";
import globalErrorHandler from "../utils/errorHandlers/global.js";

const router = Router();


router.post('/:role/register', register_post);
router.post('/:role/login/', local_scope, smart_redirect);
router.post('/logout', logout_post);

export default router; 