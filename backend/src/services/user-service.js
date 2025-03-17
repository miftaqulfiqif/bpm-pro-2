import bcrypt from "bcrypt";
import { login, register } from "../validation/user-validation.js";
import { PrismaClient } from "@prisma/client";
import { ResponseError } from "../errors/response-error.js";
import { validate } from "../validation/validate.js";
import { v4 as uuid } from "uuid";
