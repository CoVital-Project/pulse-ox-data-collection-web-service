import Promise from "bluebird";
import express from "express";
import migrate from "migrate";
import {} from "dotenv/config"; //tricky - Improve

import { mongooseConnect, mongooseDisconnect } from "./config/db";
import MigrateDbStore from "./MigrateDbStore";

// Routes
import PUBLIC_userRouter from "./route/user"; //to be changed by authenticated route - at the moment will be public

//import { mainlog } from "./util/log";

const app = express();
const port = 3000;
app.set("port", port);

// connect to mongo
(async () => {
  try {
    await mongooseConnect();

    console.info("[init] Successfuly connected to mongodb");
  } catch (err) {
    console.info("[init] Mongodb connect error:\n", err);
    process.exit(2);
  }

  migrate.load(
    {
      stateStore: new MigrateDbStore()
    },
    function(err, migrationSet) {
      if (err) {
        console.error(err);
      }
      migrationSet.up(function(err) {
        if (err) {
          console.error(err);
        }
        return migrationSet;
      });
    }
  );
})();
// Routes
app.listen(port, () =>
  console.log(`Covital backend listening on port ${port}...`)
);
app.use(express.json());
app.use("/diagnoses", PUBLIC_userRouter);

//Routes

export default app;

module.exports = app;
