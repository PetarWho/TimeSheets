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
  const rolesData = [{ name: "admin" }, { name: "manager" }, { name: "user" }];

  for (const roleData of rolesData) {
    await db.insert("roles", ["name"], [roleData.name]);
  }
};

exports.down = function (db) {
  const rolesData = [{ name: "admin" }, { name: "manager" }, { name: "user" }];

  for (const roleData of rolesData) {
    return db.runSql(
      `
    DELETE * FROM roles WHERE name = ?
    `,
      [roleData.name]
    );
  }
};

exports._meta = {
  version: 1,
};
