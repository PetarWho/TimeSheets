import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { checkPermissionForRole } from "../adapters/repositories/permissionRoleRepository";
import Permission from "../entity/permission";
import { fetchUserById } from "../adapters/repositories/userRepository";
import { fetchRoleById } from "../adapters/repositories/roleRepository";
import { rolesEnum } from "../enums/roles.enum";
import userFetchByIdUseCase from "../usecases/users/userFetchById";
import User from "../entity/user";

async function reusableCheckPermissionForRole(
  req: Request,
  res: Response,
  perm: Permission
) {
  const token = req.headers.authorization?.split(" ")[1];
  const user_id = await getUserIdFromToken(token as string);

  if (!user_id) {
    throw new Error("Failed to decode jwt!");
  }
  const role_id = (await fetchUserById(BigInt(user_id))).role_id;
  if (!perm.id) {
    throw new Error("Permission id not found!");
  }
  const hasPermission = await checkPermissionForRole(
    BigInt(perm.id),
    BigInt(role_id)
  );
  if (!hasPermission) {
    throw Error("You don't have permission for this action!");
  }
}
export async function getUserIdFromToken(
  token: string
): Promise<string | null> {
  const decodedToken = jwt.decode(token) as { [key: string]: any } | null;
  if (decodedToken && decodedToken.id) {
    return decodedToken.id;
  }
  return null;
}

export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    let userId = await getUserIdFromToken(token);
    if (!userId) {
      throw new Error("Invalid User");
    }

    return await userFetchByIdUseCase(BigInt(userId));
  } catch {
    return null;
  }
}

export async function isAdminOrManager(roleId: bigint): Promise<boolean> {
  const role = await fetchRoleById(roleId);
  if (role.name == rolesEnum.Admin || role.name == rolesEnum.Manager) {
    return true;
  }
  return false;
}

export default reusableCheckPermissionForRole;
