import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchMyPosts() {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/posts/my-posts",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                setPosts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        if (!token) {
            navigate("/login");
            return;
        }

        fetchMyPosts();
    }, [navigate, token]);

    async function handleDelete(postId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `http://localhost:5000/api/posts/${postId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setPosts((currentPosts) =>
                currentPosts.filter((post) => post._id !== postId)
            );
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <main className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="mx-auto max-w-5xl">
                <section className="mb-8 rounded-2xl bg-white p-6 shadow">
                    <h1 className="text-3xl font-bold">
                        {user?.name || "My Profile"}
                    </h1>

                    <p className="mt-1 text-gray-500">
                        {user?.email}
                    </p>

                    <Link
                        to="/posts/create"
                        className="mt-5 inline-block rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
                    >
                        Upload new post
                    </Link>
                </section>

                <h2 className="mb-5 text-2xl font-bold">
                    My Posts
                </h2>

                {loading && <p>Loading your posts...</p>}

                {!loading && posts.length === 0 && (
                    <div className="rounded-xl bg-white p-6 text-center">
                        <p>You have not uploaded any posts.</p>

                        <Link
                            to="/posts/create"
                            className="mt-4 inline-block font-semibold text-green-700"
                        >
                            Create your first post
                        </Link>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    {posts.map((post) => (
                        <article
                            key={post._id}
                            className="overflow-hidden rounded-xl bg-white shadow"
                        >
                            {post.images?.[0]?.url && (
                                <img
                                    src={post.images[0].url}
                                    alt={post.title}
                                    className="h-56 w-full object-cover"
                                />
                            )}

                            <div className="p-5">
                                <h3 className="text-xl font-bold">
                                    {post.title}
                                </h3>

                                <p className="mt-2 line-clamp-3 text-gray-600">
                                    {post.description}
                                </p>

                                <div className="mt-5 flex gap-3">
                                    <Link
                                        to={`/posts/${post._id}/edit`}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        className="rounded-lg bg-red-600 px-4 py-2 text-white"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}