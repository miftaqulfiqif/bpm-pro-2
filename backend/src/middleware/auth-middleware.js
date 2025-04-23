import { prismaClient } from "../applications/database.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  console.log("TOKEN : ", token);

  if (!token) {
    res.status(401).json({ errors: "Unauthorized" }).end();
  }

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        token,
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

    if (!user) {
      res.status(401).json({ errors: "Unauthorized" }).end();
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ errors: "Unauthorized" }).end();
  }
};
