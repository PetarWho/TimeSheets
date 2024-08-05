import ProjectController from "../../adapters/controllers/projectController";
import express, { Request, Response } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import PermissionNames from "../../utils/permissionNames";
import permissionsMiddleware from "../../middlewares/permissionsMiddleware";
const router = express.Router();

router.get(
  "/",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadAllProjects)],
  async (req: Request, res: Response) => {
    await ProjectController.fetchAllProjects(req, res);
  }
);

router.post(
  "/create",
  [authMiddleware, permissionsMiddleware(PermissionNames.canWriteProject)],
  async (req: Request, res: Response) => {
    await ProjectController.createProject(req, res);
  }
);

router.get(
  "/count",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadAllProjects)],
  async (req: Request, res: Response) => {
    await ProjectController.fetchProjectsCount(req, res);
  }
);

router.get(
  "/:id",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadProject)],
  async (req: Request, res: Response) => {
    await ProjectController.fetchProjectById(req, res);
  }
);

router.put(
  "/:id",
  [authMiddleware, permissionsMiddleware(PermissionNames.canWriteProject)],
  async (req: Request, res: Response) => {
    await ProjectController.updateProject(req, res);
  }
);

router.delete(
  "/:id",
  [authMiddleware, permissionsMiddleware(PermissionNames.canDeleteProject)],
  async (req: Request, res: Response) => {
    await ProjectController.deleteProject(req, res);
  }
);

module.exports = router;
