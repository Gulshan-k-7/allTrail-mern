import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/posts"
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

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <p className="p-10 text-center">
                Loading community posts...
            </p>
        );
    }

    return (
        <main className="min-h-screen bg-gray-900 px-4 py-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-6 text-3xl font-bold">
                    Community
                </h1>

                {posts.length === 0 && (
                    <p>No posts have been uploaded yet.</p>
                )}

                <div className="space-y-6">
                    {posts.map((post) => (
                        <article
                            key={post._id}
                            className="overflow-hidden rounded-2xl bg-white shadow"
                        >
                            {post.images?.[0]?.url && (
                                <img
                                    src={post.images[0].url}
                                    alt={post.title}
                                    className="h-80 w-full object-cover"
                                />
                            )}

                            <div className="p-5">
                                <p className="text-sm text-gray-500">
                                    Posted by {post.user?.name || "User"}
                                </p>

                                <h2 className="mt-2 text-2xl font-bold">
                                    {post.title}
                                </h2>

                                <p className="mt-2 text-gray-600">
                                    {post.description}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                                    <span className="rounded-full bg-green-100 px-3 py-1">
                                        {post.activityType}
                                    </span>

                                    <span className="rounded-full bg-gray-100 px-3 py-1">
                                        {post.location?.name}
                                    </span>

                                    <span className="rounded-full bg-orange-100 px-3 py-1">
                                        {post.difficulty}
                                    </span>
                                </div>

                                <Link
                                    to={`/posts/${post._id}`}
                                    className="mt-5 inline-block font-semibold text-green-700 hover:underline"
                                >
                                    View details
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}