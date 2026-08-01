import { adminAuth } from "../config/firebaseAdmin.js";
import User from "../models/user.js";
import { generateToken } from "../utils/generateToken.js";

export async function googleLogin(req, res) {
    try {
        const { firebaseToken } = req.body;

        if (
            !firebaseToken ||
            typeof firebaseToken !== "string"
        ) {
            return res.status(400).json({
                message: "Firebase token is required",
            });
        }

        // Confirms that the token was signed by Firebase,
        // is valid and has not expired.
        const decodedToken =
            await adminAuth.verifyIdToken(firebaseToken);

        const firebaseUid = decodedToken.uid;
        const email = decodedToken.email;
        const name =
            decodedToken.name ||
            email?.split("@")[0] ||
            "User";
        const profileImage =
            decodedToken.picture || "";

        if (!email) {
            return res.status(400).json({
                message:
                    "Your Google account did not provide an email address",
            });
        }

        /*
         * First search by Firebase UID.
         * Email fallback handles an existing account that may have
         * been created earlier through a different login flow.
         */
        let user = await User.findOne({
            $or: [
                { firebaseUid },
                { email: email.toLowerCase() },
            ],
        });

        let isNewUser = false;

        if (!user) {
            isNewUser = true;

            user = await User.create({
                firebaseUid,
                name,
                email: email.toLowerCase(),
                profileImage,
                provider: "google",
                lastLoginAt: new Date(),
            });
        } else {
            user.firebaseUid = firebaseUid;
            user.name = name;
            user.email = email.toLowerCase();
            user.profileImage =
                profileImage || user.profileImage;
            user.provider = "google";
            user.lastLoginAt = new Date();

            await user.save();
        }

        const token = generateToken(user._id.toString());

        return res.status(isNewUser ? 201 : 200).json({
            message: isNewUser
                ? "Account created successfully"
                : "Login successful",

            isNewUser,

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        console.error("Google login error:", error);

        if (
            error.code ===
            "auth/id-token-expired"
        ) {
            return res.status(401).json({
                message:
                    "Google login expired. Please sign in again.",
            });
        }

        if (
            error.code ===
            "auth/argument-error"
        ) {
            return res.status(401).json({
                message: "Invalid Google login token",
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message:
                    "An account already exists with this email",
            });
        }

        return res.status(500).json({
            message: "Could not complete Google login",
        });
    }
}
