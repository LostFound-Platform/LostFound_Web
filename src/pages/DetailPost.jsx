import dayjs from "dayjs";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import Skeleton from "react-loading-skeleton";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
// const Lottie = lazy(() => import("lottie-react"));
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import EmptyGhost from "../assets/animations/empty_ghost.json";
import LoadingFiles from "../assets/animations/Loading_Files.json";
import axiosInstance from "../api/axiosInstance";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function DetailPost() {
  // Variables
  let [isEdit, setIsEdit] = useState(false);
  let [isInProcessing, setIsInProcessing] = useState(false);
  let [isGettingPost, setIsGettingPost] = useState(false);
  let [isGettingSuggestion, setIsGettingSuggestion] = useState(false);
  let [isLoadingMyPost, setIsLoadingMyPost] = useState(false);
  let [isRequesting, setIsRequesting] = useState(false);
  let [isUpdating, setIsUpdating] = useState(false);
  let [isGettingCategories, setIsGettingCategories] = useState(false);
  const [isShowPopup, setIsShowPopup] = useState(false);
  let [suggestPosts, setSuggestPosts] = useState([]);
  let [posts, setPosts] = useState([]);
  let [categoryPosts, setCategoryPosts] = useState([]);
  let [post, setPost] = useState("");
  let [user, setUser] = useState("");
  let [code, setCode] = useState("");
  let [categoryId, setCategoryId] = useState("");
  let [description, setDescription] = useState("");
  let [title, setTitle] = useState("");
  let [selectedFile, setSelectedFileChange] = useState(null);
  const inputRef = useRef(null);
  let [imagePreview, setImagePreview] = useState(null);
  const postId = location.pathname.split("/").pop();

  // APIs
  const API_URL_Auth = `/CheckAuth/check-auth`;

  // Functions
  // Get categories post
  const getCategoryPosts = async () => {
    setIsGettingCategories(true);

    try {
      const response = await axiosInstance.get(`/CategoryPost`, {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status === 200) {
        setCategoryPosts(response.data);
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || "Server error";

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: message,
              status: "error",
            },
          }),
        );
      } else if (error.request) {
        // If offline
        if (!navigator.onLine) {
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message: "Network error. Please check your internet connection",
                status: "error",
              },
            }),
          );
        } else {
          // Server offline
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message:
                  "Server is currently unavailable. Please try again later.",
                status: "error",
              },
            }),
          );
        }
      } else {
        // Other errors
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Something went wrong. Please try again",
              status: "error",
            },
          }),
        );
      }
    } finally {
      setIsGettingCategories(false);
    }
  };

  // Check authentication status and redirect if not authenticated
  const checkAuthentication = () => {
    axiosInstance.get(API_URL_Auth).catch((err) => {
      console.error(err);
    });
  };

  const validateFormUpdatePost = () => {
    if (!title || title.trim() === "") {
      window.dispatchEvent(
        new CustomEvent("app-error", {
          detail: {
            message: "Please enter a title",
            status: "warning",
          },
        }),
      );
      return false;
    }

    if (!categoryId || String(categoryId).trim() === "") {
      window.dispatchEvent(
        new CustomEvent("app-error", {
          detail: {
            message: "Please select a category",
            status: "warning",
          },
        }),
      );
      return false;
    }

    if (!description || description.trim() === "") {
      window.dispatchEvent(
        new CustomEvent("app-error", {
          detail: {
            message: "Please enter a description",
            status: "warning",
          },
        }),
      );
      return false;
    }

    return true;
  };

  const handleChangeImage = (file) => {
    if (!file) return;

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSize = 5 * 1014 * 1014; // 5MB

      // Check type of file
      if (!allowedTypes.includes(file.type)) {
        alert("Only accept JPG, PNG or WebP files");
        return;
      }

      if (file.size > maxSize) {
        alert("The image exceeds 5MB. Please select a smaller image");
        return;
      }

      // To upload to server
      setSelectedFileChange(file);

      // To preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleChangeImage(file);
    e.target.value = "";
  };

  const handleDropImage = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleChangeImage(file);
  };

  // Handle get vector from image
  const handleGetVectorFromImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await axiosInstance.post(
        "https://ai-image-ma5f.onrender.com/embed",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.status === 200) {
        const overlay = document.getElementById("overlay-search-image");
        overlay.style.visibility = "hidden";
        overlay.style.opacity = "0";
        document.body.style.overflow = "auto";

        return res.data; // Return vector
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || "Server error";

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: message,
              status: "error",
            },
          }),
        );
      } else if (error.request) {
        // If offline
        if (!navigator.onLine) {
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message: "Network error. Please check your internet connection",
                status: "error",
              },
            }),
          );
        } else {
          // Server offline
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message: "Posting item with image is temporarily unavailable.",
                status: "warning",
              },
            }),
          );
        }
      } else {
        // Other errors
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Something went wrong. Please try again",
              status: "error",
            },
          }),
        );
      }

      throw error;
    }
  };

  // Update post
  const handleUpdatePost = async () => {
    setIsUpdating(true);

    if (!validateFormUpdatePost()) {
      setIsUpdating(false);
      return;
    }

    const formData = new FormData();
    if (selectedFile) {
      selectedFile && formData.append("imageUpload", selectedFile); // Image
      selectedFile &&
        formData.append(
          "vector",
          JSON.stringify(await handleGetVectorFromImage(selectedFile)),
        ); // Vector of image
    }
    formData.append("postId", post.postId);
    formData.append("userId", user.userId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("typePost", "Found"); // Not use
    formData.append("code", "a"); // Not use
    formData.append("categoryPostId", categoryId);

    try {
      const response = await axiosInstance.put(
        `/Post/${post.postId}`,
        formData,
        {
          // withCredentials: true,
          validateStatus: (status) =>
            status === 200 ||
            status === 401 ||
            status === 404 ||
            status === 403,
        },
      );

      if (response.status === 200) {
        setIsEdit(false);

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: response.data.message,
              status: "success",
            },
          }),
        );
      }

      if (response.status === 403) {
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Please verify your email address to continue",
              status: "warning",
            },
          }),
        );
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || "Server error";

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: message,
              status: "error",
            },
          }),
        );
      } else if (error.request) {
        // If offline
        if (!navigator.onLine) {
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message: "Network error. Please check your internet connection",
                status: "error",
              },
            }),
          );
        } else {
          // Server offline
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message:
                  "Server is currently unavailable. Please try again later.",
                status: "error",
              },
            }),
          );
        }
      } else {
        // Other errors
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Something went wrong. Please try again",
              status: "error",
            },
          }),
        );
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Get my posts
  const handleFetchPosts = async () => {
    setIsLoadingMyPost(true);

    try {
      const response = await axiosInstance.get("/Post/my-posts", {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status === 200) {
        setPosts(
          response.data.filter((p) => p.typePost === "Lost" && !p.isReceived),
        );
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || "Server error";

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: message,
              status: "error",
            },
          }),
        );
      } else if (error.request) {
        // If offline
        if (!navigator.onLine) {
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message: "Network error. Please check your internet connection",
                status: "error",
              },
            }),
          );
        } else {
          // Server offline
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message:
                  "Server is currently unavailable. Please try again later.",
                status: "error",
              },
            }),
          );
        }
      } else {
        // Other errors
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Something went wrong. Please try again",
              status: "error",
            },
          }),
        );
      }
    } finally {
      setIsLoadingMyPost(false);
    }
  };

  // Get my profile
  const getMyProfile = async () => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get("/Users/profile", {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || "Server error";

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: message,
              status: "error",
            },
          }),
        );
      } else if (error.request) {
        // If offline
        if (!navigator.onLine) {
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message: "Network error. Please check your internet connection",
                status: "error",
              },
            }),
          );
        } else {
          // Server offline
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message:
                  "Server is currently unavailable. Please try again later.",
                status: "error",
              },
            }),
          );
        }
      } else {
        // Other errors
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Something went wrong. Please try again",
              status: "error",
            },
          }),
        );
      }
    } finally {
      setIsInProcessing(false);
    }
  };

  // Get random string include letters and numbers
  const getRandomString = (length) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      // Math random to get a random index
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }

    return result;
  };

  // Handle match post
  const handleMatchPost = async (lostPostId, foundPostId) => {
    setIsRequesting(true);

    const codeIntoDb = getRandomString(6);
    setCode(codeIntoDb);

    const payload = {
      matchId: 0,
      lostPostId: lostPostId,
      foundPostId: foundPostId,
      code: codeIntoDb,
    };

    try {
      const response = await axiosInstance.post("/Match", payload, {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status === 200) {
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Match request sent successfully",
              status: "success",
            },
          }),
        );

        setIsShowPopup(true); // Show popup notice code
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || "Server error";

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: message,
              status: "error",
            },
          }),
        );
      } else if (error.request) {
        // If offline
        if (!navigator.onLine) {
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message: "Network error. Please check your internet connection",
                status: "error",
              },
            }),
          );
        } else {
          // Server offline
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message:
                  "Server is currently unavailable. Please try again later.",
                status: "error",
              },
            }),
          );
        }
      } else {
        // Other errors
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Something went wrong. Please try again",
              status: "error",
            },
          }),
        );
      }
    } finally {
      setIsRequesting(false);
    }
  };

  // Get post by id
  const handleFetchPost = async () => {
    setIsGettingPost(true);

    try {
      const response = await axiosInstance.get(`/Post/${postId}`, {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status === 200) {
        setPost(response.data);
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || "Server error";

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: message,
              status: "error",
            },
          }),
        );
      } else if (error.request) {
        // If offline
        if (!navigator.onLine) {
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message: "Network error. Please check your internet connection",
                status: "error",
              },
            }),
          );
        } else {
          // Server offline
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message:
                  "Server is currently unavailable. Please try again later.",
                status: "error",
              },
            }),
          );
        }
      } else {
        // Other errors
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Something went wrong. Please try again",
              status: "error",
            },
          }),
        );
      }
    } finally {
      setIsGettingPost(false);
    }
  };

  // Get posts
  const handleFetchSuggestPost = async () => {
    setIsGettingSuggestion(true);

    try {
      const response = await axiosInstance.get(`/Post/suggest-post/${postId}`, {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status === 200) {
        setSuggestPosts(response.data);
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || "Server error";

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: message,
              status: "error",
            },
          }),
        );
      } else if (error.request) {
        // If offline
        if (!navigator.onLine) {
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message: "Network error. Please check your internet connection",
                status: "error",
              },
            }),
          );
        } else {
          // Server offline
          window.dispatchEvent(
            new CustomEvent("app-error", {
              detail: {
                message:
                  "Server is currently unavailable. Please try again later.",
                status: "error",
              },
            }),
          );
        }
      } else {
        // Other errors
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Something went wrong. Please try again",
              status: "error",
            },
          }),
        );
      }
    } finally {
      setIsGettingSuggestion(false);
    }
  };

  // Call fetch data from API
  useEffect(() => {
    handleFetchPost();
    handleFetchSuggestPost();
    getMyProfile();
  }, []);

  useEffect(() => {
    if (categoryPosts.length > 0 && post?.categoryPostId) {
      setCategoryId(post.categoryPostId);
    }
  }, [categoryPosts, post]);

  useEffect(() => {
    if (isEdit) {
      setDescription(post.description);
      setTitle(post.title);
      setCategoryId(post.categoryId);
    }
  }, [isEdit]);

  return (
    <>
      {/* Helmet for setting the page title */}
      <Helmet>
        <title>{post.title || "Post"} | Back2Me </title>
      </Helmet>

      <main>
        {/* Menu bar for post */}
        <div
          style={{
            display: "flex",
            // justifyContent: "flex-start",
            alignItems: "center",
            padding: "30px 1px",
            fontWeight: "300",
            color: "#072138",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 1px",
            }}
            className="breadcrumb-menu"
          >
            <a href="/" aria-label="Home link">
              <p>Home</p>
            </a>
            <i className="fa-solid fa-angle-right icon-light"></i>
            <a href="/search" aria-label="Search link">
              <p>Search</p>
            </a>
            <i className="fa-solid fa-angle-right icon-light"></i>
            <a href="" aria-label="Post link">
              <p>Post</p>
            </a>
          </div>
        </div>

        {/* Check post if available */}
        {isGettingPost ? (
          <div className="not-found">
            <Suspense fallback={<p>Loading animation...</p>}>
              <DotLottieReact
                src="../assets/animations/Loading.json"
                autoplay
                loop
                style={{ width: "50%", margin: "auto" }}
              />
            </Suspense>
            <h1 style={{ fontSize: "40px", marginTop: "20px" }}>Loading...</h1>
          </div>
        ) : post ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <h1
                style={{
                  color: "#072138",
                  padding: "20px 0",
                  fontSize: "40px",
                  textTransform: "capitalize",
                }}
              >
                {isInProcessing ? (
                  <Skeleton
                    height={45}
                    width={300}
                    style={{
                      borderRadius: "12px",
                    }}
                  />
                ) : isEdit ? (
                  <input
                    type="text"
                    className="form-control-input input-update-post"
                    style={{
                      marginBottom: "20px",
                      marginTop: "-40px",
                    }}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                ) : (
                  post.title
                )}
              </h1>

              {!isGettingPost &&
                !isGettingSuggestion &&
                user &&
                (user.email !== post.user?.email ? (
                  <button
                    style={{
                      marginLeft: "auto",
                      height: "max-content",
                      opacity: post.isReceived ? "0" : "",
                      visibility: post.isReceived ? "hidden" : "",
                    }}
                    aria-label="Contact owner button"
                    className="btn-yellow btn-contact-owner"
                    onClick={() => {
                      // const chatPopup = document.getElementById("chatPopup");
                      // chatPopup.style.display = "flex";

                      const chatBubble = document.getElementById("chatBubble");
                      const chatPopup = document.getElementById("chatPopup");
                      if (chatPopup.style.display === "flex") {
                        chatPopup.style.display = "none";
                      } else {
                        chatPopup.style.display = "flex";
                      }

                      // Click outside to close
                      document.addEventListener("click", (e) => {
                        if (
                          chatBubble.contains(e.target) &&
                          chatPopup.contains(e.target)
                        ) {
                          chatPopup.style.display = "none";
                        }
                      });

                      const temporaryMsg = {
                        message:
                          post.typePost === "Lost"
                            ? `Hello, I'm contacting you regarding your lost item post: "${post.title}" (Post ID: ${post.postId}). I may have information related to it.`
                            : `Hello, I'm contacting you regarding your found item post: "${post.title}" (Post ID: ${post.postId}). I think this item might belong to me.`,
                        urlAvatar: post.user.urlAvatar,
                        avatar: post.user.avatar,
                        firstName: post.user.firstName,
                        lastName: post.user.lastName,
                        userAId: user.userId,
                        userIdReceive: post.user.userId,
                        postId: post.postId,
                        chatId:
                          Date.now().toString().slice(-5) +
                          Math.floor(Math.random() * 10000)
                            .toString()
                            .padStart(4, "0"), // Temporary chat id
                      };

                      window.dispatchEvent(
                        new CustomEvent("contact-owner", {
                          detail: temporaryMsg,
                        }),
                      );
                    }}
                  >
                    <i className="fa-solid fa-comments"></i> Contact owner
                  </button>
                ) : (
                  <button
                    style={{
                      marginLeft: "auto",
                      height: "max-content",
                      opacity: post.isReceived ? "0" : "",
                      visibility: post.isReceived ? "hidden" : "",
                    }}
                    className="btn-yellow btn-edit-discard-post"
                    onClick={() => {
                      setIsEdit(!isEdit);

                      // Get categories
                      getCategoryPosts();
                    }}
                    disabled={isUpdating}
                    aria-label="Edit/Discard changes post button"
                  >
                    {isEdit ? (
                      <>
                        <i className="fa-solid fa-xmark"></i> Discard changes
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-pen-to-square"></i> Edit Post
                      </>
                    )}
                  </button>
                ))}
            </div>

            {/* Image of post */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto",
                gap: "100px",
              }}
              className="detail-post-container"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "80% 20%",
                  gap: "20px",
                }}
                className="image-post-details"
              >
                <div
                  className="post-image-container"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDropImage}
                >
                  <div>
                    {isInProcessing ? (
                      <Skeleton
                        height={400}
                        width={432}
                        style={{
                          borderRadius: "12px",
                        }}
                      />
                    ) : imagePreview ? (
                      <img
                        src={imagePreview}
                        style={{
                          width: "100%",
                          height: "400px",
                          objectFit: "cover",
                          backgroundColor: "white",
                          borderRadius: "20px",
                        }}
                        alt="Preview lost item"
                        width="290"
                        loading="lazy"
                        height="297"
                        className="preview-img"
                      />
                    ) : post.image ? (
                      <img
                        src={post.image ? post.urlImage : ""}
                        alt="picture of item"
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "400px",
                          objectFit: "cover",
                          backgroundColor: "white",
                          borderRadius: "20px",
                        }}
                        id="big-img"
                      ></img>
                    ) : (
                      <div className="image-placeholder">
                        <i className="icon-image"></i>
                        <span>No image</span>
                      </div>
                    )}
                  </div>

                  <h3
                    style={{
                      fontWeight: "500",
                      textAlign: "center",
                      padding: "5px 10px 10px 0",
                    }}
                  >
                    ID: {post.postId}
                  </h3>

                  {isEdit && (
                    <div className="btn-change-img">
                      <button
                        htmlFor="upload-img"
                        className="btn"
                        onClick={() => inputRef.current.click()}
                      >
                        Change image
                      </button>
                      <input
                        type="file"
                        id="upload-img"
                        style={{ display: "none" }}
                        ref={inputRef}
                        onChange={(e) => {
                          handleImageChange(e);
                        }}
                      />
                      <button
                        aria-label="Cancel image button"
                        className="btn-yellow"
                        style={{ backgroundColor: "#fff" }}
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setSelectedFileChange(null);
                        }}
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                </div>

                {/* Post image mini */}
                {/* <div className="post-image-mini">
                {post.image2 ? (
                  <img
                    src={post.image2 ? post.urlImage2 : ""}
                    alt="picture of item"
                    loading="lazy"
                    style={{
                      width: "80%",
                      height: "80px",
                      objectFit: "cover",
                      backgroundColor: "white",
                      borderRadius: "20px",
                    }}
                    id="img-1"
                    onClick={() =>
                      handleChangeImage(
                        document.getElementById("big-img").src,
                        document.getElementById("img-1").src,
                        "img-1",
                      )
                    }
                  ></img>
                ) : (
                  <div
                    className="image-placeholder"
                    style={{
                      width: "80%",
                      height: "80px",
                      objectFit: "cover",
                      backgroundColor: "white",
                      borderRadius: "20px",
                    }}
                  >
                    <i className="icon-image"></i>
                    <span>No image</span>
                  </div>
                )}
                {post.image2 ? (
                  <img
                    src={post.image2 ? post.urlImage2 : ""}
                    alt="picture of item"
                    loading="lazy"
                    style={{
                      width: "80%",
                      height: "80px",
                      objectFit: "cover",
                      backgroundColor: "white",
                      borderRadius: "20px",
                    }}
                    id="img-1"
                    onClick={() =>
                      handleChangeImage(
                        document.getElementById("big-img").src,
                        document.getElementById("img-1").src,
                        "img-1",
                      )
                    }
                  ></img>
                ) : (
                  <div
                    className="image-placeholder"
                    style={{
                      width: "80%",
                      height: "80px",
                      objectFit: "cover",
                      backgroundColor: "white",
                      borderRadius: "20px",
                    }}
                  >
                    <i className="icon-image"></i>
                    <span>No image</span>
                  </div>
                )}
                {post.image2 ? (
                  <img
                    src={post.image2 ? post.urlImage2 : ""}
                    alt="picture of item"
                    loading="lazy"
                    style={{
                      width: "80%",
                      height: "80px",
                      objectFit: "cover",
                      backgroundColor: "white",
                      borderRadius: "20px",
                    }}
                    id="img-1"
                    onClick={() =>
                      handleChangeImage(
                        document.getElementById("big-img").src,
                        document.getElementById("img-1").src,
                        "img-1",
                      )
                    }
                  ></img>
                ) : (
                  <div
                    className="image-placeholder"
                    style={{
                      width: "80%",
                      height: "80px",
                      objectFit: "cover",
                      backgroundColor: "white",
                      borderRadius: "20px",
                    }}
                  >
                    <i className="icon-image"></i>
                    <span>No image</span>
                  </div>
                )}
              </div> */}
              </div>

              {/* About me */}
              <div>
                <h1
                  style={{
                    fontFamily: "Mochiy Pop One, sans-serif",
                    fontSize: "25px",
                    marginBottom: "10px",
                    fontWeight: "100",
                    marginLeft: "10px",
                  }}
                >
                  About this item
                </h1>
                <table
                  border="0"
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    verticalAlign: "top",
                  }}
                >
                  <tbody>
                    <tr className="table-tr">
                      <th style={{ verticalAlign: "top", fontWeight: "600" }}>
                        Category:
                      </th>
                      <td style={{ verticalAlign: "top" }} className="table-td">
                        {isInProcessing ? (
                          <Skeleton
                            height={30}
                            width={80}
                            style={{ marginBottom: "20px" }}
                          />
                        ) : post.categoryPost?.categoryPostName ? (
                          isEdit ? (
                            <select
                              name=""
                              id="type"
                              className="form-control-input input-update-post"
                              value={categoryId}
                              onChange={(e) => {
                                setCategoryId(e.target.value);
                              }}
                            >
                              <option value="">Select type</option>
                              {isGettingCategories ? (
                                <option>Loading...</option>
                              ) : (
                                categoryPosts.map((item) => (
                                  <option
                                    key={item.categoryPostId}
                                    value={item.categoryPostId}
                                  >
                                    {item.categoryPostName}
                                  </option>
                                ))
                              )}
                            </select>
                          ) : (
                            post.categoryPost?.categoryPostName
                          )
                        ) : (
                          "Not available"
                        )}
                      </td>
                    </tr>
                    <tr className="table-tr">
                      <th style={{ verticalAlign: "top", fontWeight: "600" }}>
                        Date posted:
                      </th>
                      <td style={{ verticalAlign: "top" }} className="table-td">
                        {isInProcessing ? (
                          <Skeleton
                            height={30}
                            width={120}
                            style={{ marginBottom: "20px" }}
                          />
                        ) : post.createdAt ? (
                          dayjs(post.createdAt).format("MM/DD/YYYY")
                        ) : (
                          "Not available"
                        )}
                      </td>
                    </tr>
                    <tr className="table-tr">
                      <th style={{ verticalAlign: "top", fontWeight: "600" }}>
                        Status:
                      </th>
                      <td style={{ verticalAlign: "top" }} className="table-td">
                        {isInProcessing ? (
                          <Skeleton
                            height={30}
                            width={50}
                            style={{ marginBottom: "20px" }}
                          />
                        ) : post.typePost ? (
                          post.typePost
                        ) : (
                          "Not available"
                        )}
                      </td>
                    </tr>
                    <tr className="table-tr">
                      <th style={{ verticalAlign: "top", fontWeight: "600" }}>
                        Description:
                      </th>
                      <td style={{ verticalAlign: "top" }} className="table-td">
                        {isInProcessing ? (
                          <Skeleton
                            height={100}
                            width={700}
                            style={{ marginBottom: "20px" }}
                          />
                        ) : isEdit ? (
                          <CKEditor
                            editor={ClassicEditor}
                            data={description}
                            config={{
                              licenseKey: "GPL",
                              toolbar: [
                                "bold",
                                "italic",
                                "bulletedList",
                                "numberedList",
                                "link",
                                "undo",
                                "redo",
                              ],
                            }}
                            onChange={(event, editor) => {
                              setDescription(editor.getData());
                            }}
                          />
                        ) : (
                          <ReactMarkdown
                            children={post.description}
                            rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          ></ReactMarkdown>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Contacts */}
                <div>
                  <h1
                    style={{
                      fontFamily: "Mochiy Pop One, sans-serif",
                      fontSize: "20px",
                      fontWeight: "100",
                      marginLeft: "10px",
                      marginTop: "20px",
                    }}
                  >
                    Contacts
                  </h1>
                  <table
                    border="0"
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      verticalAlign: "top",
                    }}
                  >
                    <tbody>
                      <tr className="table-tr">
                        <th style={{ verticalAlign: "top", fontWeight: "600" }}>
                          Name:{" "}
                        </th>
                        <td
                          style={{ verticalAlign: "top" }}
                          className="table-td"
                        >
                          {isInProcessing ? (
                            <Skeleton
                              height={30}
                              width={200}
                              style={{ marginBottom: "20px" }}
                            />
                          ) : post.user ? (
                            `${post.user.firstName} ${post.user.lastName}`
                          ) : (
                            "Not available"
                          )}
                        </td>
                      </tr>
                      <tr className="table-tr">
                        <th style={{ verticalAlign: "top", fontWeight: "600" }}>
                          Email:{" "}
                        </th>
                        <td
                          style={{ verticalAlign: "top" }}
                          className="table-td"
                        >
                          {isInProcessing ? (
                            <Skeleton
                              height={30}
                              width={230}
                              style={{ marginBottom: "20px" }}
                            />
                          ) : post.user ? (
                            post.user.email
                          ) : (
                            "Not available"
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {post.typePost === "Found" &&
                  user.email !== post.user?.email &&
                  !post.isReceived && (
                    <button
                      className="btn-yellow"
                      style={{ marginTop: "20px", width: "100%" }}
                      onClick={() => {
                        document.getElementById(
                          "modal-my-post-to-match-detail",
                        ).style.visibility = "visible";
                        document.getElementById(
                          "modal-my-post-to-match-detail",
                        ).style.opacity = "1";

                        // Load my post to pick to match post is showing
                        handleFetchPosts();
                      }}
                    >
                      <i className="fa-solid fa-hand-point-up"></i> This is my
                      item
                    </button>
                  )}

                {isEdit && (
                  <button
                    className="btn"
                    style={{ width: "100%" }}
                    onClick={() => {
                      handleUpdatePost();
                    }}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk me-2"></i> Save
                        changes
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Modal popup choose my post to math with currently post is showing */}
            <div
              className="modal-my-post-to-match"
              id="modal-my-post-to-match-detail"
            >
              <div className="modal-content-my-post-to-match">
                <h2>Select your post?</h2>
                <p style={{ textAlign: "center" }}>
                  Choose the post that matches this found item
                </p>
                <div
                  className={
                    !isLoadingMyPost ? "results-container-my-post-to-match" : ""
                  }
                  style={{
                    gridTemplateColumns: posts.length == 0 ? "unset" : "",
                  }}
                >
                  {isLoadingMyPost ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "auto auto auto",
                        width: "100%",
                        gap: "10px",
                      }}
                    >
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div className="" key={index}>
                          <Skeleton
                            height={290}
                            style={{
                              marginBottom: "10px",
                              borderRadius: "20px",
                            }}
                          />
                          <div className="">
                            <h3
                              style={{
                                fontWeight: "700",
                                marginBottom: "10px",
                              }}
                            >
                              <Skeleton height={35} width={309} />
                            </h3>
                            <p>
                              <Skeleton count={3} />
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : posts.length > 0 ? (
                    posts.map((item) => (
                      <div
                        className="card card-my-post"
                        key={item.postId}
                        style={{ cursor: "pointer" }}
                      >
                        <div
                          onClick={() => {
                            window.location.href = `/detail-post/${item.postId}`;
                          }}
                        >
                          {/* Image */}
                          {item.image ? (
                            <img
                              src={item.image ? item.urlImage : ""}
                              alt="picture of item"
                              loading="lazy"
                              style={{
                                width: "100%",
                                height: "300px",
                                objectFit: "cover",
                                backgroundColor: "white",
                              }}
                            />
                          ) : (
                            <div className="image-placeholder">
                              <i className="icon-image"></i>
                              <span>No image</span>
                            </div>
                          )}

                          {/* Content */}
                          <div
                            className="card-text"
                            style={{ marginBottom: "20px" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <h3
                                style={{
                                  fontWeight: "700",
                                  marginBottom: "10px",
                                }}
                              >
                                <a
                                  href={`/detail-post/${item.postId}`}
                                  aria-label={`Detail link for ${item.title}`}
                                >
                                  {item.title}
                                </a>
                              </h3>
                              {item.isReceived && (
                                <label
                                  style={{
                                    // fontSize: "13px",
                                    fontWeight: 500,
                                    color: "green",
                                  }}
                                >
                                  (<i className="fa-solid fa-circle-check"></i>{" "}
                                  Received)
                                </label>
                              )}
                            </div>
                            <a
                              href={`/detail-post/${item.postId}`}
                              aria-label={`Detail link for ${item.title}`}
                            >
                              <ReactMarkdown
                                children={item.description}
                                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                              ></ReactMarkdown>
                            </a>
                          </div>

                          {/* Status */}
                          <div
                            className={
                              item.typePost === "Lost"
                                ? "status-post-lost"
                                : "status-post-found"
                            }
                          >
                            {item.typePost}
                          </div>
                        </div>

                        <button
                          aria-label="Select this post that matched with this found item"
                          className="btn"
                          style={{ width: "100%" }}
                          onClick={() => {
                            handleMatchPost(item.postId, post.postId);
                          }}
                          disabled={isRequesting}
                        >
                          {isRequesting ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <>
                              <i className="fa-solid fa-hand-point-up"></i>{" "}
                              Select
                            </>
                          )}
                        </button>
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "auto",
                      }}
                    >
                      <p>
                        You don't have any lost items to match this found item
                      </p>
                      <button
                        className="btn"
                        onClick={() => {
                          checkAuthentication();

                          // Hidden select my posts modal
                          document.getElementById(
                            "modal-my-post-to-match-detail",
                          ).style.visibility = "hidden";
                          document.getElementById(
                            "modal-my-post-to-match-detail",
                          ).style.opacity = "0";

                          // Show modal create post
                          const modal = document.querySelector(
                            ".modal-report-stuff",
                          );
                          const overlay = document.querySelector(
                            ".modal-overlay-report-stuff",
                          );
                          modal.style.visibility = "visible";
                          modal.style.opacity = "1";
                          overlay.style.visibility = "visible";
                          overlay.style.opacity = "1";
                          document.body.style.overflow = "hidden";
                        }}
                      >
                        <i className="fa-solid fa-plus"></i> Create a lost post
                      </button>
                    </div>
                  )}
                </div>
                <button
                  aria-label="Close button"
                  className="btn-yellow close-result-my-post-to-match"
                  style={{
                    width: "90%",
                  }}
                  href="#"
                  onClick={() => {
                    const modal = document.querySelector(
                      "#modal-my-post-to-match-detail",
                    );
                    modal.style.visibility = "hidden";
                    modal.style.opacity = "0";
                    document.body.style.overflow = "auto";
                  }}
                >
                  <i className="fa-solid fa-xmark"></i> Close
                </button>
              </div>
            </div>

            {/* Suggestion */}
            {post.typePost === "Lost" &&
              user.email === post.user?.email &&
              !post.isReceived && (
                <div className="suggestion-lost-item">
                  <div className="suggestion-content">
                    <h1 style={{ textAlign: "center" }}>
                      Suggestions for your lost item
                    </h1>
                    <div
                      className="suggestion-card-container"
                      style={{
                        gridTemplateColumns:
                          suggestPosts.length === 0 && "unset",
                      }}
                    >
                      {suggestPosts.length > 0 ? (
                        suggestPosts.map((suggestion) => (
                          <div
                            className="card suggestion-card"
                            key={suggestion.postId}
                          >
                            {suggestion.image ? (
                              <img
                                src={suggestion.urlImage}
                                alt="picture of item"
                                style={{
                                  width: "100%",
                                  height: "300px",
                                  objectFit: "cover",
                                  backgroundColor: "white",
                                }}
                                loading="lazy"
                              />
                            ) : (
                              <div className="image-placeholder">
                                <i className="icon-image"></i>
                                <span>No image</span>
                              </div>
                            )}
                            <div
                              className="card-text suggestion-card-text"
                              style={{ marginBottom: "40px" }}
                            >
                              <div className="info-user-suggestion">
                                <img
                                  src={suggestion.user.urlAvatar}
                                  alt="avatar"
                                  width={50}
                                  height={50}
                                  style={{ borderRadius: "50%" }}
                                  loading="lazy"
                                />
                                <span>{`${suggestion.user.firstName} ${suggestion.user.lastName}`}</span>
                              </div>
                              <h3
                                style={{
                                  fontWeight: "700",
                                  marginBottom: "10px",
                                }}
                              >
                                <a href={`/detail-post/${suggestion.postId}`}>
                                  {suggestion.title}
                                </a>
                              </h3>
                              <a href={`/detail-post/${suggestion.postId}`}>
                                <ReactMarkdown
                                  children={suggestion.description}
                                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                                ></ReactMarkdown>
                              </a>
                            </div>

                            <button
                              className="btn"
                              style={{ width: "90%", marginLeft: "5%" }}
                              onClick={() => {
                                handleMatchPost(post.postId, suggestion.postId);
                              }}
                              disabled={isRequesting}
                            >
                              {isRequesting ? (
                                <i className="fas fa-spinner fa-spin"></i>
                              ) : (
                                <>
                                  <i className="fa-solid fa-hand-point-up"></i>{" "}
                                  This is my item
                                </>
                              )}
                            </button>

                            {/* Status */}
                            <div
                              className={
                                suggestion.typePost === "Found"
                                  ? "status-post-found"
                                  : "status-post-lost"
                              }
                            >
                              {suggestion.typePost}
                            </div>

                            {/* Show score */}
                            <div className="show-code">{suggestion.score}%</div>
                          </div>
                        ))
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            textAlign: "center",
                            width: "100%",
                            margin: "auto",
                          }}
                        >
                          <h3>No suggestions found</h3>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* Popup notice code */}
            {isShowPopup && (
              <div
                className="modal"
                id="popup-notice-verification-code"
                style={{ display: "flex" }}
              >
                <div className="modal-content">
                  <h2 style={{ backgroundColor: "transparent" }}>Your Code:</h2>

                  <div className="policy-section">
                    <h3>{code || "Not available"}</h3>
                    <p
                      style={{
                        fontSize: "16px",
                        color: "#555",
                        fontStyle: "italic",
                        marginTop: "4px",
                      }}
                    >
                      This code is used to verify ownership when retrieving your
                      lost item. Share it only with the person who has your
                      item. Keep it private.
                    </p>
                  </div>

                  <div style={{ marginTop: "40px" }}>
                    <button
                      aria-label="Okay button"
                      className="btn"
                      onClick={() => {
                        setIsShowPopup(false);
                      }}
                    >
                      Okay
                    </button>
                    {user.role === "Admin" && (
                      <button
                        aria-label="Print this code button"
                        className="btn-yellow"
                        onClick={() => {
                          window.print();

                          document.getElementById(
                            "popup-notice-code",
                          ).style.display = "none";
                        }}
                        style={{ marginLeft: "10px" }}
                      >
                        Print this code
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="not-found">
            <Suspense fallback={<p>Loading animation...</p>}>
              <DotLottieReact
                src="../assets/animations/Empty-Ghost.json"
                autoplay
                loop
                style={{ width: "30%", margin: "auto" }}
              />
            </Suspense>
            <h1 style={{ fontSize: "40px" }}>This Post Does Not Exist</h1>
            <p style={{ color: "", marginBottom: "20px" }}>
              Sorry, this post may have been removed or the link is incorrect.
            </p>
            <button
              aria-label="Go back button"
              className="btn"
              onClick={() => {
                window.history.back();
              }}
            >
              <i className="fa-solid fa-arrow-left"></i> Go Back
            </button>
          </div>
        )}
      </main>
    </>
  );
}
