const mongoose = require("mongoose");
const db = require("../models");
const asyncHandler = require("../middleware/asyncHandler");
const {
  ValidationError,
  NotFoundError,
  AuthorizationError,
  ConflictError,
} = require("../utils/error.utils");

const Bid = db.bid;
const Gig = db.gig;

/**
 * @description Submit a bid for a gig
 * @route POST /api/bids
 * @access Private
 */

exports.createBid = asyncHandler(async (req, res) => {
  const { gigId, message, proposedPrice } = req.body;

  if (!gigId || !message || !proposedPrice) {
    throw new ValidationError("Please provide gig, message and proposed price");
  }

  if (isNaN(proposedPrice) || proposedPrice <= 0) {
    throw new ValidationError("Proposed price must be a positive number");
  }

  // Find the gig
  const gig = await Gig.findById(gigId);

  if (!gig) {
    throw new NotFoundError("Gig not found");
  }

  // Check if gig is still open
  if (gig.status !== "open") {
    throw new ValidationError(
      "This gig is no longer accepting bids. It has been assigned"
    );
  }

  // Prevent user from bidding on their own gig
  if (gig.isOwner(req.user._id)) {
    throw new ValidationError("You cannot bid on your own gig");
  }

  // Check if user has already bid on this gig
  const existingBid = await Bid.findOne({
    gigId,
    freelancerId: req.user._id,
  });

  if (existingBid) {
    throw new ConflictError("");
  }

  // Create new bid
  const newBid = await Bid.create({
    gigId,
    freelancerId: req.user._id,
    message: message.trim(),
    proposedPrice: parseFloat(proposedPrice),
    status: "pending",
  });

  await newBid.populate("freelancerId", "name email avatar");
  await newBid.populate("gigId", "title budget");

  res.status(201).send({
    message: "Bid submitted successfully",
    type: "success",
    bid: newBid,
  });
});

/**
 * @description Get all bids for a specific gig
 * @route GET /api/bids/:gigId
 * @access Private (Gig Owner only)
 */

exports.getBidsByGig = asyncHandler(async (req, res) => {
  const { gigId } = req.params;
  const { includeRejected = "false" } = req.query;

  // Find the gig
  const gig = await Gig.findById(gigId);

  if (!gig) {
    throw new NotFoundError("Gig not found");
  }

  // Check if user is the gig owner
  if (!gig.isOwner(req.user._id)) {
    throw new AuthorizationError(
      "You are not authorized to view bids for this gig"
    );
  }

  // Build query
  const query = { gigId };

  // Exclude rejectedbids
  if (includeRejected === "false") {
    query.status = { $ne: "rejected" };
  }

  // Get all bids
  const bids = await Bid.find(query)
    .populate("freelancerId", "name email avatar")
    .sort({ createdAt: -1 });

  res.status(200).send({
    message: "Bids fetched successfully",
    type: "success",
    bids,
    gig: {
      _id: gig._id,
      title: gig.title,
      status: gig.status,
    },
  });
});

/**
 * @desc    Get user's bids (as a freelancer)
 * @route   GET /api/bids/my-bids
 * @access  Private
 */

exports.getMyBids = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const query = { freelancerId: req.user._id };

  if (status && ["pending", "hired", "rejected"].includes(status)) {
    query.status = status;
  }

  const bids = await Bid.find(query)
    .populate("gigId", "title description budget status")
    .populate({
      path: "gigId",
      populate: {
        path: "ownerId",
        select: "name email avatar",
      },
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: "Your bids fetched successfully",
    type: "success",
    bids,
  });
});

/**
 * @desc    Update a bid (edit proposal)
 * @route   PATCH /api/bids/:id
 * @access  Private (Bid owner only)
 */

