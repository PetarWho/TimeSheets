import { updateTeamMembership } from "../../adapters/repositories/teamMembershipRepository";
import TeamMembership from "../../entity/teamMembership";

async function teamMembershipUpdateUseCase(
  teamMembershipId: bigint,
  updatedTeamMembershipData: TeamMembership
): Promise<{ message: string }> {
  return await updateTeamMembership(
    teamMembershipId,
    updatedTeamMembershipData
  );
}

export default teamMembershipUpdateUseCase;
