import { logger } from "../applications/logging.js";
import {
  registerService,
  loginService,
  getCurrentUserService,
  getIdService,
  logOutService,
  deleteService,
  updateService,
  updatePasswordService,
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
      data: {
        token: result.token,
        user: {
          id: result.id,
          name: result.name,
          username: result.username,
        },
      },
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

const logout = async (req, res, next) => {
  try {
    const username = req.user.username;
    await logOutService(username);
    res.status(200).json({
      data: "OK",
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await deleteService(req.user.token, req.body.password);
    res.status(200).json({
      data: "OK",
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await updateService(req.user, req.body);
    res.status(200).json({
      message: "Update user is successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const result = await updatePasswordService(req.user, req.body);
    res.status(200).json({
      message: "Update password is successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  get,
  getId,
  logout,
  deleteUser,
  update,
  updatePassword,
};
