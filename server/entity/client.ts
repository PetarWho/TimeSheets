class Client {
  id: bigint;
  name: string;
  created_at: number;
  updated_at: number;

  constructor(
    id: bigint,
    name: string,
    created_at: number,
    updated_at: number
  ) {
    this.id = id;
    this.name = name;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  getPublicProfile(): {
    id: bigint;
    name: string;
    created_at: number;
    updated_at: number;
  } {
    const { id, name, created_at, updated_at } = this;
    return { id, name, created_at, updated_at };
  }
}

export default Client;
