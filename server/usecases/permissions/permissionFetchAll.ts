import Permission from "../../entity/permission";
import { fetchAllPermissions } from "../../adapters/repositories/permissionRepository";
async function permissionFetchAllUseCase(): Promise<Permission[]> {
  const allPermissions: Permission[] = await fetchAllPermissions();
  const Permissions = allPermissions.map(
    (permissionData: Permission) =>
      new Permission(permissionData.id, permissionData.name)
  );
  return Permissions;
}
export default permissionFetchAllUseCase;
