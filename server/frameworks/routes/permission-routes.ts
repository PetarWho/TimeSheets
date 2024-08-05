import express, { Request, Response } from "express";
import PermissionController from "../../adapters/controllers/permissionController";
import authMiddleware from "../../middlewares/authMiddleware";
import PermissionNames from "../../utils/permissionNames";
import permissionsMiddleware from "../../middlewares/permissionsMiddleware";
const router = express.Router();

router.get(
  "/",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadPermission)],
  async (req: Request, res: Response) => {
    await PermissionController.fetchAllPermissions(req, res);
  }
);

router.get(
  "/:id",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadPermission)],
  async (req: Request, res: Response) => {
    await PermissionController.fetchPermissionById(req, res);
  }
);

router.get(
  "/exact/:name",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadPermission)],
  async (req: Request, res: Response) => {
    await PermissionController.fetchPermissionByExactName(req, res);
  }
);

router.get(
  "/search/:name",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadPermission)],
  async (req: Request, res: Response) => {
    await PermissionController.fetchMultiplePermissions(req, res);
  }
);

module.exports = router;
