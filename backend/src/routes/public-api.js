import express from "express";
import userController from "../controllers/user-controller.js";


const publicRouter = new express.Router();
publicRouter.post("/api/users", userController.register);
publicRouter.post("/api/users/login", userController.login);
publicRouter.get(
  "/uploads/profile-pictures/:filename",
  userController.showProfilePicture
);

export { publicRouter };
