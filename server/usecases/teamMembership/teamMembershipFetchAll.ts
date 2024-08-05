import { fetchAllTeamMemberships } from "../../adapters/repositories/teamMembershipRepository";
import TeamMembership from "../../entity/teamMembership";

async function teamMembershipFetchAllUseCase(): Promise<TeamMembership[]> {
  const allTeamMemberships: TeamMembership[] = await fetchAllTeamMemberships();
  const teamMemberships = allTeamMemberships.map(
    (teamMembershipData) =>
      new TeamMembership(
        teamMembershipData.id,
        teamMembershipData.team_id,
        teamMembershipData.user_id
      )
  );
  return teamMemberships;
}

export default teamMembershipFetchAllUseCase;
