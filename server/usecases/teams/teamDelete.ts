import { deleteTeam } from "../../adapters/repositories/teamRepository";

async function teamDeleteUseCase(teamId: bigint): Promise<{ message: string }> {
  return await deleteTeam(teamId);
}

export default teamDeleteUseCase;
