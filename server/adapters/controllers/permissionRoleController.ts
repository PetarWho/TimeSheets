import permissionRoleAddUseCase from "../../usecases/permissionRole/permissionRoleCreate";
import permissionRoleRemoveUseCase from "../../usecases/permissionRole/permissionRoleDelete";
import permissionRoleFetchByPermissionIdUseCase from "../../usecases/permissionRole/permissionRoleFetchByPermission";
import permissionRoleFetchByRoleIdUseCase from "../../usecases/permissionRole/permissionRoleFetchByRole";
import { Request, Response } from "express";
import PermissionRole from "../../entity/permissionRole";

class PermissionRoleController {
  static async createPermissionRole(req: Request, res: Response) {
    try {
      const permissionRoleData = req.body;
      const result: { message: string } =
        await permissionRoleAddUseCase(permissionRoleData);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deletePermissionRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result: { message: string } = await permissionRoleRemoveUseCase(
        BigInt(id)
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchPermissionRoleByRoleId(req: Request, res: Response) {
    try {
      const { role_id } = req.params;
      const permissionRole: PermissionRole[] =
        await permissionRoleFetchByRoleIdUseCase(BigInt(role_id));
      if (!permissionRole.length) {
        res
          .status(404)
          .json({ error: "Permissions not found for this role id" });
      } else {
        res.json(permissionRole);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchPermissionRoleByPermissionId(req: Request, res: Response) {
    try {
      const { permission_id } = req.params;
      const permissionRole: PermissionRole[] =
        await permissionRoleFetchByPermissionIdUseCase(BigInt(permission_id));
      if (!permissionRole.length) {
        res
          .status(404)
          .json({ error: "Couldn't find permissions with id:${id}" });
      } else {
        res.json(permissionRole);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default PermissionRoleController;
