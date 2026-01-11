const mongoose = require("mongoose");

const BidSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
    },
    proposedPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "hired", "rejected"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bid", BidSchema);
