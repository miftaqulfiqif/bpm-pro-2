import {
  createPatientService,
  getAllPatientService,
  searchPatientService,
  updatePatientService,
} from "../services/patient-service.js";

import { logger } from "../applications/logging.js";
import { ResponseError } from "../errors/response-error.js";

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

const search = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      throw new ResponseError(400, "Query is required");
    }

    logger.info("Query yang diterima " + query);
    console.log(query);

    const result = await searchPatientService(query.trim());
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

export default { create, getAll, search, update };
