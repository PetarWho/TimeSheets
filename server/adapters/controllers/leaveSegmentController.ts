import CreateLeaveSegmentUseCase from "../../usecases/leaveSegment/leaveSegmentCreate";
import UpdateLeaveSegmentUseCase from "../../usecases/leaveSegment/leaveSegmentUpdate";
import DeleteLeaveSegmentUseCase from "../../usecases/leaveSegment/leaveSegmentDelete";
import FetchAllLeaveSegmentsUseCase from "../../usecases/leaveSegment/leaveSegmentFetchAll";
import FetchLeaveSegmentById from "../../usecases/leaveSegment/leaveSegmentFetchById";
import FetchLeaveSegmentByUserId from "../../usecases/leaveSegment/leaveSegmentFetchByUserId";
import FetchLeaveSegmentsCount from "../../usecases/leaveSegment/leaveSegmentsFetchCount";
import { Request, Response } from "express";
import LeaveSegmentQueryParams from "../../ interfaces/leaveSegmentQueryParams";
import { LeaveSegmentStatus } from "../../enums/leaveSegmentTypeStatus.enum";

class LeaveSegmentController {
  static async createLeaveSegment(req: Request, res: Response) {
    try {
      const leaveSegmentData = req.body;
      const result: { message: string } =
        await CreateLeaveSegmentUseCase(leaveSegmentData);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateLeaveSegment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const leaveSegmentData = req.body;
      const result: { message: string } = await UpdateLeaveSegmentUseCase(
        BigInt(id),
        leaveSegmentData
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteLeaveSegment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result: { message: string } = await DeleteLeaveSegmentUseCase(
        BigInt(id)
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchAllLeaveSegments(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Token not found!");
      }

      const params: LeaveSegmentQueryParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 0,
        pageSize: req.query.pageSize
          ? parseInt(req.query.pageSize as string, 10)
          : 10,
        typeId: req.query.typeId
          ? parseInt(req.query.typeId as string, 10)
          : undefined,
        status: req.query.status as LeaveSegmentStatus,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const leaveSegments = await FetchAllLeaveSegmentsUseCase(token, params);
      res.json(leaveSegments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchLeaveSegmentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const leaveSegments = await FetchLeaveSegmentById(BigInt(id));
      if (!leaveSegments) {
        res.status(404).json({ error: "Leave Segment not found" });
      } else {
        res.json(leaveSegments);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchLeaveSegmentsByUserId(req: Request, res: Response) {
    try {
      const params: LeaveSegmentQueryParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        pageSize: req.query.pageSize
          ? parseInt(req.query.pageSize as string, 10)
          : 5,
        status: req.query.status as LeaveSegmentStatus,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        typeId: req.query.typeId
          ? parseInt(req.query.typeId as string, 10)
          : undefined,
      };

      const { userId } = req.params;
      const leaveSegments = await FetchLeaveSegmentByUserId(
        BigInt(userId),
        params
      );
      res.json(leaveSegments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchLeaveSegmentsCount(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new Error("Token not found!");
      }

      const params: LeaveSegmentQueryParams = {
        status: req.query.status as LeaveSegmentStatus,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        typeId: req.query.typeId
          ? parseInt(req.query.typeId as string, 10)
          : undefined,
      };
      const count: number = await FetchLeaveSegmentsCount(token, params);
      res.json(count);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
export default LeaveSegmentController;
