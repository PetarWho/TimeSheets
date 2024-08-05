import { updateTeam } from "../../adapters/repositories/teamRepository";
import Team from "../../entity/team";

async function teamUpdateUseCase(
  teamId: bigint,
  updatedTeamData: Team
): Promise<{ message: string }> {
  return await updateTeam(teamId, updatedTeamData);
}

export default teamUpdateUseCase;
