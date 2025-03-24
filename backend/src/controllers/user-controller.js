import { logger } from "../applications/logging.js";
import {
  registerService,
  loginService,
  getCurrentUserService,
  getIdService,
} from "../services/user-service.js";
const register = async (req, res, next) => {
  try {
    const result = await registerService(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginService(req.body);
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
    const result = await getCurrentUserService(username);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getId = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    logger.info("TOKEN : " + token);
    const result = await getIdService(token);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default { register, login, get, getId };
