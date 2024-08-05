import express, { Request, Response } from "express";
import ClientController from "../../adapters/controllers/clientController";
import authMiddleware from "../../middlewares/authMiddleware";
import PermissionNames from "../../utils/permissionNames";
import permissionsMiddleware from "../../middlewares/permissionsMiddleware";
const router = express.Router();

router.get(
  "/",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadClient)],
  async (req: Request, res: Response) => {
    await ClientController.fetchAllClients(req, res);
  }
);

router.post(
  "/create",
  [authMiddleware, permissionsMiddleware(PermissionNames.canWriteClient)],
  async (req: Request, res: Response) => {
    await ClientController.createClient(req, res);
  }
);

router.get(
  "/:id",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadClient)],
  async (req: Request, res: Response) => {
    await ClientController.fetchClientById(req, res);
  }
);

router.put(
  "/:id",
  [authMiddleware, permissionsMiddleware(PermissionNames.canWriteClient)],
  async (req: Request, res: Response) => {
    await ClientController.updateClient(req, res);
  }
);

router.delete(
  "/:id",
  [authMiddleware, permissionsMiddleware(PermissionNames.canDeleteClient)],
  async (req: Request, res: Response) => {
    await ClientController.deleteClient(req, res);
  }
);

router.get(
  "/search/:name",
  [authMiddleware, permissionsMiddleware(PermissionNames.canReadClient)],
  async (req: Request, res: Response) => {
    await ClientController.fetchMultipleClients(req, res);
  }
);

module.exports = router;
