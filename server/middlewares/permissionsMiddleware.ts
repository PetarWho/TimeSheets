import { NextFunction, Request, Response } from "express";
import reusableCheckPermissionForRole from "../utils/reusableFunctions";
import { fetchPermissionByExactName } from "../adapters/repositories/permissionRepository";

const permissionMiddleware = (...permNames: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const permissions = await Promise.all(
        permNames.map(fetchPermissionByExactName)
      );

      for (const perm of permissions) {
        await reusableCheckPermissionForRole(req, res, perm);
      }

      next();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
};
export default permissionMiddleware;
