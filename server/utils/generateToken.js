import jwt from "jsonwebtoken";

export function generateToken(userId) {
    if (!process.env.JWT_SECRET) {
        throw new Error(
            "JWT_SECRET is missing from the server environment"
        );
    }

    return jwt.sign(
        {
            userId,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
}