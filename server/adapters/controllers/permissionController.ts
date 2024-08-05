import permissionFetchAllUseCase from "../../usecases/permissions/permissionFetchAll";
import permissionFetchByIdUseCase from "../../usecases/permissions/permissionFetchById";
import permissionFetchByExactNameUseCase from "../../usecases/permissions/permissionFetchByName";
import { Request, Response } from "express";
import permissionFetchMultipleUseCase from "../../usecases/permissions/permissionFetchMultiple";

class PermissionController {
  static async fetchPermissionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const permission = await permissionFetchByIdUseCase(BigInt(id));
      if (!permission) {
        res.status(404).json({ error: "Permission not found" });
      } else {
        res.json(permission);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  static async fetchPermissionByExactName(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const permission = await permissionFetchByExactNameUseCase(String(name));
      if (!permission) {
        res.status(404).json({ error: "Permission not found" });
      } else {
        res.json(permission);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchMultiplePermissions(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const perms = await permissionFetchMultipleUseCase(name);
      res.json(perms);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchAllPermissions(req: Request, res: Response) {
    try {
      const permissions = await permissionFetchAllUseCase();
      res.json(permissions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default PermissionController;
