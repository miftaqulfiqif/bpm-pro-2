import express from "express";
import userController from "../controllers/user-controller.js";
import measurementController from "../controllers/measurement-controller.js";
import patientController from "../controllers/patient-controller.js";
import patientMeasurementController from "../controllers/patient-measurement-controller.js";
import categoryResultController from "../controllers/category-result-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const privateRouter = new express.Router();
privateRouter.use(authMiddleware);

//User
privateRouter.get("/api/user/current", userController.get);
privateRouter.delete("/api/user/logout", userController.logout);

//Measurement
privateRouter.post("/api/measurements", measurementController.create);
privateRouter.get("/api/measurement/current", measurementController.get);

//Patient
privateRouter.post("/api/patients", patientController.create);
privateRouter.get("/api/patients", patientController.getAll);
privateRouter.get("/api/patients/search", patientController.search);
privateRouter.patch("/api/patients/:id", patientController.update);

//Patient-Measurement
privateRouter.post(
  "/api/patient-measurement",
  patientMeasurementController.create
);

//Category Result
privateRouter.post("/api/category-results", categoryResultController.create);
privateRouter.get("/api/category-results", categoryResultController.getAll);
privateRouter.get(
  "/api/category-results/by-user",
  categoryResultController.getAllByUserId
);
privateRouter.patch(
  "/api/category-results/:id",
  categoryResultController.update
);

export { privateRouter };
