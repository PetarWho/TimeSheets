class Project {
  id: bigint;
  name: string;
  client_id: bigint;
  created_at: number;
  updated_at: number;

  constructor(
    id: bigint,
    name: string,
    client_id: bigint,
    created_at: number,
    updated_at: number
  ) {
    this.id = id;
    this.name = name;
    this.client_id = client_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

export default Project;
