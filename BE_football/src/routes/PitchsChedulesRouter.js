const express = require("express");
const router = express.Router();
const { getAllPitchSchedules, getPitchScheduleById, createPitchSchedule, updatePitchSchedule, deletePitchSchedule } = require("../controllers/Admin/PitchsChedulesController");

router.get("/", getAllPitchSchedules);
router.get("/:id", getPitchScheduleById);
router.post("/", createPitchSchedule);
router.put("/:id", updatePitchSchedule);
router.delete("/:id", deletePitchSchedule);

module.exports = router;