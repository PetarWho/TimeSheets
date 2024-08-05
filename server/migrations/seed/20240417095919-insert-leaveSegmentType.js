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
  const leaveSegmentTypesData = [
    {
      name: "Sick",
      color: "#FF6F61",
      description:
        "Time off granted when an employee is ill and unable to work.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Holiday",
      color: "#FFD700",
      description: "Paid leave taken during official public holidays.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Vacation",
      color: "#00BFFF",
      description: "Paid leave taken for personal rest and relaxation.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Personal",
      color: "#7B68EE",
      description: "Leave taken for personal reasons or emergencies.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Maternity",
      color: "#FFB6C1",
      description: "Leave taken by a mother before and after childbirth.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Paternity",
      color: "#4682B4",
      description:
        "Leave taken by a father to care for a newborn or recently adopted child.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Compassionate",
      color: "#FF6347",
      description:
        "Leave granted to deal with a family emergency or the serious illness of a close relative.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Study",
      color: "#32CD32",
      description:
        "Time off granted to pursue educational or professional development opportunities.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Medical Appointment",
      color: "#20B2AA",
      description: "Time off granted for medical appointments or treatments.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Unpaid",
      color: "#A9A9A9",
      description:
        "Leave taken without pay, typically when paid leave is exhausted.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
  ];

  for (const leaveSegmentTypeData of leaveSegmentTypesData) {
    await db.insert(
      "leave_segment_types",
      ["name", "color", "description", "created_at", "updated_at"],
      [
        leaveSegmentTypeData.name,
        leaveSegmentTypeData.color,
        leaveSegmentTypeData.description,
        leaveSegmentTypeData.created_at,
        leaveSegmentTypeData.updated_at,
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
