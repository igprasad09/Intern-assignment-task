const express = require("express");
const cors = require("cors");
const pool = require("./db");
const GeneratingProducts = require("./routes/generate");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/", GeneratingProducts);
app.use("/", require("./routes/app"));

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.get("/test", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM products");
        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = app;