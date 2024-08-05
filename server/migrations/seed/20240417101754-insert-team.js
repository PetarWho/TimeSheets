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
  const teamsData = [
    {
      project_id: 1,
      name: "Team 1",
      description: "Description of Team 1",
      created_at: 1715040000000,
      updated_at: 1715040000000,
    },
    {
      project_id: 2,
      name: "Team 2",
      description: "Description of Team 2",
      created_at: 1715040000000,
      updated_at: 1715040000000,
    },
    {
      project_id: 3,
      name: "Team 3",
      description: "Description of Team 3",
      created_at: 1715040000000,
      updated_at: 1715040000000,
    },
    {
      project_id: 4,
      name: "Team 4",
      description: "Description of Team 4",
      created_at: 1715040000000,
      updated_at: 1715040000000,
    },
    {
      project_id: 5,
      name: "Team 5",
      description: "Description of Team 5",
      created_at: 1715040000000,
      updated_at: 1715040000000,
    },
  ];

  for (const teamData of teamsData) {
    await db.insert(
      "teams",
      ["project_id", "name", "description", "created_at", "updated_at"],
      [
        teamData.project_id,
        teamData.name,
        teamData.description,
        teamData.created_at,
        teamData.updated_at,
      ]
    );
  }
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
