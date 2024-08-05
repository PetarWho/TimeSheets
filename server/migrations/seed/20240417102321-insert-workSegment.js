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
  const workSegmentsData = [
    {
      date: 1711929600000,
      hours: 8,
      notes: "Sample work segment 1",
      project_id: 1,
      user_id: 1,
      work_segment_type_id: 1,
      created_at: 1711929600000,
      updated_at: 1711929600000,
    },
    {
      date: 1712016000000,
      hours: 7.5,
      notes: "Sample work segment 2",
      project_id: 2,
      user_id: 2,
      work_segment_type_id: 2,
      created_at: 1712016000000,
      updated_at: 1712016000000,
    },
    {
      date: 1712102400,
      hours: 6.5,
      notes: "Sample work segment 3",
      project_id: 3,
      user_id: 3,
      work_segment_type_id: 3,
      created_at: 1712102400000,
      updated_at: 1712102400000,
    },
    {
      date: 1712188800000,
      hours: 8,
      notes: "Sample work segment 4",
      project_id: 4,
      user_id: 4,
      work_segment_type_id: 4,
      created_at: 1712188800000,
      updated_at: 1712188800000,
    },
    {
      date: 1712275200000,
      hours: 8,
      notes: "Sample work segment 5",
      project_id: 5,
      user_id: 5,
      work_segment_type_id: 5,
      created_at: 1712275200000,
      updated_at: 1712275200000,
    },
    {
      date: 1712361600000,
      hours: 7.5,
      notes: "Sample work segment 6",
      project_id: 6,
      user_id: 6,
      work_segment_type_id: 6,
      created_at: 1712361600000,
      updated_at: 1712361600000,
    },
    {
      date: 1712448000000,
      hours: 6.5,
      notes: "Sample work segment 7",
      project_id: 7,
      user_id: 7,
      work_segment_type_id: 7,
      created_at: 1712448000000,
      updated_at: 1712448000000,
    },
    {
      date: 1712534400000,
      hours: 8,
      notes: "Sample work segment 8",
      project_id: 8,
      user_id: 8,
      work_segment_type_id: 8,
      created_at: 1712534400000,
      updated_at: 1712534400000,
    },
    {
      date: 1712620800000,
      hours: 8,
      notes: "Sample work segment 9",
      project_id: 9,
      user_id: 9,
      work_segment_type_id: 9,
      created_at: 1712620800000,
      updated_at: 1712620800000,
    },
    {
      date: 1712707200000,
      hours: 7.5,
      notes: "Sample work segment 10",
      project_id: 10,
      user_id: 10,
      work_segment_type_id: 10,
      created_at: 1712707200000,
      updated_at: 1712707200000,
    },
  ];

  for (const segmentData of workSegmentsData) {
    await db.insert(
      "work_segments",
      [
        "date",
        "hours",
        "notes",
        "project_id",
        "user_id",
        "work_segment_type_id",
        "created_at",
        "updated_at",
      ],
      [
        segmentData.date,
        segmentData.hours,
        segmentData.notes,
        segmentData.project_id,
        segmentData.user_id,
        segmentData.work_segment_type_id,
        segmentData.created_at,
        segmentData.updated_at,
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
