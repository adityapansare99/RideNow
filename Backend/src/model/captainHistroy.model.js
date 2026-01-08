import mongoose from "mongoose";

const histroy = new mongoose.Schema({
  captain_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Captain",
  },

  dist: {
    type: [Number],
  },

  time: {
    type: [Number],
  },

  earning: {
    type: [Number],
  },

  hist: {
    type: Map,
    of: [[Number]],
  },
});

const Histroy = new mongoose.model("Histroy", histroy);

export default Histroy;
