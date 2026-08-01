import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(express.urlencoded({ extended: true }));

// Make uploaded images accessible
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// Mount post routes
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "AllTrail API is running",
    });
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB connection error:",
            error.message
        );
    });
