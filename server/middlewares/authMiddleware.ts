import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import JWToken from "../entity/token";
import { findToken } from "../adapters/repositories/authRepository";
import moment from "moment";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("Authorization token not found");

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");

    const tokenInDb: JWToken = await findToken(token);

    if (
      !tokenInDb ||
      tokenInDb.user_id !== decoded.id ||
      tokenInDb.expiry_date <= moment(new Date()).valueOf()
    ) {
      throw new Error("Invalid or expired token");
    }
    next();
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}

export default authMiddleware;
