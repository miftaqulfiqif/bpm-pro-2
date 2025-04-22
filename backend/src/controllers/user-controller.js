import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
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
  updateProfilePictureService,
} from "../services/user-service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
          profile_picture: result.profile_picture,
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

const updateProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const file = req.file;
    const path = await updateProfilePictureService(userId, file);
    res.status(200).json({
      message: "Profile picture updated successfully",
      data: path,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload profile picture" });
  }
};

const showProfilePicture = async (req, res, next) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(
      __dirname,
      "../../uploads/profile_pictures",
      filename
    );

    console.log("File path :", filePath);

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
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
  updateProfilePicture,
  showProfilePicture,
};
