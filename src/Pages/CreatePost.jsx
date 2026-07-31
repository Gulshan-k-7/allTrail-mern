import { useEffect, useState } from "react";
import axios from "axios";
import {
    ArrowLeft,
    Camera,
    CheckCircle2,
    ImagePlus,
    LoaderCircle,
    MapPin,
    Mountain,
    Type,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";
const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function CreatePost() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const previewUrls = images.map((image) =>
            URL.createObjectURL(image)
        );

        setPreviews(previewUrls);

        return () => {
            previewUrls.forEach((url) =>
                URL.revokeObjectURL(url)
            );
        };
    }, [images]);

    const selectImages = (selectedFiles) => {
        const files = Array.from(selectedFiles || []);

        if (files.length === 0) return;

        const validFiles = [];

        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                setMessage("Only image files are allowed.");
                continue;
            }

            if (file.size > MAX_FILE_SIZE) {
                setMessage(
                    `${file.name} is larger than 5 MB.`
                );
                continue;
            }

            validFiles.push(file);
        }

        setImages((currentImages) => {
            const availableSlots =
                MAX_IMAGES - currentImages.length;

            if (availableSlots <= 0) {
                setMessage(
                    `You can upload a maximum of ${MAX_IMAGES} images.`
                );

                return currentImages;
            }

            const newImages = validFiles.slice(
                0,
                availableSlots
            );

            if (validFiles.length > availableSlots) {
                setMessage(
                    `Only ${MAX_IMAGES} images can be added to one post.`
                );
            } else if (newImages.length > 0) {
                setMessage("");
            }

            return [...currentImages, ...newImages];
        });
    };

    const removeImage = (indexToRemove) => {
        setImages((currentImages) =>
            currentImages.filter(
                (_, index) => index !== indexToRemove
            )
        );

        setMessage("");
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragActive(false);

        selectImages(event.dataTransfer.files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");

        if (
            !title.trim() ||
            !location.trim() ||
            !description.trim()
        ) {
            setMessage("Please complete all the fields.");
            return;
        }

        if (images.length === 0) {
            setMessage(
                "Please select at least one adventure photo."
            );
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setMessage(
                "Please log in before creating a post."
            );
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("title", title.trim());
            formData.append("location", location.trim());
            formData.append(
                "description",
                description.trim()
            );

            images.forEach((image) => {
                formData.append("images", image);
            });

            await axios.post(
                `${API_URL}/api/posts`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTitle("");
            setLocation("");
            setDescription("");
            setImages([]);

            navigate("/community");
        } catch (error) {
            console.error(
                "CREATE POST ERROR:",
                error.response?.data || error.message
            );

            setMessage(
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Could not upload your post. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f4f1e8] text-[#17372d]">
            <section
                className="relative min-h-[380px] overflow-hidden bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=90')",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[#0c261d]/85 via-[#12392c]/70 to-[#153a2e]/95" />

                <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#e6a85c]/20 blur-3xl" />
                <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#65a57c]/20 blur-3xl" />

                <div className="relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-6 lg:px-10">
                    <button
                        type="button"
                        onClick={() => navigate("/community")}
                        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition hover:text-[#f2bd73]"
                    >
                        <ArrowLeft size={18} />
                        Back to community
                    </button>

                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-[#f2c988] backdrop-blur-md">
                            <Mountain size={17} />
                            Share your journey
                        </div>

                        <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                            Turn your adventure into
                            <span className="block text-[#e6a85c]">
                                someone’s inspiration
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                            Share your destination, photos and the
                            story behind your outdoor experience.
                        </p>
                    </div>
                </div>
            </section>

            <section className="relative z-20 mx-auto -mt-14 max-w-7xl px-4 pb-20 sm:px-6 lg:px-10">
                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-[2rem] border border-[#17372d]/10 bg-white shadow-[0_25px_70px_rgba(20,55,43,0.15)]"
                >
                    <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="bg-[#e8eee6] p-5 sm:p-8 lg:p-10">
                            <div className="mb-6">
                                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#cb7b32]">
                                    Adventure photos
                                </p>

                                <h2 className="mt-2 text-2xl font-bold">
                                    Show everyone what you discovered
                                </h2>

                                <p className="mt-2 text-sm text-[#68766d]">
                                    Add up to {MAX_IMAGES} pictures. The
                                    first picture will be the cover.
                                </p>
                            </div>

                            {previews.length > 0 ? (
                                <div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {previews.map(
                                            (preview, index) => (
                                                <div
                                                    key={`${images[index]?.name}-${index}`}
                                                    className={`group relative overflow-hidden rounded-2xl bg-[#dce5dc] ${index === 0 &&
                                                            previews.length % 2 !== 0
                                                            ? "col-span-2"
                                                            : ""
                                                        }`}
                                                >
                                                    <img
                                                        src={preview}
                                                        alt={`Selected image ${index + 1
                                                            }`}
                                                        className={`w-full object-cover ${index === 0 &&
                                                                previews.length % 2 !== 0
                                                                ? "h-64 sm:h-80"
                                                                : "h-48 sm:h-56"
                                                            }`}
                                                    />

                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                                                    {index === 0 && (
                                                        <span className="absolute bottom-3 left-3 rounded-full bg-[#e6a85c] px-3 py-1.5 text-xs font-bold text-[#17372d]">
                                                            Cover photo
                                                        </span>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeImage(index)
                                                        }
                                                        aria-label={`Remove image ${index + 1
                                                            }`}
                                                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:scale-105 hover:bg-red-600"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {images.length < MAX_IMAGES && (
                                        <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#245541]/25 bg-white px-5 py-5 font-bold text-[#245541] transition hover:border-[#cb7b32] hover:bg-[#fff9ee]">
                                            <ImagePlus size={21} />

                                            Add more pictures (
                                            {images.length}/{MAX_IMAGES})

                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(event) => {
                                                    selectImages(
                                                        event.target.files
                                                    );
                                                    event.target.value = "";
                                                }}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            ) : (
                                <label
                                    onDragOver={(event) => {
                                        event.preventDefault();
                                        setDragActive(true);
                                    }}
                                    onDragLeave={() =>
                                        setDragActive(false)
                                    }
                                    onDrop={handleDrop}
                                    className={`flex min-h-[430px] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed px-6 text-center transition duration-300 ${dragActive
                                            ? "scale-[1.01] border-[#cb7b32] bg-[#fff7e8]"
                                            : "border-[#245541]/25 bg-white/70 hover:border-[#cb7b32]/70 hover:bg-white"
                                        }`}
                                >
                                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#173d30] text-[#e6a85c] shadow-lg">
                                        <ImagePlus size={36} />
                                    </div>

                                    <h3 className="mt-6 text-xl font-bold">
                                        Add your adventure pictures
                                    </h3>

                                    <p className="mt-3 max-w-sm leading-7 text-[#68766d]">
                                        Drag and drop multiple pictures here
                                        or select them from your device.
                                    </p>

                                    <span className="mt-6 rounded-full bg-[#e6a85c] px-6 py-3 font-bold text-[#17372d] shadow-md">
                                        Choose pictures
                                    </span>

                                    <p className="mt-4 text-xs font-medium text-[#88938c]">
                                        JPG, PNG or WEBP • Maximum 5 MB each
                                    </p>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(event) => {
                                            selectImages(event.target.files);
                                            event.target.value = "";
                                        }}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        <div className="p-6 sm:p-9 lg:p-10">
                            <div className="mb-8">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8efe8] text-[#245541]">
                                    <Camera size={27} />
                                </div>

                                <h2 className="mt-5 text-3xl font-bold">
                                    Create a new post
                                </h2>

                                <p className="mt-2 leading-7 text-[#6b776f]">
                                    Add details that help other explorers
                                    discover and understand your journey.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <FormField
                                    label="Post title"
                                    icon={<Type size={19} />}
                                >
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(event) =>
                                            setTitle(event.target.value)
                                        }
                                        placeholder="For example: Sunrise at Triund"
                                        maxLength={80}
                                        className="w-full bg-transparent py-3 pr-4 outline-none placeholder:text-[#a0aaa3]"
                                    />
                                </FormField>

                                <FormField
                                    label="Location"
                                    icon={<MapPin size={19} />}
                                >
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(event) =>
                                            setLocation(event.target.value)
                                        }
                                        placeholder="City, mountain, trail or destination"
                                        maxLength={100}
                                        className="w-full bg-transparent py-3 pr-4 outline-none placeholder:text-[#a0aaa3]"
                                    />
                                </FormField>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label
                                            htmlFor="description"
                                            className="font-bold text-[#26483b]"
                                        >
                                            Your adventure story
                                        </label>

                                        <span className="text-xs font-medium text-[#89938d]">
                                            {description.length}/700
                                        </span>
                                    </div>

                                    <textarea
                                        id="description"
                                        value={description}
                                        onChange={(event) =>
                                            setDescription(event.target.value)
                                        }
                                        placeholder="What made this place special? Share your experience and helpful advice..."
                                        rows={7}
                                        maxLength={700}
                                        className="w-full resize-none rounded-2xl border border-[#193a2e]/15 bg-[#fafbf8] px-4 py-4 leading-7 outline-none transition placeholder:text-[#a0aaa3] focus:border-[#cb7b32] focus:ring-4 focus:ring-[#e6a85c]/15"
                                    />
                                </div>

                                {message && (
                                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                        {message}
                                    </div>
                                )}

                                <div className="rounded-2xl bg-[#edf3eb] p-4">
                                    <div className="flex gap-3">
                                        <CheckCircle2
                                            size={21}
                                            className="mt-0.5 shrink-0 text-[#357054]"
                                        />

                                        <p className="text-sm leading-6 text-[#58675e]">
                                            Share genuine experiences and
                                            accurate locations. Only upload
                                            images that you own.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/community")
                                        }
                                        disabled={loading}
                                        className="flex-1 rounded-full border border-[#17372d]/20 px-6 py-3.5 font-bold transition hover:bg-[#edf1ea] disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#173d30] px-6 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#245541] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading ? (
                                            <>
                                                <LoaderCircle
                                                    size={20}
                                                    className="animate-spin"
                                                />
                                                Publishing...
                                            </>
                                        ) : (
                                            <>
                                                <Camera size={19} />
                                                Publish Post
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </main>
    );
}

function FormField({ label, icon, children }) {
    return (
        <div>
            <label className="mb-2 block font-bold text-[#26483b]">
                {label}
            </label>

            <div className="flex items-center rounded-2xl border border-[#193a2e]/15 bg-[#fafbf8] transition focus-within:border-[#cb7b32] focus-within:ring-4 focus-within:ring-[#e6a85c]/15">
                <span className="ml-4 text-[#648071]">
                    {icon}
                </span>

                <div className="min-w-0 flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default CreatePost;