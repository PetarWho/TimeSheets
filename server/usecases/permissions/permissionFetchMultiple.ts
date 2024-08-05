import Permission from "../../entity/permission";
import { fetchMultiplePermissions } from "../../adapters/repositories/permissionRepository";

async function permissionFetchMultipleUseCase(
  input: string
): Promise<Permission[]> {
  const permData = await fetchMultiplePermissions(input);

  const perms = permData.map(
    (data: Permission) => new Permission(data.id, data.name)
  );
  return perms;
}

export default permissionFetchMultipleUseCase;
