import express, { Request, Response } from "express";
import LeaveSegmentController from "../../adapters/controllers/leaveSegmentController";
import authMiddleware from "../../middlewares/authMiddleware";
import PermissionNames from "../../utils/permissionNames";
import permissionsMiddleware from "../../middlewares/permissionsMiddleware";
const router = express.Router();

router.get(
  "/",
  [
    authMiddleware,
    permissionsMiddleware(PermissionNames.canReadAllLeaveSegments),
  ],
  async (req: Request, res: Response) => {
    await LeaveSegmentController.fetchAllLeaveSegments(req, res);
  }
);

router.post(
  "/create",
  [authMiddleware, permissionsMiddleware(PermissionNames.canWriteLeaveSegment)],
  async (req: Request, res: Response) => {
    await LeaveSegmentController.createLeaveSegment(req, res);
  }
);

router.get(
  "/count",
  [
    authMiddleware,
    permissionsMiddleware(PermissionNames.canReadAllLeaveSegments),
  ],
  async (req: Request, res: Response) => {
    await LeaveSegmentController.fetchLeaveSegmentsCount(req, res);
  }
);

router.put(
  "/:id",
  [authMiddleware, permissionsMiddleware(PermissionNames.canWriteLeaveSegment)],
  async (req: Request, res: Response) => {
    await LeaveSegmentController.updateLeaveSegment(req, res);
  }
);

router.delete(
  "/:id",
  [
    authMiddleware,
    permissionsMiddleware(PermissionNames.canDeleteLeaveSegment),
  ],
  async (req: Request, res: Response) => {
    await LeaveSegmentController.deleteLeaveSegment(req, res);
  }
);

router.get(
  "/:id",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadLeaveSegment)],
  async (req: Request, res: Response) => {
    await LeaveSegmentController.fetchLeaveSegmentById(req, res);
  }
);

router.get(
  "/user/:userId",
  [
    authMiddleware,
    permissionsMiddleware(PermissionNames.canReadAllLeaveSegments),
  ],
  async (req: Request, res: Response) => {
    await LeaveSegmentController.fetchLeaveSegmentsByUserId(req, res);
  }
);

module.exports = router;
