import { fetchTeamMembershipByTeamId } from "../../adapters/repositories/teamMembershipRepository";
import TeamMembership from "../../entity/teamMembership";

async function teamMembershipFetchByTeamIdUseCase(
  team_id: bigint
): Promise<TeamMembership[]> {
  const allTeamMemberships: TeamMembership[] =
    await fetchTeamMembershipByTeamId(team_id);
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

export default teamMembershipFetchByTeamIdUseCase;
