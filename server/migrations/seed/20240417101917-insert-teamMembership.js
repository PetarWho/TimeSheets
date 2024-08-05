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

exports.up = async function (db) {
  const teamMembershipData = [
    { team_id: 1, user_id: 1 },
    { team_id: 1, user_id: 2 },
    { team_id: 2, user_id: 3 },
    { team_id: 2, user_id: 4 },
    { team_id: 3, user_id: 5 },
    { team_id: 3, user_id: 6 },
    { team_id: 4, user_id: 7 },
    { team_id: 4, user_id: 8 },
    { team_id: 5, user_id: 9 },
    { team_id: 5, user_id: 10 },
  ];

  for (const membershipData of teamMembershipData) {
    await db.insert(
      "team_memberships",
      ["team_id", "user_id"],
      [membershipData.team_id, membershipData.user_id]
    );
  }
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
