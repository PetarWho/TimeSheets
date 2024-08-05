import { createPermissionRole } from "../../adapters/repositories/permissionRoleRepository";
import PermissionRole from "../../entity/permissionRole";

async function permissionRoleCreateUseCase(
  permissionRoleData: PermissionRole
): Promise<{ message: string }> {
  return await createPermissionRole(permissionRoleData);
}

export default permissionRoleCreateUseCase;
