import Post from "../models/Post.js";

export const createPost = async (req, res) => {
    try {

        const post = await Post.create({

            title: req.body.title,

            description: req.body.description,

            location: req.body.location,

            image: req.file.filename,

            userId: req.user.id,

            userName: req.user.name,

            userPhoto: req.user.photo,

        });

        res.status(201).json(post);

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }
};