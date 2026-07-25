import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firebaseUid: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        profileImage: {
            type: String,
            default: "",
        },

        provider: {
            type: String,
            default: "google",
        },

        lastLoginAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);