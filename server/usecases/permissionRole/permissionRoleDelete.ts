import { deletePermissionRole } from "../../adapters/repositories/permissionRoleRepository";

async function permissionRoleDeleteUseCase(
  permissionRoleId: bigint
): Promise<{ message: string }> {
  return await deletePermissionRole(permissionRoleId);
}

export default permissionRoleDeleteUseCase;
