import { Router } from "express";
import { PageController } from "../controllers/page.controller";

const router = Router();

// Login page (GET)
router.get("/login", PageController.loginPage);

// Login page submit (POST)
router.post("/auth/login-page", PageController.loginPageSubmit);

export default router;
