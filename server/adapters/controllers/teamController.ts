import { Request, Response } from "express";
import teamCreateUseCase from "../../usecases/teams/teamCreate";
import teamUpdateUseCase from "../../usecases/teams/teamUpdate";
import teamDeleteUseCase from "../../usecases/teams/teamDelete";
import teamFetchAllUseCase from "../../usecases/teams/teamFetchAll";
import teamFetchByIdUseCase from "../../usecases/teams/teamFetchById";
import teamFetchCountUseCase from "../../usecases/teams/teamFetchCount";
import BaseQueryParams from "../../ interfaces/baseQueryParams";
import CalendarQueryParams from "../../ interfaces/calendarQueryParams";
class TeamController {
  static async createTeam(req: Request, res: Response) {
    try {
      const teamData = req.body;
      const result: { message: string } = await teamCreateUseCase(teamData);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateTeam(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const teamData = req.body;
      const result: { message: string } = await teamUpdateUseCase(
        BigInt(id),
        teamData
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteTeam(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await teamDeleteUseCase(BigInt(id));
      res.json({ message: "Successfully deleted Team" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchTeamById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const team = await teamFetchByIdUseCase(BigInt(id));
      if (!team) {
        res.status(404).json({ error: "Team not found" });
      } else {
        res.json(team);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchAllTeams(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Token not found!");
      }

      const params: BaseQueryParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        pageSize: req.query.pageSize
          ? parseInt(req.query.pageSize as string, 10)
          : 10,
        search: req.query.search as string,
      };
      const teams = await teamFetchAllUseCase(token, params);
      res.json(teams);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  static async fetchTeamsCount(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new Error("Token not found!");
      }

      const params: CalendarQueryParams = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const count: number = await teamFetchCountUseCase(token, params);
      res.json(count);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default TeamController;
