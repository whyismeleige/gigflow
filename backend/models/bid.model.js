const mongoose = require("mongoose");

const BidSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: [true, "Gig ID is required"],
      index: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Freelancer Id is required"],
      index: true,
    },
    message: {
      type: String,
      required: [true, "Bid message is required"],
      trim: true,
      minlength: [10, "Message must be atleast 10 characters"],
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    proposedPrice: {
      type: Number,
      required: [true, "Proposed price is required"],
      min: [1, "Proposed price must be atleast Rs.1"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "hired", "rejected"],
        message: "{VALUE} is not a valid bid status",
      },
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

BidSchema.index({ gigId: 1, status: 1 });
BidSchema.index({ freelancerId: 1, status: 1 });
BidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

BidSchema.index({ gigId: 1, _id: 1 });

BidSchema.methods.isOwner = function (userId) {
  return this.freelancerId.toString() === userId.toString();
};

BidSchema.statics.hasUserBid = async function(gigId, userId) {
  const bid = await this.findOne({ gigId, freelancerId: userId });
  return !!bid;
};

module.exports = mongoose.model("Bid", BidSchema);
