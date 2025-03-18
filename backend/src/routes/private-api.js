import express from "express";
import userController from "../controllers/user-controller.js";
import measurementController from "../controllers/measurement-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const privateRouter = new express.Router();
privateRouter.use(authMiddleware);

privateRouter.get("/api/user/current", userController.get);
privateRouter.post("/api/user/measurement", measurementController.create);

export { privateRouter };
