import { fetchTeamMembershipById } from "../../adapters/repositories/teamMembershipRepository";
import TeamMembership from "../../entity/teamMembership";

async function teamMembershipFetchByIdUseCase(
  teamMembershipId: bigint
): Promise<TeamMembership | null> {
  const teamMembershipData = await fetchTeamMembershipById(teamMembershipId);

  if (!teamMembershipData) {
    console.log(`No team membership found with ID: ${teamMembershipId}`);
    return null;
  }

  const team = new TeamMembership(
    teamMembershipData.id,
    teamMembershipData.team_id,
    teamMembershipData.user_id
  );
  return team;
}

export default teamMembershipFetchByIdUseCase;
