import Project from "../../entity/project";

import { updateProject } from "../../adapters/repositories/projectRepository";

async function projectUpdateUseCase(
  projectId: bigint,
  updatedProjectData: Project
): Promise<{ message: string }> {
  return await updateProject(projectId, updatedProjectData);
}

export default projectUpdateUseCase;
