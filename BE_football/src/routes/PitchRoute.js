const express = require("express");
const { getAllPitches, createPitch, updatePitch, deletePitch } = require("../controllers/Admin/PitchController");
const upload = require("../config/multer");

const router = express.Router();
router.get("/", getAllPitches);
router.post("/", upload.single("image_url"), createPitch);
router.put("/:id", upload.single("image_url"), updatePitch);
router.delete("/:id", deletePitch);

module.exports = router;