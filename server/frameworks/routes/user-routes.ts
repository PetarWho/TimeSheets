import express from "express";
import UserController from "../../adapters/controllers/userController";
import { Request, Response, Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import permissionMiddleware from "../../middlewares/permissionsMiddleware";
import PermissionNames from "../../utils/permissionNames";

const router: Router = express.Router();

router.get(
  "/",
  [authMiddleware, permissionMiddleware(PermissionNames.canReadAllUsers)],
  async (req: Request, res: Response) => {
    await UserController.fetchAllUsers(req, res);
  }
);

router.get(
  "/non-team-members/:teamId",
  [authMiddleware, permissionMiddleware(PermissionNames.canReadAllUsers)],
  async (req: Request, res: Response) => {
    await UserController.fetchUsersThatAreNotMembersOfSpecificTeam(req, res);
  }
);

router.post("/login", async (req: Request, res: Response) => {
  await UserController.signIn(req, res);
});

router.post("/register", async (req: Request, res: Response) => {
  await UserController.signUp(req, res);
});

router.post("/logout", authMiddleware, async (req: Request, res: Response) => {
  await UserController.signOut(req, res);
});

router.put(
  "/set_role",
  [authMiddleware, permissionMiddleware(PermissionNames.canSetRole)],
  async (req: Request, res: Response) => {
    await UserController.setUserRole(req, res);
  }
);

router.get(
  "/count",
  [authMiddleware, permissionMiddleware(PermissionNames.canReadAllUsers)],
  async (req: Request, res: Response) => {
    await UserController.fetchUsersCount(req, res);
  }
);

router.get(
  "/:id",
  [authMiddleware, permissionMiddleware(PermissionNames.canReadUser)],
  async (req: Request, res: Response) => {
    await UserController.fetchUserById(req, res);
  }
);

router.put(
  "/:id",
  [authMiddleware, permissionMiddleware(PermissionNames.canWriteUser)],
  async (req: Request, res: Response) => {
    await UserController.updateUser(req, res);
  }
);

router.delete(
  "/:id",
  [authMiddleware, permissionMiddleware(PermissionNames.canDeleteUser)],
  async (req: Request, res: Response) => {
    await UserController.deleteUser(req, res);
  }
);

router.put(
  "/deactivate/:id",
  [authMiddleware, permissionMiddleware(PermissionNames.canDeactivateUser)],
  async (req: Request, res: Response) => {
    await UserController.deactivateUser(req, res);
  }
);

router.post("/auth/google", async (req: Request, res: Response) => {
  await UserController.googleLoginUser(req, res);
});

module.exports = router;
