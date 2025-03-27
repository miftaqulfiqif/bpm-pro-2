import {
  createPatientService,
  getAllPatientService,
  updatePatientService,
} from "../services/patient-service.js";

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await createPatientService(req.body, user);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await getAllPatientService();
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const patientId = req.params.id;
    const result = await updatePatientService(patientId, req.body);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { create, getAll, update };
