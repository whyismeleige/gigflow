const mongoose = require("mongoose");

const GigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    budget: {
      type: Number,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["open", "assigned"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Gig", GigSchema);
