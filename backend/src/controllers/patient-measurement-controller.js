import { ResponseError } from "../errors/response-error.js";
import {
  createService,
  getAllByUserIdService,
  getAllService,
  deletePatientMeasurementService,
  searchPatientMeasurement,
  paginationService,
} from "../services/patient-measurement-service.js";

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await createService(user, req.body);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await getAllService();
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

const deletePatientMeasurement = async (req, res, next) => {
  try {
    const user = req.user;
    const patientMeasurementId = req.params.id;
    const result = await deletePatientMeasurementService(
      user.id,
      patientMeasurementId
    );
    res.status(200).json({
      data: result,
      message: "Patient deleted successfully",
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
    const result = await searchPatientMeasurement(query.trim());
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const pagination = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const result = await paginationService(page, limit, skip);

    res.status(200).json({
      currentPage: page,
      totalItems: result.total,
      totalPages: Math.ceil(result.total / limit),
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
  deletePatientMeasurement,
  search,
  pagination,
};
