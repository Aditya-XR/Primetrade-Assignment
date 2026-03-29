import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { loginValidation, registerValidation } from "../middleware/auth.validation.js";

const router = Router();

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);

export default router;
