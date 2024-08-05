import Permission from "../../entity/permission";
import { fetchPermissionByExactName } from "../../adapters/repositories/permissionRepository";

async function permissionFetchByExactNameUseCase(
  permissionName: string
): Promise<Permission | null> {
  const permissionData = await fetchPermissionByExactName(permissionName);
  if (permissionData) {
    const leaveSegment = new Permission(permissionData.id, permissionData.name);
    return leaveSegment;
  } else {
    return null;
  }
}

export default permissionFetchByExactNameUseCase;
