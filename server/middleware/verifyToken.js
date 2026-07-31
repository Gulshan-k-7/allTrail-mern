import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
    try {
        const authorization = req.headers.authorization;

        if (
            !authorization ||
            !authorization.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message: "Authentication token is required.",
            });
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Authentication token is missing.",
            });
        }

        const decodedUser = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decodedUser;

        next();
    } catch (error) {
        console.error("TOKEN VERIFICATION ERROR:", error.message);

        return res.status(401).json({
            message: "Invalid or expired authentication token.",
        });
    }
}

export default verifyToken;