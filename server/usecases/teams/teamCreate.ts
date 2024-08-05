import { createTeam } from "../../adapters/repositories/teamRepository";
import Team from "../../entity/team";

async function teamCreateUseCase(teamData: Team): Promise<{ message: string }> {
  return await createTeam(teamData);
}

export default teamCreateUseCase;
