const express = require("express");
const router = express.Router();
const { getAllPromotions, createPromotion, updatePromotion, deletePromotion } = require("../controllers/Admin/PromotionsController");

router.get("/", getAllPromotions);
router.post("/", createPromotion);
router.put("/:id", updatePromotion);
router.delete("/:id", deletePromotion);

module.exports = router;