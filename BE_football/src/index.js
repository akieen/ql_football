const express = require("express");
const path = require("path");
const db = require("./config/db");

const app = express();
// CORS middleware  
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Import routes
const authRoutes = require("./routes/AuthRoute");
const branchRoutes = require("./routes/BranchRoute");
const pitchRoutes = require("./routes/PitchRoute");


app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1");
        res.json({ status: 200, message: "✅ Kết nối DB thành công", data: rows });
    } catch (err) {
        console.error("❌ DB error:", err.message);
        res.status(500).json({ status: 500, message: err.message, data: null });
    }
});
// duong dan API
app.use("/api/auth", authRoutes);
app.use("/api/branches",branchRoutes); 
app.use("/api/pitches", pitchRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});