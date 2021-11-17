import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/ErrorResponse.js";

const authenticate = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
      if (error) {
        res.status(401).send({ messagge: "Token no válido" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ messagge: "Por favor inicie sesión" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role == "admin") {
    next();
  } else {
    const error = new ErrorResponse("Acceso reservado al administrador", 403);
    next(error);
  }
};

export { authenticate, adminOnly };