exports.updateBid = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message, proposedPrice } = req.body;

  // Find bid
  const bid = await Bid.findById(id);

  if (!bid) {
    throw new NotFoundError("Bid not found");
  }

  // Check ownership
  if (!bid.isOwner(req.user._id)) {
    throw new AuthorizationError("You are not authorized to update this bid");
  }

  // Check if bid can still be modified
  if (bid.status !== "pending") {
    throw new ValidationError(
      `Cannot update a ${bid.status} bid. Only pending bids can be modified.`
    );
  }

  // Update fields
  if (message) bid.message = message.trim();
  if (proposedPrice) {
    if (isNaN(proposedPrice) || proposedPrice <= 0) {
      throw new ValidationError("Proposed price must be a positive number");
    }
    bid.proposedPrice = parseFloat(proposedPrice);
  }

  await bid.save();
  await bid.populate("freelancerId", "name email avatar");
  await bid.populate("gigId", "title budget");

  res.status(200).json({
    message: "Bid updated successfully",
    type: "success",
    bid,
  });
});

/**
 * @desc    Delete/Withdraw a bid
 * @route   DELETE /api/bids/:id
 * @access  Private (Bid owner only)
 */

exports.deleteBid = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find bid
  const bid = await Bid.findById(id);

  if (!bid) {
    throw new NotFoundError("Bid not found");
  }

  // Check ownership
  if (!bid.isOwner(req.user._id)) {
    throw new AuthorizationError("You are not authorized to delete this bid");
  }

  // Check if bid can be deleted
  if (bid.status === "hired") {
    throw new ValidationError(
      "Cannot withdraw a hired bid. Please contact the gig owner."
    );
  }

  await bid.deleteOne();

  res.status(200).json({
    message: "Bid withdrawn successfully",
    type: "success",
  });
});

/**
 * @description Hire a freelancer (Accept a bid) - WITH TRANSACTION
 * @route PATCH /api/bids/:bidId/hire
 * @access Private (Gig owner only)
 */

exports.hireBid = asyncHandler(async (req, res) => {
  const { bidId } = req.params;

  // Start a MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find a bid with session
    const bid = await Bid.findById(bidId).session(session);

    if (!bid) {
      await session.abortTransaction();
      throw new NotFoundError("Bid not found");
    }

    // Find the gig with session
    const gig = await Gig.findById(bid.gigId).session(session);

    if (!gig) {
      await session.abortTransaction();
      throw new NotFoundError("Gig not found");
    }

    // Verify the user is the gig owner
    if (!gig.isOwner(req.user._id)) {
      throw new AuthorizationError(
        "You are not authorized to hire for this gig"
      );
    }

    if (gig.status === "assigned") {
      await session.abortTransaction();
      throw new ConflictError(
        "This gig has already been assigned to another freelancer"
      );
    }

    if (bid.status !== "pending") {
      await session.abortTransaction();
      throw new ValidationError(
        `Cannot hire this bid. Current status: ${bid.status}`
      );
    }

    // Update this gig status to "assigned" (ATOMIC TRANSACTION)
    const updatedGig = await Gig.findByIdAndUpdate(
      gig._id,
      { status: "assigned" },
      {
        new: true,
        session,
        runValidators: true,
      }
    );

    if (!updatedGig) {
      await session.abortTransaction();
      throw new Error("Failed to update gig status");
    }

    const updatedBid = await Bid.findByIdAndUpdate(
      bid._id,
      { status: "hired" },
      {
        new: true,
        session,
        runValidators: true,
      }
    );

    if (!updatedBid) {
      await session.abortTransaction();
      throw new Error("Failed to update bid status");
    }

    // Reject all bids except hired freelancer's bid
    const rejectedBids = await Bid.updateMany(
      {
        gigId: gig._id,
        _id: { $ne: bid._id },
        status: "pending",
      },
      {
        status: "rejected",
      },
      {
        session,
      }
    );

    await session.commitTransaction();

    await updatedBid.populate("freelancerId", "name email avatar");
    await updatedBid.populate("gigId", "title description budget");

    if (req.app.io) {
      req.app.io.to(`user-${bid.freelancerId}`).emit("bid-hired", {
        gigTitle: gig.title,
        bidId: bid._id,
        message: `Congratulations! You have been hired for ${gig.title}`,
      });
    }

    res.status(200).send({
      message: "Freelancer hired successfully",
      type: "success",
      bid: updatedBid,
      gig: updatedGig,
      rejectedCount: rejectedBids.modifiedCount,
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
