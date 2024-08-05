import RoleController from "../../adapters/controllers/roleController";
import express, { Request, Response } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import PermissionNames from "../../utils/permissionNames";
import permissionsMiddleware from "../../middlewares/permissionsMiddleware";
const router = express.Router();

router.get(
  "/",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadRole)],
  async (req: Request, res: Response) => {
    await RoleController.fetchAllRoles(req, res);
  }
);

router.get(
  "/:id",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadRole)],
  async (req: Request, res: Response) => {
    await RoleController.fetchRoleById(req, res);
  }
);

router.get(
  "/name/:name",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadRole)],
  async (req: Request, res: Response) => {
    await RoleController.fetchRoleByName(req, res);
  }
);

module.exports = router;
