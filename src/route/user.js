import express from "express";
//import sanitize from 'mongo-sanitize';
import {} from "../controller/user";
import UserController from "../controller/user";
//import { mainlog } from "../common/log";
var router = express.Router();

const userController = new UserController();

// Get all
router.get(
  "/",
  //Role.requireRole('user'),
  function(req, res) {
    if (!req.extras) {
      req.extras = {};
    }

    console.log("received");
    const query = req.extras.query || {};
    return userController
      .find(query, req.extras)
      .then(users => {
        res.status(200);
        return res.json(users);
      })
      .catch(err => {
        console.error("Error getting entries:  " + err);
        res.status(404);
        return res.json({
          result: "failure",
          message: "error fetching entries"
        });
      });
  }
);
export default router;
