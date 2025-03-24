import { createService } from "../services/patient-measurement-service.js";

const create = async (req, res, next) => {
  try {
    const result = await createService(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { create };
