import { deleteTeamMembership } from "../../adapters/repositories/teamMembershipRepository";

async function teamMembershipDeleteUseCase(
  teamMembershipId: bigint
): Promise<{ message: string }> {
  return await deleteTeamMembership(teamMembershipId);
}

export default teamMembershipDeleteUseCase;
