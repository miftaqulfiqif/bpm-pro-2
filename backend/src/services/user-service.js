import bcrypt, { compare } from "bcrypt";
import {
  getUserValidation,
  loginValidation,
  registerValidation,
  deleteUserValidation,
  updateUserValidation,
  updatePasswordValidation,
} from "../validation/user-validation.js";
import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import { validate } from "../validation/validation.js";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";

const registerService = async (request) => {
  try {
    const user = validate(registerValidation, request);
    let { name, username, password } = user;

    const countUser = await prismaClient.user.count({
      where: { username: username },
    });

    if (countUser > 0) {
      throw new ResponseError(400, "Username already exists");
    }

    password = await bcrypt.hash(password, 10);

    return prismaClient.user.create({
      data: {
        id: uuid(),
        name: name,
        username: username,
        password: password,
      },
      select: {
        username: true,
        name: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

const loginService = async (request) => {
  try {
    const user = validate(loginValidation, request);

    const userFound = await prismaClient.user.findFirst({
      where: {
        username: user.username,
      },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });

    if (!userFound) {
      throw new ResponseError(401, "Username or password wrong");
    }

    const isValidPassword = await bcrypt.compare(
      user.password,
      userFound.password
    );

    if (!isValidPassword) {
      throw new ResponseError(401, "Username or password wrong");
    }

    const token = uuid().toString();

    return prismaClient.user.update({
      data: {
        token: token,
      },
      where: {
        id: userFound.id,
      },
      select: {
        token: true,
        id: true,
        name: true,
        username: true,
        profile_picture: {
          select: {
            path: true,
          },
        },
      },
    });
  } catch (e) {
    throw e;
  }
};

const getCurrentUserService = async (username) => {
  try {
    username = validate(getUserValidation, username);

    const userFound = await prismaClient.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
        name: true,
        username: true,
        profile_picture: {
          select: {
            path: true,
          },
        },
      },
    });

    if (!userFound) {
      throw new ResponseError(404, "User not found");
    }

    return userFound;
  } catch (e) {
    throw e;
  }
};

const getIdService = async (token) => {
  try {
    const userFound = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
      select: {
        id: true,
      },
    });

    if (!userFound) {
      throw new ResponseError(404, "User not found");
    }

    return userFound;
  } catch (e) {
    throw e;
  }
};

const logOutService = async (username) => {
  try {
    return await prismaClient.user.update({
      where: {
        username,
      },
      data: {
        token: null,
      },
    });
  } catch (e) {
    throw new Error(`Failed to log out user ${username}: ${e.message}`);
  }
};

const deleteService = async (token, password) => {
  try {
    password = validate(deleteUserValidation, password);

    const user = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
    });

    if (!user) {
      throw new ResponseError(404, "User not found");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new ResponseError(400, "Password wrong");
    }

    return prismaClient.user.delete({
      where: {
        id: user.id,
      },
    });
  } catch (error) {
    throw error;
  }
};

const updateService = async (user, body) => {
  try {
    body = validate(updateUserValidation, body);

    const userFound = await prismaClient.user.findUnique({
      where: {
        username: user.username,
      },
      select: {
        id: true,
        password: true,
      },
    });

    const isValidPassword = await bcrypt.compare(
      body.password,
      userFound.password
    );

    if (!isValidPassword) {
      throw new ResponseError(401, "Password wrong");
    }

    const checkUsername = await prismaClient.user.findMany({
      where: {
        username: body.username,
      },
    });

    console.log(checkUsername.length);

    if (checkUsername.length > 2) {
      throw new ResponseError(400, "Username already exists");
    }

    const data = {};

    if (body.name) {
      data.name = body.name;
    }
    if (body.username) {
      data.username = body.username;
    }
    if (body.new_password) {
      data.new_password = await bcrypt.hash(body.new_password, 10);
    }

    return prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
      select: {
        name: true,
        username: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

const updatePasswordService = async (user, body) => {
  try {
    body = validate(updatePasswordValidation, body);

    const isValidPassword = await bcrypt.compare(body.password, user.password);

    if (!isValidPassword) {
      throw new ResponseError(401, "Password wrong");
    }

    return prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: await bcrypt.hash(body.new_password, 10),
      },
      select: {
        token: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

const updateProfilePictureService = async (userId, file) => {
  if (!file) {
    throw new ResponseError(401, "No file uploaded");
  }

  const filePath = `/uploads/profile-pictures/${file.filename}`;

  const oldPicture = await prismaClient.profilePicture.findFirst({
    where: { user_id: userId },
    orderBy: { id: "desc" },
  });

  if (oldPicture) {
    const absolutePath = path.resolve(`.${oldPicture.path}`);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    await prismaClient.profilePicture.delete({
      where: { id: oldPicture.id },
    });
  }

  // Simpan file baru ke DB
  await prismaClient.profilePicture.create({
    data: {
      user_id: userId,
      path: file.filename,
    },
  });

  return filePath;
};

export {
  registerService,
  loginService,
  getCurrentUserService,
  getIdService,
  logOutService,
  deleteService,
  updateService,
  updatePasswordService,
  updateProfilePictureService,
};
