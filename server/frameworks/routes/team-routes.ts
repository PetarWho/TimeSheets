import TeamController from "../../adapters/controllers/teamController";
import express, { Request, Response } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import PermissionNames from "../../utils/permissionNames";
import permissionsMiddleware from "../../middlewares/permissionsMiddleware";
const router = express.Router();

router.get(
  "/",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadAllTeams)],
  async (req: Request, res: Response) => {
    await TeamController.fetchAllTeams(req, res);
  }
);

router.post(
  "/create",
  [authMiddleware, permissionsMiddleware(PermissionNames.canWriteTeam)],
  async (req: Request, res: Response) => {
    await TeamController.createTeam(req, res);
  }
);

router.get(
  "/count",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadAllTeams)],
  async (req: Request, res: Response) => {
    await TeamController.fetchTeamsCount(req, res);
  }
);

router.get(
  "/:id",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadTeam)],
  async (req: Request, res: Response) => {
    await TeamController.fetchTeamById(req, res);
  }
);

router.put(
  "/:id",
  [authMiddleware, permissionsMiddleware(PermissionNames.canWriteTeam)],
  async (req: Request, res: Response) => {
    await TeamController.updateTeam(req, res);
  }
);

router.delete(
  "/:id",
  [authMiddleware, permissionsMiddleware(PermissionNames.canDeleteTeam)],
  async (req: Request, res: Response) => {
    await TeamController.deleteTeam(req, res);
  }
);

module.exports = router;
