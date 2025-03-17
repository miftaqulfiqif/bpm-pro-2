import bcrypt from "bcrypt";
import { login, register } from "../validation/user-validation.js";
import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import { validate } from "../validation/validation.js";
import { v4 as uuid } from "uuid";

const registerService = async (request) => {
  try {
    const user = validate(register, request);
    let { name, username, password } = user;

    const countUser = await prismaClient.user.count({
      where: { username: username },
    });

    if (countUser > 0) {
      throw new ResponseError(400, "Username already exists");
    }

    //Hashing password
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
    const user = validate(login, request);
    let { name, username, password } = user;

    const userFound = await prismaClient.user.findUnique({
      where: {
        username: username,
      },
      select: {
        username: true,
        password: true,
      },
    });

    if (!userFound) {
      throw new ResponseError(400, "Username or password wrong");
    }

    const isValidPassword = await bcrypt.compare(password, userFound.password);

    if (!isValidPassword) {
      throw new ResponseError(401, "Username or password wrong");
    }

    const token = uuid().toString();

    return prismaClient.user.update({
      data: {
        token: token,
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

export { registerService, loginService };
