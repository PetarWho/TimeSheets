import CreateTeamMembershipUseCase from "../../usecases/teamMembership/teamMembershipCreate";
import UpdateTeamMembershipUseCase from "../../usecases/teamMembership/teamMembershipUpdate";
import DeleteTeamMembershipUseCase from "../../usecases/teamMembership/teamMembershipDelete";
import FetchTeamMembershipByUserIdUseCase from "../../usecases/teamMembership/teamMembershipFetchByUser";
import FetchTeamMembershipByTeamIdUseCase from "../../usecases/teamMembership/teamMembershipFetchByTeam";
import FetchTeamMembershipByIdUseCase from "../../usecases/teamMembership/teamMembershipFetchById";
import FetchAllTeamMembershipsUseCase from "../../usecases/teamMembership/teamMembershipFetchAll";
import { Request, Response } from "express";
import TeamMembership from "../../entity/teamMembership";

class TeamMembershipController {
  static async createTeamMembership(req: Request, res: Response) {
    try {
      const teamMembershipData = req.body;
      const result: { message: string } =
        await CreateTeamMembershipUseCase(teamMembershipData);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateTeamMembership(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const teamMembershipData = req.body;
      const result: { message: string } = await UpdateTeamMembershipUseCase(
        BigInt(id),
        teamMembershipData
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteTeamMembership(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result: { message: string } = await DeleteTeamMembershipUseCase(
        BigInt(id)
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchTeamMembershipByUserId(req: Request, res: Response) {
    try {
      const { user_id } = req.params;
      const teamMembership: TeamMembership[] =
        await FetchTeamMembershipByUserIdUseCase(BigInt(user_id));
      if (!teamMembership.length) {
        res
          .status(404)
          .json({ error: "User is not part of any team or does not exist" });
      } else {
        res.json(teamMembership);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchTeamMembershipByTeamId(req: Request, res: Response) {
    try {
      const { team_id } = req.params;
      const teamMembership: TeamMembership[] =
        await FetchTeamMembershipByTeamIdUseCase(BigInt(team_id));
      if (!teamMembership.length) {
        res.status(404).json({
          error: "Team does not have any assigned users or does not exist",
        });
      } else {
        res.json(teamMembership);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchTeamMembershipById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const teamMembership = await FetchTeamMembershipByIdUseCase(BigInt(id));
      if (!teamMembership) {
        res.status(404).json({
          error: "Such Team Membership does not exist",
        });
      } else {
        res.json(teamMembership);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async fetchAllTeamMemberships(req: Request, res: Response) {
    try {
      const teamMemberships = await FetchAllTeamMembershipsUseCase();
      res.json(teamMemberships);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default TeamMembershipController;
