import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        activityType: {
            type: String,
            enum: [
                "hiking",
                "trekking",
                "camping",
                "cycling",
                "walking",
                "climbing",
                "nature",
            ],
            required: true,
        },

        location: {
            name: {
                type: String,
                required: true,
            },

            latitude: {
                type: Number,
            },

            longitude: {
                type: Number,
            },
        },

        images: [
            {
                url: String,
                publicId: String,
            },
        ],

        difficulty: {
            type: String,
            enum: ["easy", "moderate", "hard", "expert"],
            default: "easy",
        },

        distanceKm: {
            type: Number,
            default: 0,
        },

        duration: {
            type: String,
            default: "",
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Post", postSchema);