const db = require("../models");
const asyncHandler = require("../middleware/asyncHandler");
const {
  ValidationError,
  AuthorizationError,
  NotFoundError,
} = require("../utils/error.utils");

const Gig = db.gig;
const Bid = db.bid;

/**
 * @description Get All Open gigs with optional search
 * @route GET /api/gigs
 * @access Public
 */

exports.getAllGigs = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 20 } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const query = { status: "open" };

  // Add text search if search query provided
  if (search && search.trim()) {
    query.$text = { $search: search.trim() };
  }

  const gigs = await Gig.find(query)
    .populate("ownerId", "name email avatar")
    .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
    .limit(limitNum)
    .skip(skip)
    .lean();

  // Get Total count for pagination
  const total = await Gig.countDocuments(query);

  res.status(200).send({
    message: "Gigs fetched successfully",
    type: "success",
    gigs,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalGigs: total,
      hasMore: skip + gigs.length < total,
    },
  });
});

/**
 * @description Get Single gig by Id
 * @route GET /api/gigs/:id
 * @access Public
 */

exports.getGigById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const gig = await Gig.findById(id);

  if (!gig) {
    throw new NotFoundError("Gig not found");
  }

  const bidCount = await Bid.countDocuments({
    gigId: gig._id,
    status: "pending",
  });

  let userHasBid = false;
  if (req.user) {
    userHasBid = await Bid.hasUserBid(gig._id, req.user._id);
  }

  res.status(200).json({
    message: "Gig fetched successfully",
    type: "success",
    gig: { ...gig.toObject(), bidCount, userHasBid },
  });
});

/**
 * @description Create a new gig
 * @route POST /api/gigs
 * @access Private
 */

exports.createGig = asyncHandler(async (req, res) => {
  const { title, description, budget } = req.body;

  if (!title || !description || budget) {
    throw new ValidationError("Please provide a title, description and budget");
  }

  if (isNaN(budget) || budget <= 0) {
    throw new ValidationError("Budget must be a positive number");
  }

  const newGig = await Gig.create({
    title,
    description,
    budget: parseFloat(budget),
    ownerId: req.user._id,
    status: "open",
  });

  await newGig.populate("ownerId", "name email avatar");

  res.status(201).send({
    message: "Gig created successfully",
    type: "success",
    gig: newGig,
  });
});

/**
 * @description Update a Gig
 * @route PATCH /api/gigs/:id
 * @access Private (Owner only)
 */

exports.updateGig = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, budget } = req.body;

  // Find gig
  const gig = await Gig.findById(id);

  if (!gig) {
    throw new NotFoundError("Gig not found");
  }

  // Check ownership
  if (!gig.isOwner(req.user._id)) {
    throw new AuthorizationError("You are not authorized to update this gig");
  }

  // Cannot update if gig is already assigned
  if (gig.status === "assigned") {
    throw new ValidationError("Cannot update an assigned gig");
  }

  // Update fields
  if (title) gig.title = title.trim();
  if (description) gig.description = description.trim();
  if (budget) {
    if (isNaN(budget) || budget <= 0) {
      throw new ValidationError("Budget must be a positive number");
    }
    gig.budget = parseFloat(budget);
  }

  await gig.save();
  await gig.populate("ownerId", "name email avatar");

  res.status(200).send({
    message: "Gig updated successfully",
    type: "success",
    gig,
  });
});

/**
 * @description Delete a gig
 * @route DELETE /api/gigs/:id
 * @access Private (Owner only)
 */

exports.deleteGig = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find gig
  const gig = await Gig.findById(id);

  if (!gig) {
    throw new NotFoundError("Gig not found");
  }

  // Check ownership
  if (!gig.isOwner(req.user._id)) {
    throw new AuthorizationError("You are not authorized to delete this gig");
  }

  if (gig.status === "assigned") {
    throw new ValidationError(
      "Cannot delete a gig that has been assigned. Please contact the freelancer"
    );
  }

  // Delete all associated bids
  await Bid.deleteMany({ gigId: gig._id });

  // Delete gig
  await gig.deleteOne();

  res.status(200).send({
    message: "Gig deleted successfully",
    type: "success",
  });
});

/**
 * @description Get user's posted gigs
 * @route GET /api/gigs/my-gigs
 * @access Private
 */

exports.getMyGigs = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const query = { ownerId: req.user._id };
  if (status && ["open", "assigned"].includes(status)) {
    query.status = status;
  }

  const gigs = await Gig.find(query)
    .populate("hiredFreelancerId", "name email avatar")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).send({
    message: "Your gigs fetched successfully",
    type: "success",
    gigs,
  });
});
