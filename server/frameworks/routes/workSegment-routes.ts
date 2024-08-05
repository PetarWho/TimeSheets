import express, { Request, Response } from "express";
import WorkSegmentController from "../../adapters/controllers/workSegmentController";
import authMiddleware from "../../middlewares/authMiddleware";
import PermissionNames from "../../utils/permissionNames";
import permissionsMiddleware from "../../middlewares/permissionsMiddleware";
const router = express.Router();

router.get(
  "/",
  [
    authMiddleware,
    permissionsMiddleware(PermissionNames.canReadAllWorkSegments),
  ],
  async (req: Request, res: Response) => {
    await WorkSegmentController.fetchAllWorkSegments(req, res);
  }
);

router.post(
  "/create",
  [authMiddleware, permissionsMiddleware(PermissionNames.canWriteWorkSegment)],
  async (req: Request, res: Response) => {
    await WorkSegmentController.createWorkSegment(req, res);
  }
);

router.get(
  "/count",
  [
    authMiddleware,
    permissionsMiddleware(PermissionNames.canReadAllWorkSegments),
  ],
  async (req: Request, res: Response) => {
    await WorkSegmentController.fetchWorkSegmentsCount(req, res);
  }
);

router.get(
  "/:id",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadWorkSegment)],
  async (req: Request, res: Response) => {
    await WorkSegmentController.fetchWorkSegmentById(req, res);
  }
);

router.get(
  "/user/:userId",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadWorkSegment)],
  async (req: Request, res: Response) => {
    await WorkSegmentController.fetchWorkSegmentsByUserId(req, res);
  }
);

router.put(
  "/:id",
  [authMiddleware, permissionsMiddleware(PermissionNames.canWriteWorkSegment)],
  async (req: Request, res: Response) => {
    await WorkSegmentController.updateWorkSegment(req, res);
  }
);

router.delete(
  "/:id",
  [authMiddleware, permissionsMiddleware(PermissionNames.canDeleteWorkSegment)],
  async (req: Request, res: Response) => {
    await WorkSegmentController.deleteWorkSegment(req, res);
  }
);

module.exports = router;
