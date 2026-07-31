import { useEffect, useState } from "react";
import {
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  Edit3,
  ImagePlus,
  LoaderCircle,
  MapPin,
  Mountain,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/api/posts`;

function Profile() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [user, setUser] = useState(storedUser);

  useEffect(() => {
    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    async function fetchProfileData() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/posts/my-posts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Could not load your posts."
          );
        }

        setPosts(
          Array.isArray(data)
            ? data
            : data.posts || []
        );

        // If the endpoint also returns user information
        if (data.user) {
          setUser(data.user);
          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );
        }
      } catch (requestError) {
        console.error("PROFILE ERROR:", requestError);
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [navigate, token]);

  async function handleDelete(postId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this adventure post?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(postId);

      const response = await fetch(
        `${API_URL}/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not delete the post."
        );
      }

      setPosts((currentPosts) =>
        currentPosts.filter(
          (post) => post._id !== postId
        )
      );
    } catch (requestError) {
      window.alert(requestError.message);
    } finally {
      setDeletingId("");
    }
  }

  const getProfileImage = () => {
    const image =
      user?.profileImage ||
      user?.photoURL ||
      user?.picture;

    if (image) {
      return getImageUrl(image);
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "Trail Explorer"
    )}&background=173d30&color=ffffff&bold=true&size=256`;
  };

  const coverImage =
    user?.coverImage ||
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=90";

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric",
      }
    )
    : null;

  return (
    <main className="min-h-screen bg-[#f4f1e8] pb-20 text-[#17372d]">
      <ProfileHeader
        user={user}
        coverImage={getImageUrl(coverImage)}
        profileImage={getProfileImage()}
        joinedDate={joinedDate}
        postsCount={posts.length}
      />

      <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#cb7b32]">
              Adventure collection
            </p>

            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              My shared journeys
            </h2>

            <p className="mt-2 text-[#68766d]">
              Manage the places and experiences you have
              shared.
            </p>
          </div>

          <Link
            to="/create-post"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e6a85c] px-6 py-3 font-bold text-[#17372d] shadow-md transition hover:-translate-y-0.5 hover:bg-[#f1bd78]"
          >
            <Plus size={20} />
            New Adventure
          </Link>
        </div>

        {loading ? (
          <LoadingPosts />
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={() => window.location.reload()}
          />
        ) : posts.length === 0 ? (
          <EmptyPosts />
        ) : (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <ProfilePostCard
                key={post._id}
                post={post}
                deleting={
                  deletingId === post._id
                }
                onDelete={() =>
                  handleDelete(post._id)
                }
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ProfileHeader({
  user,
  coverImage,
  profileImage,
  joinedDate,
  postsCount,
}) {
  return (
    <section className="relative">
      <div className="relative h-[330px] overflow-hidden sm:h-[410px]">
        <img
          src={coverImage}
          alt="Profile cover"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#09251c]/45 via-[#11382b]/25 to-[#102d24]/95" />

        <div className="absolute left-1/2 top-1/2 w-full max-w-7xl -translate-x-1/2 -translate-y-1/2 px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/15 px-4 py-2 text-sm font-semibold text-[#f2c988] backdrop-blur-md">
            <Mountain size={17} />
            Explorer Profile
          </div>

          <h1 className="mt-5 text-4xl font-bold sm:text-5xl lg:text-6xl">
            Adventure is part of
            <span className="block text-[#e6a85c]">
              your story
            </span>
          </h1>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-20 max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="rounded-[2rem] border border-[#17372d]/10 bg-white p-5 shadow-[0_20px_60px_rgba(20,55,43,0.16)] sm:p-7">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-end">
            <div className="relative shrink-0">
              <div className="rounded-full bg-gradient-to-br from-[#f2bd73] via-[#cb7b32] to-[#245541] p-1.5 shadow-xl">
                <img
                  src={profileImage}
                  alt={user?.name || "User"}
                  className="h-32 w-32 rounded-full border-4 border-white object-cover sm:h-40 sm:w-40"
                />
              </div>

              <Link
                to="/edit-profile"
                aria-label="Change profile picture"
                className="absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-[#173d30] text-white shadow-lg transition hover:bg-[#cb7b32]"
              >
                <Camera size={18} />
              </Link>
            </div>

            <div className="min-w-0 flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-bold sm:text-4xl">
                {user?.name || "Trail Explorer"}
              </h2>

              <p className="mt-1 text-[#718078]">
                {user?.email}
              </p>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#56675e] lg:mx-0">
                {user?.bio ||
                  "Exploring new destinations, collecting memories and sharing outdoor experiences with the community."}
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-[#68766d] lg:justify-start">
                {user?.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin
                      size={16}
                      className="text-[#cb7b32]"
                    />
                    {user.location}
                  </span>
                )}

                {joinedDate && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays
                      size={16}
                      className="text-[#cb7b32]"
                    />
                    Joined {joinedDate}
                  </span>
                )}
              </div>
            </div>

            <Link
              to="/edit-profile"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#17372d]/20 px-6 py-3 font-bold transition hover:border-[#245541] hover:bg-[#edf3eb]"
            >
              <Settings size={19} />
              Edit Profile
            </Link>
          </div>

          <div className="mt-7 grid grid-cols-3 divide-x divide-[#17372d]/10 rounded-2xl bg-[#edf3eb] py-5">
            <ProfileStat
              value={postsCount}
              label="Posts"
            />

            <ProfileStat
              value={user?.followers?.length || 0}
              label="Followers"
            />

            <ProfileStat
              value={user?.following?.length || 0}
              label="Following"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileStat({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-[#173d30]">
        {value}
      </p>

      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#78857d] sm:text-sm">
        {label}
      </p>
    </div>
  );
}

function ProfilePostCard({
  post,
  deleting,
  onDelete,
}) {
  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-[#17372d]/10 bg-white shadow-[0_14px_40px_rgba(24,53,43,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(24,53,43,0.16)]">
      <PostImages post={post} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-xl font-bold">
            {post.title || "Untitled adventure"}
          </h3>

          <span className="shrink-0 rounded-full bg-[#edf3eb] px-3 py-1 text-xs font-bold text-[#357054]">
            Journey
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-[#cb7b32]">
          <MapPin size={16} />

          <span className="truncate">
            {post.location || "Location not provided"}
          </span>
        </div>

        <p className="mt-4 line-clamp-3 min-h-[72px] leading-6 text-[#65736b]">
          {post.description ||
            "No description was provided for this adventure."}
        </p>

        <div className="mt-5 border-t border-[#17372d]/10 pt-4">
          <div className="flex gap-3">
            <Link
              to={`/posts/${post._id}/edit`}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#173d30] px-4 py-2.5 font-bold text-white transition hover:bg-[#245541]"
            >
              <Edit3 size={17} />
              Edit
            </Link>

            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 font-bold text-red-700 transition hover:border-red-600 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                  Deleting
                </>
              ) : (
                <>
                  <Trash2 size={17} />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function PostImages({ post }) {
  const images =
    Array.isArray(post.images) &&
      post.images.length > 0
      ? post.images
      : post.image
        ? [post.image]
        : [];

  const [activeImage, setActiveImage] =
    useState(0);

  const previousImage = () => {
    setActiveImage((current) =>
      current === 0
        ? images.length - 1
        : current - 1
    );
  };

  const nextImage = () => {
    setActiveImage((current) =>
      current === images.length - 1
        ? 0
        : current + 1
    );
  };

  return (
    <div className="relative h-72 overflow-hidden bg-[#dfe5dd]">
      <img
        src={getImageUrl(images[activeImage])}
        alt={`${post.title || "Adventure"} ${activeImage + 1
          }`}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={previousImage}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-md transition hover:bg-black/70 group-hover:opacity-100"
          >
            <ChevronLeft size={21} />
          </button>

          <button
            type="button"
            onClick={nextImage}
            aria-label="Next image"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-md transition hover:bg-black/70 group-hover:opacity-100"
          >
            <ChevronRight size={21} />
          </button>

          <span className="absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {activeImage + 1}/{images.length}
          </span>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() =>
                  setActiveImage(index)
                }
                aria-label={`Show image ${index + 1}`}
                className={`h-2 rounded-full transition ${index === activeImage
                    ? "w-5 bg-[#e6a85c]"
                    : "w-2 bg-white/75"
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function LoadingPosts() {
  return (
    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-3xl bg-white shadow-md"
        >
          <div className="h-72 animate-pulse bg-[#dfe5dd]" />

          <div className="space-y-4 p-5">
            <div className="h-5 w-3/4 animate-pulse rounded bg-[#dfe5dd]" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-[#edf0eb]" />
            <div className="h-16 animate-pulse rounded bg-[#edf0eb]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyPosts() {
  return (
    <div className="rounded-[2rem] border-2 border-dashed border-[#245541]/25 bg-white px-6 py-20 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#edf3eb] text-[#245541]">
        <ImagePlus size={36} />
      </div>

      <h3 className="mt-6 text-2xl font-bold">
        Your adventure gallery is empty
      </h3>

      <p className="mx-auto mt-3 max-w-lg leading-7 text-[#68766d]">
        Share your first trail, destination, camping
        experience or unforgettable journey.
      </p>

      <Link
        to="/create-post"
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#e6a85c] px-7 py-3 font-bold text-[#17372d] transition hover:-translate-y-0.5 hover:bg-[#f1bd78]"
      >
        <Camera size={19} />
        Share First Adventure
      </Link>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-14 text-center">
      <h3 className="text-xl font-bold text-red-800">
        Could not load your profile
      </h3>

      <p className="mt-2 text-red-700">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-full bg-red-700 px-6 py-3 font-bold text-white"
      >
        Try Again
      </button>
    </div>
  );
}

function getImageUrl(image) {
  if (!image) {
    return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  return `${API_URL}/uploads/${image}`;
}

export default Profile;