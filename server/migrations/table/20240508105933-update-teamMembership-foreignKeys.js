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
  return db
    .addForeignKey(
      "team_memberships",
      "teams",
      "fk_team_memberships_team_id",
      {
        team_id: "id",
      },
      {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }
    )
    .then(function () {
      return db.addForeignKey(
        "team_memberships",
        "users",
        "fk_team_memberships_user_id",
        {
          user_id: "id",
        },
        {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        }
      );
    });
};

exports.down = function (db) {
  return db
    .removeForeignKey("team_memberships", "fk_team_memberships_team_id")
    .then(function () {
      return db.removeForeignKey(
        "team_memberships",
        "fk_team_memberships_user_id"
      );
    });
};

exports._meta = {
  version: 1,
};
