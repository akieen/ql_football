const db = require("../../config/db");

const getAllBookings = async (req, res) => {
    try {
        const [bookings] = await db.execute(`
            SELECT b.*, u.full_name, u.email,
                   p.name AS pitch_name, p.price_per_hour,
                   br.name_branch, br.address
            FROM bookings b
            LEFT JOIN users u ON b.user_id = u.id
            LEFT JOIN pitches p ON b.pitch_id = p.id
            LEFT JOIN branches br ON p.branch_id = br.id
            ORDER BY b.createdAt DESC
        `);
        res.status(200).json({ status: 200, message: "Lấy danh sách đặt sân thành công", data: bookings });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
};

const getBookedSlotsByPitch = async (req, res) => {
    try {
        const { pitch_id } = req.params;
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ status: 400, message: "Thiếu tham số date", data: null });
        }
        const [slots] = await db.execute(
            `SELECT id, start_time, end_time, status
             FROM bookings
             WHERE pitch_id = ?
               AND booking_date = ?
               AND status IN ('pending', 'confirmed')
             ORDER BY start_time ASC`,
            [pitch_id, date]
        );
        res.status(200).json({ status: 200, message: "Lấy giờ đã đặt thành công", data: slots });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
};


const getUserBookings = async (req, res) => {
    try {
        const { user_id } = req.params;
        const [bookings] = await db.execute(`
            SELECT b.*, p.name AS pitch_name, p.image_url,
                   br.name_branch, br.address
            FROM bookings b
            LEFT JOIN pitches p ON b.pitch_id = p.id
            LEFT JOIN branches br ON p.branch_id = br.id
            WHERE b.user_id = ?
            ORDER BY b.createdAt DESC
        `, [user_id]);
        res.status(200).json({ status: 200, message: "Lấy lịch sử đặt sân thành công", data: bookings });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
};

const createBooking = async (req, res) => {
    try {
        const { user_id, pitch_id, booking_date, start_time, end_time, total_price, promotion_id } = req.body;
        if (!user_id || !pitch_id || !booking_date || !start_time || !end_time || !total_price) {
            return res.status(400).json({ status: 400, message: "Thiếu thông tin bắt buộc", data: null });
        }

        // ── Kiểm tra trùng lịch ──────────────────────────────────────────
        const [conflicts] = await db.execute(
            `SELECT id FROM bookings
             WHERE pitch_id = ?
               AND booking_date = ?
               AND status IN ('pending', 'confirmed')
               AND start_time < ?
               AND end_time   > ?`,
            [pitch_id, booking_date, end_time, start_time]
        );
        if (conflicts.length > 0) {
            return res.status(409).json({
                status: 409,
                message: "Khung giờ này đã được đặt. Vui lòng chọn giờ khác.",
                data: null
            });
        }
        // ────────────────────────────────────────────────────────────────

        const [result] = await db.execute(
            `INSERT INTO bookings (user_id, pitch_id, booking_date, start_time, end_time, total_price, promotion_id, status, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
            [user_id, pitch_id, booking_date, start_time, end_time, total_price, promotion_id || null]
        );
        res.status(201).json({
            status: 201,
            message: "Đặt sân thành công",
            data: { id: result.insertId, user_id, pitch_id, booking_date, start_time, end_time, total_price, status: 'pending' }
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ status: 400, message: "Trạng thái không hợp lệ", data: null });
        }
        const [result] = await db.execute("UPDATE bookings SET status = ?, updatedAt = NOW() WHERE id = ?", [status, id]);
        if (result.affectedRows === 0) return res.status(404).json({ status: 404, message: "Booking không tồn tại", data: null });
        res.status(200).json({ status: 200, message: "Cập nhật trạng thái thành công" });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute("DELETE FROM bookings WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ status: 404, message: "Booking không tồn tại", data: null });
        res.status(200).json({ status: 200, message: "Hủy đặt sân thành công" });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message, data: null });
    }
};

module.exports = { getAllBookings, getBookedSlotsByPitch, getUserBookings, createBooking, updateBookingStatus, deleteBooking };

