import {
  createService,
  getMeasurementService,
} from "../services/measurement-service.js";

const create = async (req, res, next) => {
  try {
    const result = await createService(req.body, req.user);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const username = req.user.username;
    const result = await getMeasurementService(username);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default { create, get };
