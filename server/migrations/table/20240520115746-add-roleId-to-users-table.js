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
  db.addColumn("users", "role_id", {
    type: "bigint",
    unsigned: true,
    notNull: true,
    defaultValue: 3,
  });

  await db.runSql(`UPDATE users SET role_id = 3 WHERE role_id IS NULL`);
  return null;
};

exports.down = function (db) {
  return db.removeColumn("users", "role_id");
};

exports._meta = {
  version: 1,
};
