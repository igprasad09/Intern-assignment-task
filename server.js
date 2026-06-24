const express = require("express");
const cors = require("cors");
const pool = require("./db");
const GeneratingProducts = require("./routes/generate");
const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}))

app.use(express.json());
app.use("/", GeneratingProducts);
app.use("/", require("./routes/app"));


app.get("/", (req, res)=>{
    res.send("server is running");
});

app.get("/test", async (req, res)=>{
    try{
        const result = await pool.query(`SELECT * FROM products`);
        res.json(result.rows);
    }catch(err){
        console.log(err);
    }
})

app.listen(3000, ()=>{
    console.log("Server Started.....");
});