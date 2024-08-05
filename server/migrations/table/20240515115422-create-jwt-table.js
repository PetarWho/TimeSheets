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
  return db.createTable("tokens", {
    jwt: {
      type: "string",
      primaryKey: true,
    },
    user_id: {
      type: "bigint",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "token_user_id_fk",
        table: "users",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        mapping: "id",
      },
    },
    expiry_date: {
      type: "bigint",
      notNull: true,
    },
  });
};

exports.down = function (db) {
  return db.dropTable("tokens");
};

exports._meta = {
  version: 1,
};
