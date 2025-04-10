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
privateRouter.post("/api/user/delete", userController.deleteUser);

//Measurement
privateRouter.post("/api/measurements", measurementController.create);
privateRouter.get("/api/measurement/current", measurementController.get);

//Patient
privateRouter.post("/api/patients", patientController.create);
privateRouter.get("/api/all-patients", patientController.getAll);
privateRouter.get("/api/patients", patientController.getAllByUserId);
privateRouter.get("/api/patients/search", patientController.search);
privateRouter.patch("/api/patient/:id", patientController.update);
privateRouter.delete("/api/patient/:id", patientController.deletePatient);
privateRouter.get("/api/patients-pagination", patientController.pagination);
privateRouter.get(
  "/api/patients-pagination-by-user",
  patientController.paginationByUser
);
privateRouter.post("/api/export-patients", patientController.exportXML);

//Patient-Measurement
privateRouter.post(
  "/api/patient-measurements",
  patientMeasurementController.create
);
privateRouter.post(
  "/api/measurement-result",
  patientMeasurementController.measurementResult
);
privateRouter.get(
  "/api/all-patient-measurements",
  patientMeasurementController.getAll
);
privateRouter.get(
  "/api/patient-measurements",
  patientMeasurementController.getAllByUserId
);
privateRouter.delete(
  "/api/patient-measurement/:id",
  patientMeasurementController.deletePatientMeasurement
);
privateRouter.get(
  "/api/patient-measurements/search",
  patientMeasurementController.search
);
privateRouter.get(
  "/api/patient-measurements-pagination",
  patientMeasurementController.pagination
);
privateRouter.get(
  "/api/patient-measurements-pagination-by-user",
  patientMeasurementController.paginationByUser
);

//Category Result
privateRouter.post("/api/category-results", categoryResultController.create);
privateRouter.get("/api/all-category-results", categoryResultController.getAll);
privateRouter.get(
  "/api/category-results",
  categoryResultController.getAllByUserId
);
privateRouter.patch(
  "/api/category-results/:id",
  categoryResultController.update
);
privateRouter.delete(
  "/api/category-results/:id",
  categoryResultController.deleteCategoryResult
);

export { privateRouter };
