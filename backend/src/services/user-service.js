import bcrypt from "bcrypt";
import {
  getUserValidation,
  loginValidation,
  registerValidation,
  deleteUserValidation,
} from "../validation/user-validation.js";
import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import { validate } from "../validation/validation.js";
import { v4 as uuid } from "uuid";

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
      throw new ResponseError(400, "Username or password wrong");
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
        name: true,
        username: true,
      },
    });
  } catch (e) {
    throw e;
  }
};

const getCurrentUserService = async (username) => {
  try {
    username = validate(getUserValidation, username);

    const userFound = prismaClient.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
        name: true,
        username: true,
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
    return prismaClient.user.update({
      data: {
        token: null,
      },
      where: {
        username: username,
      },
      select: {
        token: true,
      },
    });
  } catch (e) {
    throw e;
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

export {
  registerService,
  loginService,
  getCurrentUserService,
  getIdService,
  logOutService,
  deleteService,
};
