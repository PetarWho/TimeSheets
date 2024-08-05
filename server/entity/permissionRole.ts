class PermissionRole {
  id: bigint;
  role_id: bigint;
  permission_id: bigint;

  constructor(id: bigint, role_id: bigint, permission_id: bigint) {
    this.id = id;
    this.role_id = role_id;
    this.permission_id = permission_id;
  }
}

export default PermissionRole;
