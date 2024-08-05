import workSegmentTypeCreateUseCase from "../../usecases/workSegmentType/workSegmentTypeCreate";
import workSegmentTypeUpdateUseCase from "../../usecases/workSegmentType/workSegmentTypeUpdate";
import workSegmentTypeDeleteUseCase from "../../usecases/workSegmentType/workSegmentTypeDelete";
import workSegmentTypeFetchByIdUseCase from "../../usecases/workSegmentType/workSegmentTypeFetchById";
import workSegmentTypeFetchAllUseCase from "../../usecases/workSegmentType/workSegmentTypeFetchAll";
import { Request, Response } from "express";
import BaseQueryParams from "../../ interfaces/baseQueryParams";

class WorkSegmentTypeController {
  static async createWorkSegmentType(req: Request, res: Response) {
    try {
      const workSegmentTypeData = req.body;
      const result: { message: string } =
        await workSegmentTypeCreateUseCase(workSegmentTypeData);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateWorkSegmentType(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const workSegmentTypeData = req.body;
      const result: { message: string } = await workSegmentTypeUpdateUseCase(
        BigInt(id),
        workSegmentTypeData
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteWorkSegmentType(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result: { message: string } = await workSegmentTypeDeleteUseCase(
        BigInt(id)
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchWorkSegmentTypeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const workSegmentType = await workSegmentTypeFetchByIdUseCase(BigInt(id));
      if (!workSegmentType) {
        res.status(404).json({ error: "Work segment type not found" });
      } else {
        res.json(workSegmentType);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchAllWorkSegmentTypes(req: Request, res: Response) {
    try {
      const params: BaseQueryParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 0,
        pageSize: req.query.pageSize
          ? parseInt(req.query.pageSize as string, 10)
          : 10,
        search: req.query.search as string,
      };
      const workSegmentTypes = await workSegmentTypeFetchAllUseCase(params);
      res.json(workSegmentTypes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default WorkSegmentTypeController;
