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
  return db.createTable("projects", {
    id: {
      type: "bigint",
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
    },
    name: { type: "string", notNull: true },
    client_id: {
      type: "bigint",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "project_client_id_fk",
        table: "clients",
        rules: {
          onDelete: "NO ACTION",
          onUpdate: "CASCADE",
        },
        mapping: "id",
      },
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
  return db.dropTable("projects");
};

exports._meta = {
  version: 1,
};
