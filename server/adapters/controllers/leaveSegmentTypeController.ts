import { Request, Response } from "express";
import leaveSegmentTypeCreateUseCase from "../../usecases/leaveSegmentType/leaveSegmentTypeCreate";
import leaveSegmentTypeUpdateUseCase from "../../usecases/leaveSegmentType/leaveSegmentTypeUpdate";
import leaveSegmentTypeDeleteUseCase from "../../usecases/leaveSegmentType/leaveSegmentTypeDelete";
import leaveSegmentTypeFetchAllUseCase from "../../usecases/leaveSegmentType/leaveSegmentTypeFetchAll";
import leaveSegmentTypeFetchByIdUseCase from "../../usecases/leaveSegmentType/leaveSegmentTypeFetchById";
import BaseQueryParams from "../../ interfaces/baseQueryParams";

class LeaveSegmentTypeController {
  static async createLeaveSegmentType(req: Request, res: Response) {
    try {
      const leaveSegmentTypeData = req.body;
      const result: { message: string } =
        await leaveSegmentTypeCreateUseCase(leaveSegmentTypeData);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateLeaveSegmentType(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const leaveSegmentTypeData = req.body;
      const result: { message: string } = await leaveSegmentTypeUpdateUseCase(
        BigInt(id),
        leaveSegmentTypeData
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteLeaveSegmentType(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result: { message: string } = await leaveSegmentTypeDeleteUseCase(
        BigInt(id)
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchAllLeaveSegmentTypes(req: Request, res: Response) {
    try {
      const params: BaseQueryParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 0,
        pageSize: req.query.pageSize
          ? parseInt(req.query.pageSize as string, 10)
          : 10,
        search: req.query.search as string,
      };
      const leaveSegmentTypes = await leaveSegmentTypeFetchAllUseCase(params);
      res.json(leaveSegmentTypes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchLeaveSegmentTypeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const leaveSegmentType = await leaveSegmentTypeFetchByIdUseCase(
        BigInt(id)
      );
      if (!leaveSegmentType) {
        res.status(404).json({ error: "Leave segment type not found" });
      } else {
        res.json(leaveSegmentType);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
export default LeaveSegmentTypeController;
