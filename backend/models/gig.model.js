const mongoose = require("mongoose");

const GigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Gig title is required"],
      trim: true,
      minlength: [5, "Title must be atleast 5 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Gig description is required"],
      trim: true,
      minlength: [20, "Description must be atleast 20 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [1, "Budget must be atleast Rs.1"],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner Id is required"],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["open", "assigned"],
        message: "{VALUE} is not a valid status",
      },
      default: "open",
      index: true,
    },
    hiredFreelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

GigSchema.index({ title: "text", description: "text" });
GigSchema.index({ status: 1, createdAt: -1 });

GigSchema.virtual("bids", {
  ref: "Bid",
  localField: "_id",
  foreignField: "gigId",
});

GigSchema.virtual("bidCount", {
  ref: "Bid",
  localField: "_id",
  foreignField: "gigId",
  count: true,
});

GigSchema.methods.isOwner = function (userId) {
  return this.ownerId.toString() === userId.toString();
};

GigSchema.methods.canAcceptBids = function () {
  return this.status === "open";
};

module.exports = mongoose.model("Gig", GigSchema);
