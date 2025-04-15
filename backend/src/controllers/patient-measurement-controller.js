import { ResponseError } from "../errors/response-error.js";
import {
  createService,
  measurementResultService,
  getAllByUserIdService,
  getAllService,
  deletePatientMeasurementService,
  searchPatientMeasurement,
  paginationService,
  paginationByUserService,
  exportXMLService,
  historyMeasurementService,
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

const measurementResult = async (req, res, next) => {
  try {
    const result = await measurementResultService(req.body);
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

const paginationByUser = async (req, res, next) => {
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const query = req.query.query || "";

  try {
    const result = await paginationByUserService(
      user.id,
      page,
      limit,
      skip,
      query
    );

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

const exportXML = async (req, res, next) => {
  try {
    const patientMeasurements = req.body.patientMeasurements;

    console.log("EXPORT : ", patientMeasurements);
    const result = await exportXMLService(patientMeasurements);

    res.set("Content-Type", "application/xml");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="patient-measurement.xml"'
    );
    res.send(result);
  } catch (error) {
    console.error("Export XML error : ", error);
    next(error);
  }
};

const historyMeasurement = async (req, res, next) => {
  try {
    const patientId = req.params.id;
    const result = await historyMeasurementService(patientId);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  measurementResult,
  getAll,
  getAllByUserId,
  deletePatientMeasurement,
  search,
  pagination,
  paginationByUser,
  exportXML,
  historyMeasurement,
};
