import express, { Request, Response } from "express";
import WorkSegmentTypeController from "../../adapters/controllers/workSegmentTypeController";
import authMiddleware from "../../middlewares/authMiddleware";
import permissionMiddleware from "../../middlewares/permissionsMiddleware";
import PermissionNames from "../../utils/permissionNames";
const router = express.Router();

router.get(
  "/",
  [
    authMiddleware,
    permissionMiddleware(PermissionNames.canReadAllWorkSegmentTypes),
  ],
  async (req: Request, res: Response) => {
    await WorkSegmentTypeController.fetchAllWorkSegmentTypes(req, res);
  }
);

router.post(
  "/create",
  [authMiddleware, permissionMiddleware(PermissionNames.canWriteClient)],
  async (req: Request, res: Response) => {
    await WorkSegmentTypeController.createWorkSegmentType(req, res);
  }
);

router.get(
  "/:id",
  [
    authMiddleware,
    permissionMiddleware(PermissionNames.canReadWorkSegmentType),
  ],
  async (req: Request, res: Response) => {
    await WorkSegmentTypeController.fetchWorkSegmentTypeById(req, res);
  }
);

router.put(
  "/:id",
  [
    authMiddleware,
    permissionMiddleware(PermissionNames.canWriteWorkSegmentType),
  ],
  async (req: Request, res: Response) => {
    await WorkSegmentTypeController.updateWorkSegmentType(req, res);
  }
);

router.delete(
  "/:id",
  [
    authMiddleware,
    permissionMiddleware(PermissionNames.canDeleteWorkSegmentType),
  ],
  async (req: Request, res: Response) => {
    await WorkSegmentTypeController.deleteWorkSegmentType(req, res);
  }
);

module.exports = router;
