"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function (db) {
  const rolesHierarchy = {
    [RolesEnum.User]: [RolesEnum.User, RolesEnum.Manager, RolesEnum.Admin],
    [RolesEnum.Manager]: [RolesEnum.Manager, RolesEnum.Admin],
    [RolesEnum.Admin]: [RolesEnum.Admin],
  };

  for (const permData of permissionsData) {
    const roles = rolesHierarchy[permData.role_id];
    for (const roleId of roles) {
      await db.insert(
        "permissions_roles",
        ["role_id", "permission_id"],
        [roleId, permData.id]
      );
    }
  }
};

exports.down = function (db) {
  return db.runSql(`DELETE * FROM permissions_roles`);
};

exports._meta = {
  version: 1,
};

const RolesEnum = {
  Admin: 1,
  Manager: 2,
  User: 3,
};

const permissionsData = [
  { id: 1, name: "write_client", role_id: RolesEnum.Manager },
  { id: 2, name: "read_client", role_id: RolesEnum.User },
  { id: 3, name: "read_all_client", role_id: RolesEnum.Manager },
  { id: 4, name: "delete_client", role_id: RolesEnum.Admin },

  { id: 5, name: "write_leave_segment", role_id: RolesEnum.User },
  { id: 6, name: "read_leave_segment", role_id: RolesEnum.User },
  { id: 7, name: "read_all_leave_segments", role_id: RolesEnum.User },
  { id: 8, name: "delete_leave_segment", role_id: RolesEnum.User },

  { id: 9, name: "write_leave_segment_type", role_id: RolesEnum.Manager },
  { id: 10, name: "read_leave_segment_type", role_id: RolesEnum.User },
  { id: 11, name: "read_all_leave_segment_types", role_id: RolesEnum.User },
  { id: 12, name: "delete_leave_segment_type", role_id: RolesEnum.Admin },

  { id: 13, name: "write_permission_role", role_id: RolesEnum.Admin },
  { id: 14, name: "read_permission_role", role_id: RolesEnum.User },
  { id: 15, name: "delete_permission_role", role_id: RolesEnum.User },

  { id: 16, name: "read_permission", role_id: RolesEnum.User },

  { id: 17, name: "read_role", role_id: RolesEnum.User },
  { id: 18, name: "set_role", role_id: RolesEnum.Admin },

  { id: 19, name: "write_project", role_id: RolesEnum.Manager },
  { id: 20, name: "read_project", role_id: RolesEnum.User },
  { id: 21, name: "read_all_projects", role_id: RolesEnum.User },
  { id: 22, name: "delete_project", role_id: RolesEnum.Admin },

  { id: 23, name: "write_team_membership", role_id: RolesEnum.Manager },
  { id: 24, name: "read_team_membership", role_id: RolesEnum.User },
  { id: 25, name: "read_all_team_memberships", role_id: RolesEnum.User },
  { id: 26, name: "delete_team_membership", role_id: RolesEnum.Manager },

  { id: 27, name: "write_team", role_id: RolesEnum.Manager },
  { id: 28, name: "read_team", role_id: RolesEnum.User },
  { id: 29, name: "read_all_teams", role_id: RolesEnum.User },
  { id: 30, name: "delete_team", role_id: RolesEnum.Admin },

  { id: 31, name: "write_user", role_id: RolesEnum.Admin },
  { id: 32, name: "read_user", role_id: RolesEnum.User },
  { id: 33, name: "read_all_users", role_id: RolesEnum.Manager },
  { id: 34, name: "delete_user", role_id: RolesEnum.Admin },
  { id: 35, name: "deactivate_user", role_id: RolesEnum.Manager },

  { id: 36, name: "write_work_segment", role_id: RolesEnum.User },
  { id: 37, name: "read_work_segment", role_id: RolesEnum.User },
  { id: 38, name: "read_all_work_segments", role_id: RolesEnum.User },
  { id: 39, name: "delete_work_segment", role_id: RolesEnum.User },

  { id: 40, name: "write_work_segment_type", role_id: RolesEnum.Manager },
  { id: 41, name: "read_work_segment_type", role_id: RolesEnum.User },
  { id: 42, name: "read_all_work_segment_types", role_id: RolesEnum.User },
  { id: 43, name: "delete_work_segment_type", role_id: RolesEnum.Admin },
];
