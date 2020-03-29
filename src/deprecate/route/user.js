import express from 'express';
//import sanitize from 'mongo-sanitize';
import {} from '../controller/user';
import UserController from '../controller/user';
//import { mainlog } from "../common/log";
var router = express.Router();

const userController = new UserController();

// Get all
router.get(
  '/',
  //Role.requireRole('user'),
  function(req, res) {
    if (!req.extras) {
      req.extras = {};
    }

    console.log('received');
    const query = req.extras.query || {};
    return userController
      .find(query, req.extras)
      .then(users => {
        res.status(200);
        return res.json(users);
      })
      .catch(err => {
        console.error('Error getting entries:  ' + err);
        res.status(404);
        return res.json({
          result: 'failure',
          message: 'error fetching entries'
        });
      });
  }
);

// Create new FE user
router.post(
  '/',
  //Roles.requireRole('admin')
  function(req, res) {
    if (!req.body.uid || req.body === {}) {
      //validation - we need an userId to add the new data
      return res
        .status(400)
        .json(
          'Please add userID to the body of request & make sure user model is fulfilled'
        );
    }
    return userController
      .save(req.body)
      .then(result => {
        res.status(201);
        return res.json({ data: result });
      })
      .catch(err => {
        res.status(400);
        console.warn(' Problems creating user: ', err);
        return res.json({ result: 'failure', message: err });
      });
  }
);

export default router;
