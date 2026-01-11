const router = require("express").Router();
const controller = require("../controllers/bids.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

router.use("")

router.post("/login", controller.login);
router.post("/register", controller.register);
router.post("/logout", authenticateToken, controller.logout);

module.exports = router;