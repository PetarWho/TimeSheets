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
  const projectsData = [
    {
      name: "Project 1",
      client_id: 1,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Project 2",
      client_id: 2,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Project 3",
      client_id: 3,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Project 4",
      client_id: 4,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Project 5",
      client_id: 5,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Project 6",
      client_id: 6,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Project 7",
      client_id: 7,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Project 8",
      client_id: 8,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Project 9",
      client_id: 9,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Project 10",
      client_id: 10,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
  ];

  for (const projectData of projectsData) {
    await db.insert(
      "projects",
      ["name", "client_id", "created_at", "updated_at"],
      [
        projectData.name,
        projectData.client_id,
        projectData.created_at,
        projectData.updated_at,
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
