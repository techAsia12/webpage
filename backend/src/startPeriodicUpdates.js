import {
  insertHourly,
  insertWeekly,
  insertYearly,
} from "./controllers/user.controller.js";
import db from "./db/index.js";

const startPeriodicUpdates = () => {
  console.log("Starting periodic updates...");

  setInterval(async () => {
    try {
      const [users] = await db
        .promise()
        .query("SELECT phoneno, watt FROM client_dets");

      if (users.length === 0) {
        console.log("No users found for periodic updates.");
        return;
      }

      users.forEach((user) => {
        const phoneno = user.phoneno;
        const unit = user.watt;

        insertHourly(phoneno, unit);
        insertWeekly(phoneno, unit);
        insertYearly(phoneno, unit);
      });
    } catch (error) {
      console.error("Error during periodic updates:", error);
    }
  }, 60 * 1000);

  console.log("Periodic updates scheduled.");
};

export default startPeriodicUpdates;