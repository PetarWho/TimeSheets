import CreateWorkSegmentUseCase from "../../usecases/workSegment/workSegmentCreate";
import UpdateWorkSegmentUseCase from "../../usecases/workSegment/workSegmentUpdate";
import DeleteWorkSegmentUseCase from "../../usecases/workSegment/workSegmentDelete";
import FetchWorkSegmentByIdUseCase from "../../usecases/workSegment/workSegmentFetchById";
import FetchWorkSegmentsByUserIdUseCase from "../../usecases/workSegment/workSegmentFetchByUserId";
import FetchAllWorkSegmentsUseCase from "../../usecases/workSegment/workSegmentFetchAll";
import FetchWorkSegmentsCount from "../../usecases/workSegment/workSegmentFetchCount";
import { Request, Response } from "express";
import CalendarQueryParams from "../../ interfaces/calendarQueryParams";
import WorkSegmentQueryParams from "../../ interfaces/workSegmentQueryParams";

class WorkSegmentController {
  static async createWorkSegment(req: Request, res: Response) {
    try {
      const workSegmentData = req.body;
      const result: { message: string } =
        await CreateWorkSegmentUseCase(workSegmentData);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateWorkSegment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const workSegmentData = req.body;
      const result: { message: string } = await UpdateWorkSegmentUseCase(
        BigInt(id),
        workSegmentData
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteWorkSegment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result: { message: string } = await DeleteWorkSegmentUseCase(
        BigInt(id)
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchWorkSegmentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const workSegment = await FetchWorkSegmentByIdUseCase(BigInt(id));
      if (!workSegment) {
        res.status(404).json({ error: "Work segment not found" });
      } else {
        res.json(workSegment);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchWorkSegmentsByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const params: WorkSegmentQueryParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        pageSize: req.query.pageSize
          ? parseInt(req.query.pageSize as string, 10)
          : 5,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        typeId: req.query.typeId
          ? parseInt(req.query.typeId as string, 10)
          : undefined,
      };

      const workSegments = await FetchWorkSegmentsByUserIdUseCase(
        BigInt(userId),
        params
      );
      res.json(workSegments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchAllWorkSegments(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Token not found!");
      }

      const params: WorkSegmentQueryParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        pageSize: req.query.pageSize
          ? parseInt(req.query.pageSize as string, 10)
          : 5,
        typeId: req.query.typeId
          ? parseInt(req.query.typeId as string, 10)
          : undefined,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const workSegments = await FetchAllWorkSegmentsUseCase(token, params);
      res.json(workSegments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchWorkSegmentsCount(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new Error("Token not found!");
      }

      const params: WorkSegmentQueryParams = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        typeId: req.query.typeId
          ? parseInt(req.query.typeId as string, 10)
          : undefined,
      };
      const count: number = await FetchWorkSegmentsCount(token, params);
      res.json(count);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default WorkSegmentController;
