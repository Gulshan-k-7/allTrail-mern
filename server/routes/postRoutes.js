import express from "express";
import Post from "../models/Post.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all posts for home page
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "name profileImage")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({
            message: "Could not load posts",
        });
    }
});

// Get logged-in user's posts
router.get("/my-posts", protect, async (req, res) => {
    try {
        const posts = await Post.find({
            user: req.user._id,
        }).sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({
            message: "Could not load your posts",
        });
    }
});

// Get one post
router.get("/:postId", async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
            .populate("user", "name profileImage");

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({
            message: "Could not load post",
        });
    }
});

// Create post
router.post("/", protect, async (req, res) => {
    try {
        const {
            title,
            description,
            activityType,
            location,
            images,
            difficulty,
            distanceKm,
            duration,
        } = req.body;

        const post = await Post.create({
            user: req.user._id,
            title,
            description,
            activityType,
            location,
            images,
            difficulty,
            distanceKm,
            duration,
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({
            message: "Could not create post",
        });
    }
});

// Edit own post
router.put("/:postId", protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You cannot edit this post",
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({
            message: "Could not update post",
        });
    }
});

// Delete own post
router.delete("/:postId", protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You cannot delete this post",
            });
        }

        await post.deleteOne();

        res.json({
            message: "Post deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Could not delete post",
        });
    }
});

export default router;