import TeamMembershipController from "../../adapters/controllers/teamMembershipController";
import express, { Request, Response } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import permissionMiddleware from "../../middlewares/permissionsMiddleware";
import PermissionNames from "../../utils/permissionNames";
const router = express.Router();

router.get(
  "/",
  [
    authMiddleware,
    permissionMiddleware(PermissionNames.canReadAllTeamMemberships),
  ],
  async (req: Request, res: Response) => {
    await TeamMembershipController.fetchAllTeamMemberships(req, res);
  }
);

router.post(
  "/create",
  [
    authMiddleware,
    permissionMiddleware(PermissionNames.canWriteTeamMembership),
  ],
  async (req: Request, res: Response) => {
    await TeamMembershipController.createTeamMembership(req, res);
  }
);

router.get(
  "/team/:team_id",
  [
    authMiddleware,
    permissionMiddleware(PermissionNames.canReadAllTeamMemberships),
  ],
  async (req: Request, res: Response) => {
    await TeamMembershipController.fetchTeamMembershipByTeamId(req, res);
  }
);

router.get(
  "/user/:user_id",
  [authMiddleware, permissionMiddleware(PermissionNames.canReadTeamMembership)],
  async (req: Request, res: Response) => {
    await TeamMembershipController.fetchTeamMembershipByUserId(req, res);
  }
);

router.get(
  "/:id",
  [authMiddleware, permissionMiddleware(PermissionNames.canReadTeamMembership)],
  async (req: Request, res: Response) => {
    await TeamMembershipController.fetchTeamMembershipById(req, res);
  }
);

router.put(
  "/:id",
  [
    authMiddleware,
    permissionMiddleware(PermissionNames.canWriteTeamMembership),
  ],
  async (req: Request, res: Response) => {
    await TeamMembershipController.updateTeamMembership(req, res);
  }
);

router.delete(
  "/:id",
  [
    authMiddleware,
    permissionMiddleware(PermissionNames.canDeleteTeamMembership),
  ],
  async (req: Request, res: Response) => {
    await TeamMembershipController.deleteTeamMembership(req, res);
  }
);

module.exports = router;
