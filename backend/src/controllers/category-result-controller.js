import {
  createService,
  getAllService,
  updateService,
} from "../services/category-result-service.js";

const create = async (req, res, next) => {
  try {
    const result = await createService(req.user.id, req.body);
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
    const result = await getAllByUserIdService(req.user.id);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await updateService(req.user.id, req.params.id, req.body);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { create, getAll, getAllByUserId, update };
