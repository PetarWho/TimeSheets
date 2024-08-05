import roleFetchAllUseCase from "../../usecases/roles/roleFetchAll";
import roleFetchByIdUseCase from "../../usecases/roles/roleFetchById";
import roleFetchByNameUseCase from "../../usecases/roles/roleFetchByName";
import { Request, Response } from "express";

class RoleController {
  static async fetchAllRoles(req: Request, res: Response) {
    try {
      const roles = await roleFetchAllUseCase();
      res.json(roles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchRoleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const role = await roleFetchByIdUseCase(BigInt(id));
      if (!role) {
        res.status(404).json({ error: "Role not found" });
      } else {
        res.json(role);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchRoleByName(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const role = await roleFetchByNameUseCase(String(name));
      if (!role) {
        res.status(404).json({ error: "Role not found" });
      } else {
        res.json(role);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default RoleController;
