import mongoose from "mongoose";
import sanitize from "mongo-sanitize";
import paginate from "mongoose-paginate-v2";
const Schema = mongoose.Schema;
const Promise = require("bluebird");

mongoose.Promise = Promise;

const userSchema = new Schema(
  {
    // id: {
    //   type: String,
    //   unique: true,
    //   required: true
    // },

    diagnoses: [
      {
        timestamp: {
          type: Date,
          required: true
        }
        questions: [
          {
            questionId: {
              type: String,
              required: true
            },
            answer: { 
              type: String, 
              required: true 
            },
            timestamp: {
              type: Date,
              required: true
            }
          }
        ],
        status: [
          {
            action: {
              type: String,
              required: true
            },
            status: {
              type: String,
              required: true
            },
            timestamp: {
              type: Timestamp,
              required: true
            }
          }
        ],
        symptoms: [{
          symptom: {
            type: String,
            required: true
          },
          status:[{
            timestamp: {
              type: Date,
              required: true
            },
            severity: {
              type: String,
              required: true
            }
          }]
        }]
        readings: [
          {
            BPM: {
              type: Number,
              required: true
            },
            SPO2: {
              type: Number,
              required: true
            },
            Temperature: {
              type: Number,
              required: true
            },
            location: {
              type: {
                type: String, // Don't do `{ location: { type: String } }`
                enum: ["Point"], // 'location.type' must be 'Point'
                required: true
              },
              coordinates: {
                type: [Number],
                required: true
              }
            },
            timestamp: {
              type: Date,
              required: true
            }
          }
        ]
      }
    ],
    age: {
      type: Number,
      required: true
    },
    role: {
      type: String,
      required: false
    },
    gender: {
      type: String,
      required: true
    },
    schema_version: {
      type: Number,
      required: false
    }
  },
  { timestamps: true }
);

// userSchema.index({ id: 1 }, { unique: true, sparse: true });
// userSchema.methods.toJSON = function() {
//   const obj = this.toObject();
//   delete obj._id;
//   delete obj.__v;
//   return obj;
// };

//userSchema.plugin(paginate);

const userModel = mongoose.model("User", userSchema);

export default userModel;
module.exports = userModel;
