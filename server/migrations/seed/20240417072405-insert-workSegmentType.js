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
  const workSegmentTypesData = [
    {
      name: "Development",
      color: "#1E90FF",
      description:
        "Time spent on writing and testing code for new features or applications.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Research",
      color: "#FFD700",
      description:
        "Time allocated for researching new technologies, methodologies, or industry trends.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Testing",
      color: "#32CD32",
      description:
        "Activities related to testing and quality assurance to ensure software meets requirements and is bug-free.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Design",
      color: "#FF69B4",
      description:
        "Time spent on creating designs for user interfaces, user experiences and visual elements.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Documentation",
      color: "#FFA500",
      description:
        "Time dedicated to writing and updating project documentation, user manuals and technical guides.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Project Management",
      color: "#8A2BE2",
      description:
        "Time spent on planning, organizing and managing project tasks and resources.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Client Meetings",
      color: "#FF4500",
      description:
        "Time allocated for meetings and communications with clients to discuss project requirements, progress and feedback.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Code Review",
      color: "#00CED1",
      description:
        "Time spent reviewing code written by colleagues to ensure it meets quality standards and best practices.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Maintenance",
      color: "#2E8B57",
      description:
        "Time spent on maintaining and updating existing systems, including bug fixes and minor enhancements.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
    {
      name: "Support",
      color: "#D2691E",
      description:
        "Time allocated for providing technical support and assistance to users or customers.",
      created_at: 1715212800000,
      updated_at: 1715212800000,
    },
  ];

  for (const workSegmentTypeData of workSegmentTypesData) {
    await db.insert(
      "work_segment_types",
      ["name", "color", "description", "created_at", "updated_at"],
      [
        workSegmentTypeData.name,
        workSegmentTypeData.color,
        workSegmentTypeData.description,
        workSegmentTypeData.created_at,
        workSegmentTypeData.updated_at,
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
