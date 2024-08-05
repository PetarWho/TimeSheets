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
  return db.createTable("leave_segments", {
    id: {
      type: "bigint",
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
    },
    start_date: {
      type: "bigint",
      notNull: true,
    },
    end_date: {
      type: "bigint",
      notNull: true,
    },
    notes: {
      type: "text",
      notNull: true,
    },
    user_id: {
      type: "bigint",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "leave_segment_user_id_fk",
        table: "users",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        mapping: "id",
      },
    },
    leave_segment_type_id: {
      type: "bigint",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "leave_segment_leave_segment_type_id_fk",
        table: "leave_segment_types",
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
    status: {
      type: "string",
      defaultValue: "awaiting",
      notNull: true,
    },
  });
};

exports.down = function (db) {
  return db.dropTable("leave_segments");
};

exports._meta = {
  version: 1,
};
