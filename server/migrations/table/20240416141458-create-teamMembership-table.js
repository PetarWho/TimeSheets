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

exports.up = function (db) {
  return db.createTable("team_memberships", {
    id: {
      type: "bigint",
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
    },
    team_id: {
      type: "bigint",
      unsigned: true,
      notNull: true,
    },
    user_id: {
      type: "bigint",
      unsigned: true,
      notNull: true,
    },
  });
};

exports.down = function (db) {
  return db.dropTable("team_memberships");
};

exports._meta = {
  version: 1,
};
