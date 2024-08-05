import { deleteProject } from "../../adapters/repositories/projectRepository";

async function projectDeleteUseCase(
  projectId: bigint
): Promise<{ message: string }> {
  return await deleteProject(projectId);
}

export default projectDeleteUseCase;
