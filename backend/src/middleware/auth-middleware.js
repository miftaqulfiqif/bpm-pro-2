import { prismaClient } from "../applications/database.js";
import { logger } from "../applications/logging.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  logger.info(token);
  if (!token) {
    res.status(401).json({ errors: "Unauthorized" }).end();
  } else {
    const user = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
    });

    if (!user) {
      res.status(401).json({ errors: "Unauthorized" }).end();
    } else {
      req.user = user;
      next();
    }
  }
};
