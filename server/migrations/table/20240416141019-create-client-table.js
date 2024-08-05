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
  return db.createTable("clients", {
    id: {
      type: "bigint",
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
    },
    name: { type: "string", notNull: true },
    created_at: {
      type: "bigint",
      notNull: true,
    },
    updated_at: {
      type: "bigint",
      notNull: true,
    },
  });
};

exports.down = function (db) {
  return db.dropTable("clients");
};

exports._meta = {
  version: 1,
};
