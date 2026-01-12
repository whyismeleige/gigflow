const express = require("express");
const controller = require("../controllers/gigs.controller");
const { authenticateToken } = require("../middleware/auth.middleware")

const router = express.Router();

router.get("/", controller.getAllGigs) // Can be accessed without login
router.post("/", authenticateToken, controller.createGig); // Create New Gig
router.get("/my-gigs", authenticateToken, controller.getMyGigs); // Get User's Gigs
router.get("/:id", controller.getGigById) // Can be accessed without login
router.patch("/:id", authenticateToken, controller.updateGig); // Update existing Gig
router.delete("/:id", authenticateToken, controller.deleteGig); // Delete existing Gig

module.exports = router;