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
  return db.createTable("permissions_roles", {
    id: {
      type: "bigint",
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
    },
    role_id: {
      type: "bigint",
      unsigned: true,
      foreignKey: {
        name: "permissions_roles_roles_id_fk",
        table: "roles",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        mapping: "id",
      },
    },
    permission_id: {
      type: "bigint",
      unsigned: true,
      foreignKey: {
        name: "permissions_roles_permissions_id_fk",
        table: "permissions",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        mapping: "id",
      },
    },
  });
};

exports.down = function (db) {
  return db.dropTable("roles");
};

exports._meta = {
  version: 1,
};
