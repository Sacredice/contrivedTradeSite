const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const verifyJWT = require("../../middleware/verifyJWT")


router
    .route("/:user")
    .get(verifyJWT, userController.getUserProfile)
    .patch(verifyJWT, userController.patchUserProfile)

router
    .route("/:user/markethistory")
    .get( verifyJWT, userController.getMarketHistoryPage )

module.exports = router;