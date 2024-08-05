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
  const clientsData = [
    { name: "Client 1", created_at: 1715040000000, updated_at: 1715040000000 },
    { name: "Client 2", created_at: 1715040000000, updated_at: 1715040000000 },
    { name: "Client 3", created_at: 1715040000000, updated_at: 1715040000000 },
    { name: "Client 4", created_at: 1715040000000, updated_at: 1715040000000 },
    { name: "Client 5", created_at: 1715040000000, updated_at: 1715040000000 },
    { name: "Client 6", created_at: 1715040000000, updated_at: 1715040000000 },
    { name: "Client 7", created_at: 1715040000000, updated_at: 1715040000000 },
    { name: "Client 8", created_at: 1715040000000, updated_at: 1715040000000 },
    { name: "Client 9", created_at: 1715040000000, updated_at: 1715040000000 },
    { name: "Client 10", created_at: 1715040000000, updated_at: 1715040000000 },
  ];

  for (const clientData of clientsData) {
    await db.insert(
      "clients",
      ["name", "created_at", "updated_at"],
      [clientData.name, clientData.created_at, clientData.updated_at]
    );
  }
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
