const db = require("../../config/db");

const getAllPitchSchedules = async (req, res) => {
    try {
        const [pitchSchedules] = await db.execute("SELECT * FROM pitchschedules");
        res.status(200).json({
            status: 200,
            message: "Lấy danh sách lịch hoạt động sân thành công",
            data: pitchSchedules
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
};

const getPitchScheduleById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute("SELECT * FROM pitchschedules WHERE id = ?", [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Lịch hoạt động không tồn tại",
                data: null
            });
        }

        res.status(200).json({
            status: 200,
            message: "Lấy chi tiết lịch hoạt động thành công",
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
};

const createPitchSchedule = async (req, res) => {
    try {
        const { pitch_id, date_of_week, open_time, close_time, slot_duration_minutes, price_override, is_active } = req.body;

        if (pitch_id === undefined || date_of_week === undefined || open_time === undefined || close_time === undefined || slot_duration_minutes === undefined) {
            return res.status(400).json({
                status: 400,
                message: "pitch_id, date_of_week, open_time, close_time và slot_duration_minutes là bắt buộc",
                data: null
            });
        }

        const query = `
            INSERT INTO pitchschedules 
            (pitch_id, date_of_week, open_time, close_time, slot_duration_minutes, price_override, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const overridePrice = price_override !== undefined ? price_override : null;
        const activeStatus = is_active !== undefined ? is_active : 1;

        const [result] = await db.execute(query, [pitch_id, date_of_week, open_time, close_time, slot_duration_minutes, overridePrice, activeStatus]);

        res.status(201).json({
            status: 201,
            message: "Tạo lịch hoạt động sân thành công",
            data: {
                id: result.insertId,
                pitch_id,
                date_of_week,
                open_time,
                close_time,
                slot_duration_minutes,
                price_override: overridePrice,
                is_active: activeStatus
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
};

const updatePitchSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { pitch_id, date_of_week, open_time, close_time, slot_duration_minutes, price_override, is_active } = req.body;

        const fields = [];
        const values = [];

        if (pitch_id !== undefined) {
            fields.push("pitch_id = ?");
            values.push(pitch_id);
        }
        if (date_of_week !== undefined) {
            fields.push("date_of_week = ?");
            values.push(date_of_week);
        }
        if (open_time !== undefined) {
            fields.push("open_time = ?");
            values.push(open_time);
        }
        if (close_time !== undefined) {
            fields.push("close_time = ?");
            values.push(close_time);
        }
        if (slot_duration_minutes !== undefined) {
            fields.push("slot_duration_minutes = ?");
            values.push(slot_duration_minutes);
        }
        if (price_override !== undefined) {
            fields.push("price_override = ?");
            values.push(price_override);
        }
        if (is_active !== undefined) {
            fields.push("is_active = ?");
            values.push(is_active);
        }

        if (fields.length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Phải cung cấp ít nhất một trường để cập nhật",
                data: null
            });
        }

        const sql = `UPDATE pitchschedules SET ${fields.join(", ")} WHERE id = ?`;
        const [result] = await db.execute(sql, [...values, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "Lịch hoạt động không tồn tại",
                data: null
            });
        }

        res.status(200).json({
            status: 200,
            message: "Cập nhật lịch hoạt động sân thành công",
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
};

const deletePitchSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute("DELETE FROM pitchschedules WHERE id = ?", [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "Lịch hoạt động không tồn tại",
                data: null
            });
        }
        
        res.status(200).json({
            status: 200,
            message: "Xóa lịch hoạt động sân thành công",
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
};

module.exports = {
    getAllPitchSchedules,
    getPitchScheduleById,
    createPitchSchedule,
    updatePitchSchedule,
    deletePitchSchedule
};
