import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoute.js";
import placesRoutes from "./routes/places.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();

app.use(
    cors({
        origin:
            process.env.CLIENT_URL ||
            "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Server is working",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error(
                "MONGO_URI is missing from server/.env"
            );
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(
                `Server running on http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Server startup error:",
            error.message
        );

        process.exit(1);
    }
}

startServer();