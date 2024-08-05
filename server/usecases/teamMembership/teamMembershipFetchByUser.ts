import { fetchTeamMembershipByUserId } from "../../adapters/repositories/teamMembershipRepository";
import TeamMembership from "../../entity/teamMembership";

async function teamMembershipFetchByUserIdUseCase(
  user_id: bigint
): Promise<TeamMembership[]> {
  const allTeamMemberships: TeamMembership[] =
    await fetchTeamMembershipByUserId(user_id);
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

export default teamMembershipFetchByUserIdUseCase;
