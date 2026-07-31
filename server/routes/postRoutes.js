import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import Post from "../models/Post.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDirectory = path.join(
    __dirname,
    "../uploads"
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true,
    });
}

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, uploadDirectory);
    },

    filename(req, file, callback) {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;

        callback(null, uniqueName);
    },
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
        callback(null, true);
    } else {
        callback(
            new Error("Only image files are allowed."),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 6,
    },
});
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json(posts);
    } catch (error) {
        console.error("FETCH POSTS ERROR:", error);

        return res.status(500).json({
            message: "Could not fetch posts.",
        });
    }
});
router.get(
    "/my-posts",
    verifyToken,
    async (req, res) => {
        try {
            const userId =
                req.user?.id ||
                req.user?._id ||
                req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                    message: "User information is missing.",
                });
            }

            const posts = await Post.find({ userId })
                .sort({ createdAt: -1 })
                .lean();

            return res.status(200).json(posts);
        } catch (error) {
            console.error("MY POSTS ERROR:", error);

            return res.status(500).json({
                message: "Could not fetch your posts.",
            });
        }
    }
);

// Get one post for editing
router.get(
    "/:postId",
    verifyToken,
    async (req, res) => {
        try {
            const userId =
                req.user?.id ||
                req.user?._id ||
                req.user?.userId;

            const post = await Post.findById(
                req.params.postId
            ).lean();

            if (!post) {
                return res.status(404).json({
                    message: "Post not found.",
                });
            }

            if (
                post.userId.toString() !==
                userId.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You cannot edit another user's post.",
                });
            }

            return res.status(200).json(post);
        } catch (error) {
            console.error("GET POST ERROR:", error);

            return res.status(500).json({
                message: "Could not fetch the post.",
            });
        }
    }
);

// Update post
router.put(
    "/:postId",
    verifyToken,
    upload.array("images", 6),
    async (req, res) => {
        try {
            const userId =
                req.user?.id ||
                req.user?._id ||
                req.user?.userId;

            const post = await Post.findById(
                req.params.postId
            );

            if (!post) {
                removeUploadedFiles(req.files);

                return res.status(404).json({
                    message: "Post not found.",
                });
            }

            if (
                post.userId.toString() !==
                userId.toString()
            ) {
                removeUploadedFiles(req.files);

                return res.status(403).json({
                    message:
                        "You cannot edit another user's post.",
                });
            }

            const title =
                req.body.title?.trim();

            const location =
                req.body.location?.trim();

            const description =
                req.body.description?.trim();

            if (
                !title ||
                !location ||
                !description
            ) {
                removeUploadedFiles(req.files);

                return res.status(400).json({
                    message:
                        "Please provide all post details.",
                });
            }

            /*
             * existingImages must be sent by the frontend
             * as a JSON string:
             * ["old-image-1.jpg", "old-image-2.jpg"]
             */
            let existingImages = post.images || [];

            if (req.body.existingImages !== undefined) {
                try {
                    existingImages = JSON.parse(
                        req.body.existingImages
                    );

                    if (!Array.isArray(existingImages)) {
                        throw new Error();
                    }
                } catch {
                    removeUploadedFiles(req.files);

                    return res.status(400).json({
                        message:
                            "Existing image information is invalid.",
                    });
                }
            }

            /*
             * Prevent users from supplying filenames that
             * do not belong to this post.
             */
            const originalImages = post.images || [];

            existingImages = existingImages.filter(
                (image) =>
                    originalImages.includes(image)
            );

            const newImages = (req.files || []).map(
                (file) => file.filename
            );

            const finalImages = [
                ...existingImages,
                ...newImages,
            ];

            if (
                finalImages.length === 0 ||
                finalImages.length > 6
            ) {
                removeUploadedFiles(req.files);

                return res.status(400).json({
                    message:
                        "A post must contain between 1 and 6 images.",
                });
            }

            const removedImages =
                originalImages.filter(
                    (image) =>
                        !existingImages.includes(image)
                );

            post.title = title;
            post.location = location;
            post.description = description;
            post.images = finalImages;

            await post.save();

            removeStoredImages(removedImages);

            return res.status(200).json({
                message: "Post updated successfully.",
                post,
            });
        } catch (error) {
            console.error("UPDATE POST ERROR:", error);

            removeUploadedFiles(req.files);

            return res.status(500).json({
                message: "Could not update the post.",
                error: error.message,
            });
        }
    }
);

// Delete post
router.delete(
    "/:postId",
    verifyToken,
    async (req, res) => {
        try {
            const userId =
                req.user?.id ||
                req.user?._id ||
                req.user?.userId;

            const post = await Post.findById(
                req.params.postId
            );

            if (!post) {
                return res.status(404).json({
                    message: "Post not found.",
                });
            }

            if (
                post.userId.toString() !==
                userId.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You cannot delete another user's post.",
                });
            }

            const images = Array.isArray(post.images)
                ? post.images
                : post.image
                    ? [post.image]
                    : [];

            await post.deleteOne();

            removeStoredImages(images);

            return res.status(200).json({
                message: "Post deleted successfully.",
            });
        } catch (error) {
            console.error("DELETE POST ERROR:", error);

            return res.status(500).json({
                message: "Could not delete the post.",
            });
        }
    }
);
router.post(
    "/",
    verifyToken,
    upload.array("images", 6),
    async (req, res) => {
        try {
            const { title, location, description } = req.body;

            const userId =
                req.user?.id ||
                req.user?._id ||
                req.user?.userId;

            if (!title || !location || !description) {
                return res.status(400).json({
                    message: "Please provide all post details.",
                });
            }

            if (!req.files?.length) {
                return res.status(400).json({
                    message: "Please upload at least one image.",
                });
            }

            if (!userId) {
                return res.status(401).json({
                    message: "User information is missing.",
                });
            }

            const post = await Post.create({
                title: title.trim(),
                location: location.trim(),
                description: description.trim(),
                images: req.files.map((file) => file.filename),
                userId,
                userName: req.user?.name || "Trail Explorer",
                userPhoto:
                    req.user?.photoURL ||
                    req.user?.picture ||
                    "",
            });

            return res.status(201).json({
                message: "Post created successfully.",
                post,
            });
        } catch (error) {
            console.error("CREATE POST ERROR:", error);

            return res.status(500).json({
                message: "Could not create post.",
                error: error.message,
            });
        }
    }
);

function removeUploadedFiles(files = []) {
    files.forEach((file) => {
        fs.unlink(file.path, (error) => {
            if (
                error &&
                error.code !== "ENOENT"
            ) {
                console.error(
                    "FILE CLEANUP ERROR:",
                    error
                );
            }
        });
    });
}

function removeStoredImages(images = []) {
    images.forEach((image) => {
        if (!image || image.startsWith("http")) {
            return;
        }

        const imagePath = path.join(
            uploadDirectory,
            path.basename(image)
        );

        fs.unlink(imagePath, (error) => {
            if (
                error &&
                error.code !== "ENOENT"
            ) {
                console.error(
                    "IMAGE DELETE ERROR:",
                    error
                );
            }
        });
    });
}
export default router;