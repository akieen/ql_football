const express = require("express");
const router = express.Router();
const { getAllBookings, getUserBookings, createBooking, updateBookingStatus, deleteBooking } = require("../controllers/User/BookingController");

router.get("/", getAllBookings);
router.get("/user/:user_id", getUserBookings);
router.post("/", createBooking);
router.put("/:id/status", updateBookingStatus);
router.delete("/:id", deleteBooking);

module.exports = router;
