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
  return db.runSql(`
    UPDATE users
    SET role_id = 1
    WHERE id = 1;
  `);
};

exports.down = function (db) {
  return db.runSql(`
    UPDATE users
    SET role_id = 3
    WHERE id = 1;
  `);
};

exports._meta = {
  version: 1,
};
