import { useEffect, useState } from "react";
import axios from "axios";
import {
    Bookmark,
    Camera,
    ChevronLeft,
    ChevronRight,
    Heart,
    MapPin,
    MessageCircle,
    MoreHorizontal,
    Send,
    Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;


function Community() {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likedPosts, setLikedPosts] = useState({});
    const [savedPosts, setSavedPosts] = useState({});

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/api/posts`
                );

                setPosts(
                    Array.isArray(response.data)
                        ? response.data
                        : response.data.posts || []
                );
            } catch (error) {
                console.error(
                    "FETCH POSTS ERROR:",
                    error.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const openCreatePost = () => {
        if (!token) {
            window.alert(
                "Please log in to share your adventure."
            );
            return;
        }

        navigate("/create-post");
    };

    const toggleLike = (postId) => {
        setLikedPosts((current) => ({
            ...current,
            [postId]: !current[postId],
        }));
    };

    const toggleSave = (postId) => {
        setSavedPosts((current) => ({
            ...current,
            [postId]: !current[postId],
        }));
    };

    const getPostImage = (image) => {
        if (!image) {
            return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85";
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        return `${API_URL}/uploads/${image}`;
    };

    const getProfileImage = (post) => {
        if (post.userPhoto) {
            return post.userPhoto;
        }

        return `https://ui-avatars.com/api/?name=${encodeURIComponent(
            post.userName || "Explorer"
        )}&background=204d3b&color=ffffff&bold=true`;
    };

    const formatDate = (date) => {
        if (!date) return "Recently";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };

    return (
        <main className="min-h-screen bg-[#f4f1e8] text-[#17372d]">
            <section
                className="relative min-h-[430px] overflow-hidden bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1800&q=90')",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[#0d281f]/80 via-[#14382c]/65 to-[#102d24]/90" />

                <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pb-16 pt-32 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-[#f2c988] backdrop-blur-md">
                        <Users size={17} />
                        Adventure Community
                    </div>

                    <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                        Stories from people who
                        <span className="block text-[#e6a85c]">
                            choose the wild
                        </span>
                    </h1>

                    <p className="mt-5 max-w-2xl leading-7 text-white/75 sm:text-lg">
                        Discover real journeys, hidden trails and
                        memorable experiences shared by explorers.
                    </p>

                    <button
                        type="button"
                        onClick={openCreatePost}
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#e6a85c] px-7 py-3.5 font-bold text-[#17372d] shadow-lg transition hover:-translate-y-1 hover:bg-[#f1bd78]"
                    >
                        <Camera size={19} />
                        Share Your Adventure
                    </button>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,680px)_320px] lg:justify-center">
                    <div className="space-y-8">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#cb7b32]">
                                    Latest journeys
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    Community feed
                                </h2>
                            </div>

                            <p className="hidden text-sm text-[#6d786f] sm:block">
                                {posts.length}{" "}
                                {posts.length === 1
                                    ? "story"
                                    : "stories"}
                            </p>
                        </div>

                        {loading ? (
                            <LoadingFeed />
                        ) : posts.length === 0 ? (
                            <EmptyFeed onCreate={openCreatePost} />
                        ) : (
                            posts.map((post) => {
                                const isLiked =
                                    Boolean(likedPosts[post._id]);

                                const isSaved =
                                    Boolean(savedPosts[post._id]);

                                return (
                                    <article
                                        key={post._id}
                                        className="overflow-hidden rounded-[1.5rem] border border-[#193a2e]/10 bg-white shadow-[0_15px_45px_rgba(24,53,43,0.10)]"
                                    >
                                        <div className="flex items-center justify-between px-4 py-4 sm:px-5">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="rounded-full bg-gradient-to-br from-[#e6a85c] via-[#cb7b32] to-[#245541] p-[2px]">
                                                    <img
                                                        src={getProfileImage(post)}
                                                        alt={
                                                            post.userName || "Explorer"
                                                        }
                                                        className="h-11 w-11 rounded-full border-2 border-white object-cover"
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="truncate font-bold">
                                                        {post.userName ||
                                                            "Trail Explorer"}
                                                    </h3>

                                                    <div className="flex items-center gap-1 text-xs text-[#758078]">
                                                        <MapPin size={12} />

                                                        <span className="truncate">
                                                            {post.location ||
                                                                "Adventure awaits"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                aria-label="Post options"
                                                className="rounded-full p-2 text-[#53625a] transition hover:bg-[#edf1ea]"
                                            >
                                                <MoreHorizontal size={22} />
                                            </button>
                                        </div>

                                        <PostCarousel
                                            post={post}
                                            getPostImage={getPostImage}
                                            onDoubleClick={() =>
                                                setLikedPosts((current) => ({
                                                    ...current,
                                                    [post._id]: true,
                                                }))
                                            }
                                        />

                                        <div className="px-4 pb-5 pt-4 sm:px-5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleLike(post._id)
                                                        }
                                                        aria-label="Like post"
                                                        className={`transition hover:scale-110 ${isLiked
                                                            ? "text-[#d9574f]"
                                                            : "text-[#17372d]"
                                                            }`}
                                                    >
                                                        <Heart
                                                            size={26}
                                                            fill={
                                                                isLiked
                                                                    ? "currentColor"
                                                                    : "none"
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        aria-label="Comment"
                                                        className="transition hover:scale-110 hover:text-[#cb7b32]"
                                                    >
                                                        <MessageCircle size={25} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        aria-label="Share"
                                                        className="transition hover:scale-110 hover:text-[#cb7b32]"
                                                    >
                                                        <Send size={24} />
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleSave(post._id)
                                                    }
                                                    aria-label="Save post"
                                                    className={`transition hover:scale-110 ${isSaved
                                                        ? "text-[#cb7b32]"
                                                        : "text-[#17372d]"
                                                        }`}
                                                >
                                                    <Bookmark
                                                        size={25}
                                                        fill={
                                                            isSaved
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                    />
                                                </button>
                                            </div>

                                            <p className="mt-4 text-sm font-bold">
                                                {(post.likes || 0) +
                                                    (isLiked ? 1 : 0)}{" "}
                                                likes
                                            </p>

                                            <div className="mt-3">
                                                <h2 className="text-xl font-bold">
                                                    {post.title ||
                                                        "An unforgettable adventure"}
                                                </h2>

                                                <p className="mt-2 leading-7 text-[#59675f]">
                                                    <span className="mr-2 font-bold text-[#18352b]">
                                                        {post.userName || "Explorer"}
                                                    </span>

                                                    {post.description}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                className="mt-3 text-sm text-[#8a928d] hover:text-[#cb7b32]"
                                            >
                                                View all{" "}
                                                {post.comments?.length || 0}{" "}
                                                comments
                                            </button>

                                            <p className="mt-3 text-xs font-medium uppercase tracking-wider text-[#9aa19d]">
                                                {formatDate(post.createdAt)}
                                            </p>
                                        </div>
                                    </article>
                                );
                            })
                        )}
                    </div>

                    <aside className="sticky top-24 hidden space-y-5 lg:block">
                        <div className="overflow-hidden rounded-3xl bg-[#173d30] text-white shadow-xl">
                            <div
                                className="h-36 bg-cover bg-center"
                                style={{
                                    backgroundImage:
                                        "url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80')",
                                }}
                            >
                                <div className="h-full bg-gradient-to-t from-[#173d30] to-transparent" />
                            </div>

                            <div className="p-6">
                                <h3 className="text-2xl font-bold">
                                    Inspire the community
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-white/65">
                                    Share your destination, trail or
                                    camping story and help others find
                                    somewhere new.
                                </p>

                                <button
                                    type="button"
                                    onClick={openCreatePost}
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#e6a85c] px-5 py-3 font-bold text-[#17372d] transition hover:bg-[#f1bd78]"
                                >
                                    <Camera size={18} />
                                    Create Post
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}

function PostCarousel({
    post,
    getPostImage,
    onDoubleClick,
}) {
    const postImages =
        Array.isArray(post.images) &&
            post.images.length > 0
            ? post.images
            : post.image
                ? [post.image]
                : [];

    const [activeImage, setActiveImage] =
        useState(0);

    const showPrevious = () => {
        setActiveImage((current) =>
            current === 0
                ? postImages.length - 1
                : current - 1
        );
    };

    const showNext = () => {
        setActiveImage((current) =>
            current === postImages.length - 1
                ? 0
                : current + 1
        );
    };

    const currentImage =
        postImages[activeImage] || "";

    return (
        <div className="relative overflow-hidden bg-[#dfe5dd]">
            <img
                src={getPostImage(currentImage)}
                alt={`${post.title || "Adventure"} ${activeImage + 1
                    }`}
                onDoubleClick={onDoubleClick}
                className="max-h-[680px] min-h-[350px] w-full select-none object-cover sm:min-h-[480px]"
            />

            {postImages.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={showPrevious}
                        aria-label="Previous picture"
                        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-md transition hover:bg-black/75"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        type="button"
                        onClick={showNext}
                        aria-label="Next picture"
                        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-md transition hover:bg-black/75"
                    >
                        <ChevronRight size={24} />
                    </button>

                    <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                        {activeImage + 1}/{postImages.length}
                    </div>

                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/30 px-3 py-2 backdrop-blur-sm">
                        {postImages.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() =>
                                    setActiveImage(index)
                                }
                                aria-label={`View picture ${index + 1}`}
                                className={`h-2 rounded-full transition ${activeImage === index
                                    ? "w-5 bg-[#e6a85c]"
                                    : "w-2 bg-white/70"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}

            {post.location && (
                <div className="absolute bottom-4 left-4 flex max-w-[60%] items-center gap-1.5 rounded-full bg-[#102d24]/75 px-3 py-2 text-xs font-medium text-white backdrop-blur-md">
                    <MapPin
                        size={14}
                        className="shrink-0 text-[#f2bd73]"
                    />

                    <span className="truncate">
                        {post.location}
                    </span>
                </div>
            )}
        </div>
    );
}

function LoadingFeed() {
    return (
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
            <div className="flex animate-pulse items-center gap-3 p-5">
                <div className="h-11 w-11 rounded-full bg-[#dde4dc]" />

                <div className="space-y-2">
                    <div className="h-3 w-32 rounded bg-[#dde4dc]" />
                    <div className="h-2.5 w-20 rounded bg-[#e9ede7]" />
                </div>
            </div>

            <div className="h-[480px] animate-pulse bg-[#dfe5dd]" />
        </div>
    );
}

function EmptyFeed({ onCreate }) {
    return (
        <div className="rounded-[2rem] border border-dashed border-[#245541]/30 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8efe8] text-[#245541]">
                <Camera size={30} />
            </div>

            <h2 className="mt-5 text-2xl font-bold">
                No adventures shared yet
            </h2>

            <p className="mx-auto mt-3 max-w-md leading-7 text-[#68746d]">
                Become the first explorer to share a memorable
                destination or outdoor experience.
            </p>

            <button
                type="button"
                onClick={onCreate}
                className="mt-7 rounded-full bg-[#e6a85c] px-7 py-3 font-bold text-[#17372d]"
            >
                Create First Post
            </button>
        </div>
    );
}

export default Community;
