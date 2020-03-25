"use strict";

import User from "../src/model/user";

let newUsers = [
  {
    uid: "test_user_uid1",
    diagnoses: [
      {
        questions: [
          { questionId: "test", answer: "test", timestamp: Date.now() }
        ],
        status: [{ action: "test", status: "test", timestamp: Date.now() }],
        readings: [
          {
            BPM: 112,
            location: { type: "Point", coordinates: [36, 7.5] },
            timestamp: Date.now()
          }
        ]
      }
    ],
    age: 66,
    gender: "Male"
  }
];
const up = async function(next) {
  console.log("UP Migration: Adding first test user");

  //first we save all

  try {
    await await User.insertMany(newUsers);

    console.log("Added first test user");
    return next();
  } catch (error) {
    if (error.code && error.code === 11000) {
      console.log("UP Migration SKIPPED: already exist", error);
      return next();
    }
    console.log("UP Migration FAILED:", console.error(error));
    process.exit(0);
  }
};
const down = function() {};

const description = "First test user";

export { up, down, description };
