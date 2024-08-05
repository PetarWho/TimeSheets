class Team {
  id: bigint;
  project_id: bigint;
  name: string;
  description: string;
  created_at: number;
  updated_at: number;

  constructor(
    id: bigint,
    project_id: bigint,
    name: string,
    description: string,
    created_at: number,
    updated_at: number
  ) {
    this.id = id;
    this.project_id = project_id;
    this.name = name;
    this.description = description;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

export default Team;
