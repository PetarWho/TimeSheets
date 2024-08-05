import Project from "../../entity/project";
import { createProject } from "../../adapters/repositories/projectRepository";

async function projectCreateUseCase(
  projectData: Project
): Promise<{ message: string }> {
  return await createProject(projectData);
}

export default projectCreateUseCase;
