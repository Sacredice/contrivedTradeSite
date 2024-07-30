const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");


router
    .route("/:user")
    .get(userController.getUserProfile)
    .patch(userController.patchUserProfile)

router
    .get("/:user/markethistory", userController.getMarketHistoryPage )

module.exports = router;