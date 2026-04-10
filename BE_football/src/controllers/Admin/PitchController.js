const fs = require("fs");
const path = require("path");
const db = require("../../config/db");
const getAllPitches = async (req, res) => {
    try {
        const [pitches] = await db.execute("SELECT * FROM pitches");   
        res.status(200).json({
            status: 200,
            message: "Lấy danh sách sân thành công",
            data: pitches
        });
    } catch (error) {
        res.status(500).json({
            status: 500,   
            message: error.message,
            data: null
        });
    }
};
const createPitch = async (req, res) => {
    try {
        const { branch_id, name, description, price_per_hour } = req.body;

        if (branch_id === undefined || name === undefined || price_per_hour === undefined) {
            return res.status(400).json({
                status: 400,
                message: "branch_id, name và price_per_hour là bắt buộc",
                data: null
            });
        }

        // lấy đường dẫn ảnh trả về dạng uploads/... để client dễ hiển thị
        const image_url = req.file ? `uploads/${req.file.filename}` : null;

        await db.execute(
            "INSERT INTO pitches (branch_id, name, description, price_per_hour, image_url) VALUES (?, ?, ?, ?, ?)",
            [branch_id, name, description, price_per_hour, image_url]
        );

        res.status(201).json({
            status: 201,
            message: "Tạo sân thành công",
            data: {
                branch_id,
                name,
                description,
                price_per_hour,
                image_url
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
const updatePitch = async (req, res) => {
    try {
        const { id } = req.params;
        const { branch_id, name, description, price_per_hour, status } = req.body;
        const image_url = req.file ? `uploads/${req.file.filename}` : undefined;

        const fields = [];
        const values = [];

        if (branch_id !== undefined) {
            fields.push("branch_id = ?");
            values.push(branch_id);
        }
        if (name !== undefined) {
            fields.push("name = ?");
            values.push(name);
        }
        if (description !== undefined) {
            fields.push("description = ?");
            values.push(description);
        }
        if (price_per_hour !== undefined) {
            fields.push("price_per_hour = ?");
            values.push(price_per_hour);
        }
        if (status !== undefined) {
            fields.push("status = ?");
            values.push(status);
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

        const sql = `UPDATE pitches SET ${fields.join(", ")} WHERE id = ?`;
        const [result] = await db.execute(sql, [...values, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "Sân không tồn tại",
                data: null
            });
        }

        res.status(200).json({
            status: 200,
            message: "Cập nhật sân thành công",
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
};
const deletePitch = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute("SELECT image_url FROM pitches WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Sân không tồn tại",
                data: null
            });
        }

        const image_url = rows[0].image_url;
        if (image_url) {
            const imagePath = path.isAbsolute(image_url)
                ? image_url
                : path.join(__dirname, "..", "..", "..", image_url);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        const [result] = await db.execute(
            "DELETE FROM pitches WHERE id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "Sân không tồn tại",
                data: null
            });
        }
        res.status(200).json({
            status: 200,
            message: "Xóa sân thành công",
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
    getAllPitches,
    createPitch,
    updatePitch,
    deletePitch
};