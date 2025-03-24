import express from "express";
import userController from "../controllers/user-controller.js";
import measurementController from "../controllers/measurement-controller.js";
import patientController from "../controllers/patient-controller.js";
import patientMeasurementController from "../controllers/patient-measurement-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const privateRouter = new express.Router();
privateRouter.use(authMiddleware);

//User
privateRouter.get("/api/user/current", userController.get);

//Measurement
privateRouter.post("/api/measurements", measurementController.create);
privateRouter.get("/api/measurement/current", measurementController.get);

//Patient
privateRouter.post("/api/patients", patientController.create);

//Patient-Measurement
privateRouter.post(
  "/api/patient-measurement",
  patientMeasurementController.create
);

export { privateRouter };
