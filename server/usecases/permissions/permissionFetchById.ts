import Permission from "../../entity/permission";
import { fetchPermissionById } from "../../adapters/repositories/permissionRepository";

async function permissionFetchByIdUseCase(
  permissionId: bigint
): Promise<Permission | null> {
  const permissionData = await fetchPermissionById(permissionId);
  if (permissionData) {
    const leaveSegment = new Permission(permissionData.id, permissionData.name);
    return leaveSegment;
  } else {
    return null;
  }
}

export default permissionFetchByIdUseCase;
