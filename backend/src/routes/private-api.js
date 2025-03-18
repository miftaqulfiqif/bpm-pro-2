import express from "express";
import userController from "../controllers/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const privateRouter = new express.Router();
privateRouter.use(authMiddleware);

privateRouter.get("/api/user/current", userController.get);

export { privateRouter };
