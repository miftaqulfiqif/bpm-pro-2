import { ResponseError } from "../errors/response-error.js";

const errorMiddleware = async (err, req, res, next) => {
  try {
    if (!err) {
      console.error("Non-error object passed:", err);
      return res
        .status(500)
        .json({
          errors: "Unknown error occurred",
        })
        .end();
    }

    if (err instanceof ResponseError) {
      return res.status(err.status).json({ errors: err.message }).end();
    } else {
      return res
        .status(500)
        .json({
          errors: "Internal Server Error",
          message: err.message,
        })
        .end();
    }
  } catch (e) {
    console.error("Error in error middleware:", e);
    return res
      .status(500)
      .json({
        errors: "Internal Server Error",
      })
      .end();
  }
};

export { errorMiddleware };
