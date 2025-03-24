import { createPatientService } from "../services/patient-service.js";

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

export default { create };
