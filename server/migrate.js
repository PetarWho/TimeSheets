const dbmigrate = require("db-migrate");
const path = require("path");

const options = {
  config: path.resolve(__dirname, "database.json"),
  env: "prod",
};

dbmigrate.getInstance(true, options, (err, db) => {
  if (err) {
    console.error("Error initializing db-migrate:", err);
    process.exit(1);
  }

  db.up((err, results) => {
    if (err) {
      console.error("Error applying migrations:", err);
      process.exit(1);
    }

    console.log("Migrations applied successfully:", results);
    process.exit(0);
  });
});
