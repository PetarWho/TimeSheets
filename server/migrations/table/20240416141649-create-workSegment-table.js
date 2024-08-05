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
  return db.createTable("work_segments", {
    id: {
      type: "bigint",
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
    },
    date: {
      type: "bigint",
    },
    hours: {
      type: "decimal",
    },
    notes: {
      type: "text",
    },

    project_id: {
      type: "bigint",
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: "work_segment_project_id_fk",
        table: "projects",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
    },
    user_id: {
      type: "bigint",
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: "work_segment_user_id_fk",
        table: "users",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
    },
    work_segment_type_id: {
      type: "bigint",
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: "work_segment_work_segment_type_id_fk",
        table: "work_segment_types",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "CASCADE",
        },
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
  return db.dropTable("work_segments");
};

exports._meta = {
  version: 1,
};
