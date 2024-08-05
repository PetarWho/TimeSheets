import projectCreateUseCase from "../../usecases/projects/projectCreate";
import projectUpdateUseCase from "../../usecases/projects/projectUpdate";
import projectDeleteUseCase from "../../usecases/projects/projectDelete";
import projectFetchAllUseCase from "../../usecases/projects/projectFetchAll";
import projectFetchByIdUseCase from "../../usecases/projects/projectFetchById";
import projectFetchCountUseCase from "../../usecases/projects/projectFetchCount";
import { Request, Response } from "express";
import BaseQueryParams from "../../ interfaces/baseQueryParams";
import CalendarQueryParams from "../../ interfaces/calendarQueryParams";

class ProjectController {
  static async createProject(req: Request, res: Response) {
    try {
      const projectData = req.body;
      const result: { message: string } =
        await projectCreateUseCase(projectData);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const projectData = req.body;
      const result: { message: string } = await projectUpdateUseCase(
        BigInt(id),
        projectData
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await projectDeleteUseCase(BigInt(id));
      res.json({ message: "Successfully deleted project" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchProjectById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project = await projectFetchByIdUseCase(BigInt(id));
      if (!project) {
        res.status(404).json({ error: "Project not found" });
      } else {
        res.json(project);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchAllProjects(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const params: BaseQueryParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        pageSize: req.query.pageSize
          ? parseInt(req.query.pageSize as string, 10)
          : 10,
        search: req.query.search as string,
      };
      const projects = await projectFetchAllUseCase(token as string, params);
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchProjectsCount(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new Error("Token not found!");
      }

      const params: CalendarQueryParams = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const count: number = await projectFetchCountUseCase(token, params);
      res.json(count);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ProjectController;
