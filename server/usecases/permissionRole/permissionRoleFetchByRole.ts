import { fetchPermissionRoleByRoleId } from "../../adapters/repositories/permissionRoleRepository";
import PermissionRole from "../../entity/permissionRole";

async function permissionRoleFetchByRoleIdUseCase(
  role_id: bigint
): Promise<PermissionRole[]> {
  const allPermissionRoles: PermissionRole[] =
    await fetchPermissionRoleByRoleId(role_id);
  const permissionRoles = allPermissionRoles.map(
    (permissionRoleData) =>
      new PermissionRole(
        permissionRoleData.id,
        permissionRoleData.role_id,
        permissionRoleData.permission_id
      )
  );
  return permissionRoles;
}

export default permissionRoleFetchByRoleIdUseCase;
