import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        images: {
            type: [String],
            required: true,
            validate: {
                validator(images) {
                    return images.length >= 1 && images.length <= 6;
                },
                message: "A post must contain between 1 and 6 images.",
            },
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        userName: {
            type: String,
            default: "Trail Explorer",
            trim: true,
        },

        userPhoto: {
            type: String,
            default: "",
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        comments: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                userName: String,
                text: {
                    type: String,
                    trim: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Post =
    mongoose.models.Post ||
    mongoose.model("Post", postSchema);

export default Post;