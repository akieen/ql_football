const express = require("express");
const { getAllBranches, createBranch, updateBranch, deleteBranch } = require("../controllers/Admin/BranchController");

const router = express.Router();
router.get("/", getAllBranches);
router.post("/", createBranch);
router.put("/:id", updateBranch);
router.delete("/:id", deleteBranch);


module.exports = router;