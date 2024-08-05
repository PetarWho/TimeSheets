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
  const leaveSegmentsData = [
    {
      start_date: 1715212800000,
      end_date: 1715385600000,
      notes: "Leave Segment 1 Note",
      user_id: 1,
      leave_segment_type_id: 1,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      start_date: 1715385600000,
      end_date: 1715472000000,
      notes: "Leave Segment 2 Note",
      user_id: 2,
      leave_segment_type_id: 2,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      start_date: 1715558400000,
      end_date: 1715731200000,
      notes: "Leave Segment 3 Note",
      user_id: 3,
      leave_segment_type_id: 3,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      start_date: 1715904000000,
      end_date: 1715904000000,
      notes: "Leave Segment 4 Note",
      user_id: 4,
      leave_segment_type_id: 4,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      start_date: 1715904000000,
      end_date: 1716336000000,
      notes: "Leave Segment 5 Note",
      user_id: 5,
      leave_segment_type_id: 5,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      start_date: 1716508800000,
      end_date: 1716768000000,
      notes: "Leave Segment 6 Note",
      user_id: 6,
      leave_segment_type_id: 6,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      start_date: 1716940800000,
      end_date: 1717113600000,
      notes: "Leave Segment 7 Note",
      user_id: 7,
      leave_segment_type_id: 7,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      start_date: 1717200000000,
      end_date: 1717200000000,
      notes: "Leave Segment 8 Note",
      user_id: 8,
      leave_segment_type_id: 8,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      start_date: 1717200000000,
      end_date: 1717718400000,
      notes: "Leave Segment 9 Note",
      user_id: 9,
      leave_segment_type_id: 9,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      start_date: 1717891200000,
      end_date: 1719619200000,
      notes: "Leave Segment 10 Note",
      user_id: 10,
      leave_segment_type_id: 10,
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
  ];

  for (const leaveSegmentData of leaveSegmentsData) {
    await db.insert(
      "leave_segments",
      [
        "start_date",
        "end_date",
        "notes",
        "user_id",
        "leave_segment_type_id",
        "created_at",
        "updated_at",
      ],
      [
        leaveSegmentData.start_date,
        leaveSegmentData.end_date,
        leaveSegmentData.notes,
        leaveSegmentData.user_id,
        leaveSegmentData.leave_segment_type_id,
        leaveSegmentData.created_at,
        leaveSegmentData.updated_at,
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
