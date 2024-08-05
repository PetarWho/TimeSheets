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
  const usersData = [
    {
      name: "User 1",
      email: "user1@example.com",
      password: "$2b$10$kYZDwaSfs0EubBMUHL7v3.p9QXz8TVp5V4tWiH/vMjEFtmuUdGZPW", // password1
      deactivated: false,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "User 2",
      email: "user2@example.com",
      password: "$2b$10$jN7zMFsAj8tRCHySwu883ujdsnTUJOF/9GlFncAiEU2AN.QPgLBt6", // password2
      deactivated: false,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "User 3",
      email: "user3@example.com",
      password: "$2b$10$Ix0DSzPJ.DBYxwnkvD/FL.ga9N4hTwpDiyJ5z4byVnfRJDtWezfPi", // password3
      deactivated: false,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "User 4",
      email: "user4@example.com",
      password: "$2b$10$e1M8al8REKosJmlR9BR9geNjGTRwfrU1wgBLssczEzasvCtqR9G3y", // password4
      deactivated: false,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "User 5",
      email: "user5@example.com",
      password: "$2b$10$wQKIR7adqJKCeFK35QUNveTjibJnWv0CIWPXKLaTqGoVbOhKr1h8W", // password5
      deactivated: false,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "User 6",
      email: "user6@example.com",
      password: "$2b$10$lmKYsE19wm3DT9c9759G7.H5bexWVPHy8mSGTkzckS804I.j/FzgW", // password6
      deactivated: false,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "User 7",
      email: "user7@example.com",
      password: "$2b$10$.WAeXppFAZvQlcPn79evG.1EtZJif7DpnC6fN5rlshuDSMiMxibIO", // password7
      deactivated: false,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "User 8",
      email: "user8@example.com",
      password: "$2b$10$X1pvWGsNFTnMaHL77C1gaeaeo52r2Ml1q6IWXaqeZZdBhBc7fBWDW", // password8
      deactivated: false,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "User 9",
      email: "user9@example.com",
      password: "$2b$10$Tx4zrn8BG6u4ZhXFDUelDehh5VLAu3ceTxzzxah/ceiEz.Hwug1v2", // password9
      deactivated: false,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "User 10",
      email: "user10@example.com",
      password: "$2b$10$RV4KOu./MViGLFbP55.Ao.K7C0xKyjx.1P/iZMbKml3GQ0SwjeatO", // password10
      deactivated: false,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
  ];

  for (const userData of usersData) {
    await db.insert(
      "users",
      ["name", "email", "password", "deactivated", "created_at", "updated_at"],
      [
        userData.name,
        userData.email,
        userData.password,
        userData.deactivated,
        userData.created_at,
        userData.updated_at,
      ]
    );
  }
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
