import {
  createPatientService,
  deletePatientService,
  getAllPatientService,
  getAllByUserIdService,
  searchPatientService,
  updatePatientService,
  paginationService,
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

const getAllByUserId = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await getAllByUserIdService(user.id);
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

const deletePatient = async (req, res, next) => {
  try {
    const user = req.user;
    const patientId = req.params.id;
    const result = await deletePatientService(user.id, patientId);
    res.status(200).json({
      data: result,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const pagination = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const query = req.query.query || "";

  try {
    const result = await paginationService(page, limit, skip, query);

    res.status(200).json({
      current_page: page,
      total_items: result.total,
      total_pages: Math.ceil(result.total / limit),
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  getAll,
  getAllByUserId,
  search,
  update,
  deletePatient,
  pagination,
};
