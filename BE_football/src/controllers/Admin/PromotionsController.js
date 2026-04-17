const db = require("../../config/db");

const getAllPromotions = async (req, res) => {
    try {
        const [promotions] = await db.execute("SELECT * FROM promotions");
        res.status(200).json({
            status: 200,
            message: "Lấy danh sách khuyến mãi thành công",
            data: promotions
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
};

const createPromotion = async (req, res) => {
    try {
        const { code, description, discount_type, discount_value, max_discount_amount, min_booking_amount, start_at, expires_at, usage_limit, is_active } = req.body;

        if (!code || !discount_type || discount_value === undefined) {
            return res.status(400).json({
                status: 400,
                message: "code, discount_type và discount_value là bắt buộc",
                data: null
            });
        }

        const createdAt = new Date();
        const updatedAt = new Date();
        const usage_count = 0;

        const [result] = await db.execute(
            `INSERT INTO promotions (
                code, description, discount_type, discount_value, max_discount_amount, 
                min_booking_amount, start_at, expires_at, usage_limit, usage_count, is_active, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                code, description || null, discount_type, discount_value, max_discount_amount || null,
                min_booking_amount || null, start_at || null, expires_at || null, usage_limit || null, usage_count,
                is_active !== undefined ? is_active : 1, createdAt, updatedAt
            ]
        );

        res.status(201).json({
            status: 201,
            message: "Tạo khuyến mãi thành công",
            data: {
                id: result.insertId,
                code, description, discount_type, discount_value, max_discount_amount,
                min_booking_amount, start_at, expires_at, usage_limit, usage_count, is_active
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

const updatePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, description, discount_type, discount_value, max_discount_amount, min_booking_amount, start_at, expires_at, usage_limit, is_active } = req.body;

        const fields = [];
        const values = [];

        if (code !== undefined) { fields.push("code = ?"); values.push(code); }
        if (description !== undefined) { fields.push("description = ?"); values.push(description); }
        if (discount_type !== undefined) { fields.push("discount_type = ?"); values.push(discount_type); }
        if (discount_value !== undefined) { fields.push("discount_value = ?"); values.push(discount_value); }
        if (max_discount_amount !== undefined) { fields.push("max_discount_amount = ?"); values.push(max_discount_amount); }
        if (min_booking_amount !== undefined) { fields.push("min_booking_amount = ?"); values.push(min_booking_amount); }
        if (start_at !== undefined) { fields.push("start_at = ?"); values.push(start_at); }
        if (expires_at !== undefined) { fields.push("expires_at = ?"); values.push(expires_at); }
        if (usage_limit !== undefined) { fields.push("usage_limit = ?"); values.push(usage_limit); }
        if (is_active !== undefined) { fields.push("is_active = ?"); values.push(is_active); }

        if (fields.length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Phải cung cấp ít nhất một trường để cập nhật",
                data: null
            });
        }

        fields.push("updatedAt = ?");
        values.push(new Date());

        const sql = `UPDATE promotions SET ${fields.join(", ")} WHERE id = ?`;
        const [result] = await db.execute(sql, [...values, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "Khuyến mãi không tồn tại",
                data: null
            });
        }

        res.status(200).json({
            status: 200,
            message: "Cập nhật khuyến mãi thành công",
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
};

const deletePromotion = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.execute("DELETE FROM promotions WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "Khuyến mãi không tồn tại",
                data: null
            });
        }
        res.status(200).json({
            status: 200,
            message: "Xóa khuyến mãi thành công",
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
    getAllPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion
};
