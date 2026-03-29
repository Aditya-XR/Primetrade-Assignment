import express from "express";
import 'dotenv/config'
import cors from "cors";
import connectDB from "./DB/db.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 7000;

//middlewares
//middleware setup
app.use(express.json({limit: "5mb"}));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(cookieParser());

app.use("/api/status", (req, res) => res.send("Server is running"));

connectDB()
.then(() => {
    app.listen(process.env.PORT || 7000, () => {
        console.log(`Server is running on port: ${process.env.PORT || 7000} //server.js`);
    })
})
.catch((err) => {
    console.log(" //server.js// MONGO DB connection failed !!!!", err);
})



app.use((err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal server error",
        errors: err.errors || [],
    });
});


export default app;
