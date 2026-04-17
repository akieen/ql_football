const express = require("express");
const { getAllServices, getServiceById, createService, updateService, deleteService } = require("../controllers/Admin/ServicesController");
const upload = require("../config/multer");

const router = express.Router();
router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/",upload.single("image_url"), createService);
router.put("/:id",upload.single("image_url"), updateService);
router.delete("/:id", deleteService);

module.exports = router;