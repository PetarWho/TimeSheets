import PermissionRoleController from "../../adapters/controllers/permissionRoleController";
import express, { Request, Response } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import PermissionNames from "../../utils/permissionNames";
import permissionsMiddleware from "../../middlewares/permissionsMiddleware";
const router = express.Router();

router.post(
  "/create",
  [
    authMiddleware,
    permissionsMiddleware(PermissionNames.canWritePermissionRole),
  ],
  async (req: Request, res: Response) => {
    await PermissionRoleController.createPermissionRole(req, res);
  }
);

router.delete(
  "/:id",
  [
    authMiddleware,
    permissionsMiddleware(PermissionNames.canDeletePermissionRole),
  ],
  async (req: Request, res: Response) => {
    await PermissionRoleController.deletePermissionRole(req, res);
  }
);

router.get(
  "/role/:role_id",
  [
    authMiddleware,
    permissionsMiddleware(PermissionNames.canReadPermissionRole),
  ],
  async (req: Request, res: Response) => {
    await PermissionRoleController.fetchPermissionRoleByRoleId(req, res);
  }
);

router.get(
  "/permission/:permission_id",
  [
    authMiddleware,
    permissionsMiddleware(PermissionNames.canReadPermissionRole),
  ],
  async (req: Request, res: Response) => {
    await PermissionRoleController.fetchPermissionRoleByPermissionId(req, res);
  }
);

module.exports = router;
