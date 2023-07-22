import { Router } from "express";
import { local_scope, logout_post, register_post } from "../controllers/authControllers.js";

const router = Router();


router.post('/register', register_post);
router.post('/login', local_scope, (req, res) => {
   res.json({message: 'we are in'})
});
router.post('/logout', logout_post);

export default router; 