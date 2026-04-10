const db = require("../../config/db");

const getAllBranches = async (req, res) => {
    try {
        const [branches] = await db.execute("SELECT * FROM branches");
        res.status(200).json({
            status: 200,
            message: "Lấy danh sách chi nhánh thành công",
            data: branches
        });
    } catch (error) {
        res.status(500).json({
            status: 500,    
            message: error.message,
            data: null
        });
    }   
};
const createBranch = async (req, res) => {
    try {
        const { user_id,name_branch	, address,phone } = req.body;
        const [result] = await db.execute(
            "INSERT INTO branches (user_id,name_branch, address, phone) VALUES (?, ?, ?, ?)",
            [user_id,name_branch, address, phone]
        );
        res.status(201).json({
            status: 201,
            message: "Tạo chi nhánh thành công",
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
};
const updateBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const { name_branch, address, phone } = req.body;
        const [result] = await db.execute(
            "UPDATE branches SET name_branch = ?, address = ?, phone = ? WHERE id = ?",
            [name_branch, address, phone, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "Chi nhánh không tồn tại",
                data: null
            });
        }
        res.status(200).json({
            status: 200,
            message: "Cập nhật chi nhánh thành công",
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }


};

const deleteBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute(
            "DELETE FROM branches WHERE id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "Chi nhánh không tồn tại",
                data: null
            });
        }
        res.status(200).json({
            status: 200,
            message: "Xóa chi nhánh thành công",
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
    getAllBranches,
    createBranch,
    updateBranch,
    deleteBranch
}