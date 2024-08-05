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
  return db.createTable("users", {
    id: {
      type: "bigint",
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
    },
    name: { type: "string", notNull: true },
    email: {
      type: "string",
      notNull: true,
      unique: true,
    },
    email_verified_at: {
      type: "bigint",
      notNull: false,
    },
    password: {
      type: "string",
    },
    remember_token: {
      type: "string",
      length: 100,
    },
    google_id: {
      type: "string",
    },
    avatar: {
      type: "string",
    },
    deactivated: {
      type: "boolean",
      defaultValue: false,
      notNull: true,
    },
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
  return db.dropTable("users");
};

exports._meta = {
  version: 1,
};
