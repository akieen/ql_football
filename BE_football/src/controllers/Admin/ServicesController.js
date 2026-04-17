const db = require("../../config/db");
const fs = require("fs");
const path = require("path");
// Lấy danh sách tất cả các services
const getAllServices = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM services');
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách services:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Lấy chi tiết service theo id
const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM services WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy service" });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết service:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Thêm mới service
const createService = async (req, res) => {
    try {
        const { pitch_id, name, description, price } = req.body;

        const image_url = req.file ? `uploads/${req.file.filename}` : null;

        // createdAt và updatedAt thường được tự động set nếu thiết lập trong DB.
        const [result] = await db.query(
            'INSERT INTO services (pitch_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?)',
            [pitch_id, name, description, price, image_url]
        );

        res.status(201).json({
            success: true,
            message: "Thêm mới service thành công",
            data: {
                id: result.insertId,
                pitch_id,
                name,
                description,
                price,
                image_url
            }
        });
    } catch (error) {
        console.error("Lỗi khi thêm mới service:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Cập nhật service
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { pitch_id, name, description, price } = req.body;
        const image_url = req.file ? `uploads/${req.file.filename}` : null;


        const fields = [];
        const values = [];

        if (pitch_id !== undefined) {
            fields.push("pitch_id = ?");
            values.push(pitch_id);
        }
        if (name !== undefined) {
            fields.push("name = ?");
            values.push(name);
        }
        if (description !== undefined) {
            fields.push("description = ?");
            values.push(description);
        }
        if (price !== undefined) {
            fields.push("price = ?");
            values.push(price);
        }

        if (image_url) {
            fields.push("image_url = ?");
            values.push(image_url);
        }

        if (fields.length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Phải cung cấp ít nhất một trường để cập nhật",
                data: null
            });
        }

        const sql = `UPDATE services SET ${fields.join(", ")} WHERE id = ?`;
        const [result] = await db.execute(sql, [...values, id]);


        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy service để cập nhật" });
        }

        res.status(200).json({
            success: true,
            message: "Cập nhật service thành công"
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật service:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Xóa service
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM services WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy service để xóa" });
        }

        res.status(200).json({
            success: true,
            message: "Xóa service thành công"
        });
    } catch (error) {
        console.error("Lỗi khi xóa service:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};
