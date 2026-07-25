import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
    try {
        const authorization =
            req.headers.authorization;

        if (
            !authorization?.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message: "Please log in first",
            });
        }

        const token = authorization
            .split(" ")[1]
            ?.trim();

        if (!token) {
            return res.status(401).json({
                message: "Authentication token is missing",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(
            decoded.userId
        ).select("-__v");

        if (!user) {
            return res.status(401).json({
                message: "User account no longer exists",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            message:
                error.name === "TokenExpiredError"
                    ? "Your session expired. Please log in again."
                    : "Invalid authentication token",
        });
    }
}