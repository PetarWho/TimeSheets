import express, { Request, Response } from "express";
import LeaveSegmentTypeController from "../../adapters/controllers/leaveSegmentTypeController";
import authMiddleware from "../../middlewares/authMiddleware";
import PermissionNames from "../../utils/permissionNames";
import permissionsMiddleware from "../../middlewares/permissionsMiddleware";
const router = express.Router();

router.get(
  "/",
  [
    authMiddleware,
    permissionsMiddleware(PermissionNames.canReadAllLeaveSegmentTypes),
  ],
  async (req: Request, res: Response) => {
    await LeaveSegmentTypeController.fetchAllLeaveSegmentTypes(req, res);
  }
);

router.post(
  "/create",
  [
    authMiddleware,
    permissionsMiddleware(PermissionNames.canWriteLeaveSegmentType),
  ],
  async (req: Request, res: Response) => {
    await LeaveSegmentTypeController.createLeaveSegmentType(req, res);
  }
);

router.put(
  "/:id",
  [
    authMiddleware,
    permissionsMiddleware(PermissionNames.canWriteLeaveSegmentType),
  ],
  async (req: Request, res: Response) => {
    await LeaveSegmentTypeController.updateLeaveSegmentType(req, res);
  }
);

router.delete(
  "/:id",
  [
    authMiddleware,
    permissionsMiddleware(PermissionNames.canDeleteLeaveSegmentType),
  ],
  async (req: Request, res: Response) => {
    await LeaveSegmentTypeController.deleteLeaveSegmentType(req, res);
  }
);

router.get(
  "/:id",
  [
    authMiddleware,
    permissionsMiddleware(PermissionNames.canReadLeaveSegmentType),
  ],
  async (req: Request, res: Response) => {
    await LeaveSegmentTypeController.fetchLeaveSegmentTypeById(req, res);
  }
);

module.exports = router;
