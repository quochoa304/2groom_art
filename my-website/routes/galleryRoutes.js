const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/galleryController");
const { getImageById } = require("../controllers/galleryController");

router.get("/notion-images/:id", getImageById);
router.get("/", galleryController.getGallery);

module.exports = router;
