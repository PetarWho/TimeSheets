class TeamMembership {
  id: bigint;
  team_id: bigint;
  user_id: bigint;

  constructor(id: bigint, team_id: bigint, user_id: bigint) {
    this.id = id;
    this.team_id = team_id;
    this.user_id = user_id;
  }
}

export default TeamMembership;
