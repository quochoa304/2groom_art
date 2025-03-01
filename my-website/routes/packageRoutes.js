const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");

router.get("/", packageController.getPackages);
router.get("/package-detail/:id", packageController.getPackageDetail);

module.exports = router;
