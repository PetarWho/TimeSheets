const PermissionNames = {
  canWriteClient: "write_client",
  canReadClient: "read_client",
  canReadAllClients: "read_all_clients",
  canDeleteClient: "delete_client",

  canWriteLeaveSegment: "write_leave_segment",
  canReadLeaveSegment: "read_leave_segment",
  canReadAllLeaveSegments: "read_all_leave_segments",
  canDeleteLeaveSegment: "delete_leave_segment",

  canWriteLeaveSegmentType: "write_leave_segment_type",
  canReadLeaveSegmentType: "read_leave_segment_type",
  canReadAllLeaveSegmentTypes: "read_all_leave_segment_types",
  canDeleteLeaveSegmentType: "delete_leave_segment_type",

  canWritePermissionRole: "write_permission_role",
  canReadPermissionRole: "read_permission_role",
  canDeletePermissionRole: "delete_permission_role",

  canReadPermission: "read_permission",

  canReadRole: "read_role",
  canSetRole: "set_role",

  canWriteProject: "write_project",
  canReadProject: "read_project",
  canReadAllProjects: "read_all_projects",
  canDeleteProject: "delete_project",

  canWriteTeamMembership: "write_team_membership",
  canReadTeamMembership: "read_team_membership",
  canReadAllTeamMemberships: "read_all_team_memberships", // (this also includes fetch by Team)
  canDeleteTeamMembership: "delete_team_membership",

  canWriteTeam: "write_team",
  canReadTeam: "read_team",
  canReadAllTeams: "read_all_teams",
  canDeleteTeam: "delete_team",

  canWriteUser: "write_user",
  canReadUser: "read_user",
  canReadAllUsers: "read_all_users",
  canDeleteUser: "delete_user",
  canDeactivateUser: "deactivate_user",

  canWriteWorkSegment: "write_work_segment",
  canReadWorkSegment: "read_work_segment",
  canReadAllWorkSegments: "read_all_work_segments",
  canDeleteWorkSegment: "delete_work_segment",

  canWriteWorkSegmentType: "write_work_segment_type",
  canReadWorkSegmentType: "read_work_segment_type",
  canReadAllWorkSegmentTypes: "read_all_work_segment_types",
  canDeleteWorkSegmentType: "delete_work_segment_type",
};

export default PermissionNames;
