import { createService } from "../services/measurement-service.js";

const create = async (req, res, next) => {
  try {
    const result = await createService(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default { create };
