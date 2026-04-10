const db = require("../config/db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


   const register = async (req, res) => {
        try {
        const { full_name, password, email } = req.body;
        const [existingUser] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        if (existingUser.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "Tên email đã tồn tại",
                data: null
            });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [result] = await db.execute(
            "INSERT INTO users (full_name, password, email) VALUES (?, ?,  ?)",
            [full_name, hashedPassword, email]);

        const data = {
            user_id: result.insertId,
            full_name,
            email,
        };

        res.status(201).json({
            status: 201,
            message: "Đăng ký người dùng thành công",
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            data: null
        });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [user] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        if (user.length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Tên người dùng hoac mật khẩu không đúng",
                data: null
            });
        }

        const match = await bcrypt.compare(password, user[0].password);
        if (!match) {
            return res.status(400).json({
                status: 400,
                message: "Tên người dùng hoac mật khẩu không đúng",
                data: null
            });
        }

        const payload = {
            user_id: user[0].user_id,
            full_name: user[0].full_name,
            email: user[0].email,
            isAdmin: user[0].isAdmin
        };
        // console.log(payload);
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '10h' });

        const data = {
            user_id: user[0].user_id,
            full_name: user[0].full_name,
            email: user[0].email,
            avatar: user[0].avatar,
            isAdmin: user[0].isAdmin
        };

        res.status(200).json({
            status: 200,
            message: "Đăng nhập thành công",
            data,
            token: token
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
    register,
    login,
   
};