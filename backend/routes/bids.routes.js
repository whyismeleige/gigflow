const express = require("express");
const controller = require("../controllers/bids.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticateToken);

// Bid Crud Operations
router.post("/", controller.createBid); // Submit a bid
router.get("/my-bids", controller.getMyBids) // Get user's bids
router.get("/:gigId", controller.getBidsByGig) // Get all bids for a gig (owner only)
router.patch("/:id", controller.updateBid); // Update/edit a bid
router.delete("/:id", controller.deleteBid) // Withdraw a bid

// Hiring logic 
router.patch("/:bidId/hire", controller.hireBid); // Hire a freelancer

module.exports = router;