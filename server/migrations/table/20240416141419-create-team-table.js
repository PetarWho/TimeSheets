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
  return db.createTable("teams", {
    id: {
      type: "bigint",
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
    },
    project_id: {
      type: "bigint",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "team_project_id_fk",
        table: "projects",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        mapping: "id",
      },
    },
    name: { type: "string", notNull: true },
    description: { type: "string" },
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
  return db.dropTable("teams");
};

exports._meta = {
  version: 1,
};
