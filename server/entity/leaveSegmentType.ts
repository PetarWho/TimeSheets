class LeaveSegmentType {
  id: bigint;
  name: string;
  color: string;
  description: string;
  created_at: number;
  updated_at: number;

  constructor(
    id: bigint,
    name: string,
    color: string,
    description: string,
    created_at: number,
    updated_at: number
  ) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.description = description;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

export default LeaveSegmentType;
