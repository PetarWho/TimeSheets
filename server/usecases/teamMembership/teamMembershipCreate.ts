import { createTeamMembership } from "../../adapters/repositories/teamMembershipRepository";
import TeamMembership from "../../entity/teamMembership";

async function teamMembershipCreateUseCase(
  teamMembershipData: TeamMembership
): Promise<{ message: string }> {
  return await createTeamMembership(teamMembershipData);
}

export default teamMembershipCreateUseCase;
