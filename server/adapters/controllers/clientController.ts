import clientCreateUseCase from "../../usecases/clients/clientCreate";
import clientUpdateUseCase from "../../usecases/clients/clientUpdate";
import clientDeleteUseCase from "../../usecases/clients/clientDelete";
import clientFetchAllUseCase from "../../usecases/clients/clientFetchAll";
import clientFetchMultipleUseCase from "../../usecases/clients/clientFetchMultiple";
import clientFetchByIdUseCase from "../../usecases/clients/clientFetchById";
import { Request, Response } from "express";
import BaseQueryParams from "../../ interfaces/baseQueryParams";

class ClientController {
  static async createClient(req: Request, res: Response) {
    try {
      const clientData = req.body;
      const result: { message: string } = await clientCreateUseCase(clientData);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateClient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const clientData = req.body;
      const result: { message: string } = await clientUpdateUseCase(
        BigInt(id),
        clientData
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteClient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result: { message: string } = await clientDeleteUseCase(BigInt(id));
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchMultipleClients(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const clients = await clientFetchMultipleUseCase(name);
      res.json(clients);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchClientById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const client = await clientFetchByIdUseCase(BigInt(id));
      if (!client) {
        res.status(404).json({ error: "Client not found" });
      } else {
        res.json(client);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchAllClients(req: Request, res: Response) {
    try {
      const params: BaseQueryParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        pageSize: req.query.pageSize
          ? parseInt(req.query.pageSize as string, 10)
          : 5,
        search: req.query.search as string,
      };

      const clients = await clientFetchAllUseCase(params);
      res.json(clients);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ClientController;
