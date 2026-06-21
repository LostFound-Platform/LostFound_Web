// import Lottie from "lottie-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import axiosInstance from "../api/axiosInstance";
import NotFoundPost from "../assets/animations/Not-Found-Post.json";
import Skeleton from "react-loading-skeleton";
import ReactMarkdown from "react-markdown";
import { useSearchParams } from "react-router-dom";

export default function Search() {
  // Variables
  let [categoryPosts, setCategoryPosts] = useState([]);
  let [posts, setPosts] = useState([]);
  let [isDropdownOpenType, setIsDropdownOpenType] = useState(false);
  let [isGettingPosts, setIsGettingPosts] = useState(false);
  let [isInProcessing, setIsInProcessing] = useState(false);
  let [status, setStatus] = useState("");
  let [categoryId, setCategoryId] = useState("");
  let [nameItem, setNameItem] = useState("");
  const [searchParams] = useSearchParams();
  const categoryIdOnUrl = searchParams.get("categoryId") || "";
  const statusOnUrl = searchParams.get("status") || "";

  // Functions
  // Get category posts
  const searchCategoryPosts = async () => {
    setIsInProcessing(true);

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
      setIsInProcessing(false);
    }
  };

  // Get all Posts
  const getAllPosts = async () => {
    setIsGettingPosts(true);

    try {
      const response = await axiosInstance.get("/Post/", {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status === 200) {
        setPosts(response.data);
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
      setIsGettingPosts(false);
    }
  };

  // Handle search
  const handleSearch = async (status, categoryId, name) => {
    setIsInProcessing(true);
    console.log("Searching with:", status, categoryId, name);
    try {
      const response = await axiosInstance.get(
        `/Post/regular-search?status=${status}&categoryId=${categoryId}&nameItem=${name}`,
        {
          // withCredentials: true,
          validateStatus: (status) =>
            status === 200 || status === 401 || status === 404,
        },
      );

      if (response.status === 200) {
        setPosts(response.data);
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

  // UseEffect
  useEffect(() => {
    searchCategoryPosts();
    if (categoryIdOnUrl || statusOnUrl) {
      handleSearch(statusOnUrl, categoryIdOnUrl, "");
    } else {
      getAllPosts();
    }
  }, []);

  return (
    <>
      {/* Helmet for setting the page title */}
      <Helmet>
        <title>Search | Back2Me </title>
      </Helmet>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          handleSearch(status, categoryId, nameItem);
        }}
        className="search-form"
      >
        <div className="filter">
          <div className="top-filter">
            <div className="status-filter">
              <p
                style={{
                  backgroundColor: "#072138",
                  width: "max-content",
                  color: "white",
                  padding: "1px 30px",
                  borderRadius: "20px",
                  position: "absolute",
                  top: "-50%",
                  left: "0",
                  marginTop: "20px",
                }}
              >
                Status
              </p>
              <input
                type="radio"
                name="status"
                onChange={() => {
                  setStatus("");
                }}
                id="search-all"
                defaultChecked
              />{" "}
              <label htmlFor="search-all" id="search-all-label">
                <strong>All</strong>
              </label>
              <input
                type="radio"
                name="status"
                id="lost"
                onChange={() => {
                  setStatus("Lost");
                }}
                style={{ marginLeft: "20px", marginTop: "25px" }}
              />{" "}
              <label htmlFor="lost" style={{ marginRight: "25px" }}>
                <strong>Lost</strong>
              </label>
              <input
                type="radio"
                name="status"
                onChange={() => {
                  setStatus("Found");
                }}
                id="found"
              />{" "}
              <label htmlFor="found">
                <strong>Found</strong>
              </label>
            </div>

            <div className="detail-filter">
              <p>
                <label htmlFor="type">Type of Item</label>
              </p>
              <select
                name=""
                id="type"
                onClick={() => {
                  setIsDropdownOpenType(!isDropdownOpenType);
                }}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                }}
                className="form-control"
              >
                <option value="">Select type</option>
                {categoryPosts.map((item) => (
                  <option key={item.categoryPostId} value={item.categoryPostId}>
                    {item.categoryPostName}
                  </option>
                ))}
              </select>
              {isDropdownOpenType ? (
                <i className="fa-solid fa-caret-up caret-type"></i>
              ) : (
                <i className="fa-solid fa-caret-down caret-type"></i>
              )}
            </div>
            <div className="detail-filter name-item">
              <p>
                <label htmlFor="name">Item name</label>
              </p>
              <input
                id="name"
                type="text"
                className="form-control"
                placeholder="Enter name"
                onChange={(e) => {
                  setNameItem(e.target.value);
                }}
              />
            </div>
            <button
              className="btn-yellow btn-use-filter"
              style={{ marginLeft: "auto" }}
              disabled={isInProcessing}
              aria-label="Use Filter button"
            >
              {isInProcessing ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <>
                  <i className="fa-solid fa-sliders"></i> Use Filter
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Cards section */}
      <div className={posts.length > 0 ? `card-row` : ""}>
        {isGettingPosts ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto auto auto",
              gap: "16px",
            }}
            className="skeleton-loading"
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="" key={index} style={{ marginBottom: "60px" }}>
                <Skeleton
                  height={
                    isInProcessing &&
                    window.matchMedia("(max-width: 576px)").matches // check mobile size
                      ? 193
                      : 290
                  }
                  width={
                    isInProcessing &&
                    window.matchMedia("(max-width: 576px)").matches // check mobile size
                      ? 170
                      : 405
                  }
                  style={{ marginBottom: "10px", borderRadius: "20px" }}
                />
                <div className="">
                  <h3 style={{ fontWeight: "700", marginBottom: "10px" }}>
                    <Skeleton
                      height={35}
                      width={
                        isInProcessing &&
                        window.matchMedia("(max-width: 576px)").matches // check mobile size
                          ? 170
                          : 405
                      }
                    />
                  </h3>
                  <p>
                    <Skeleton
                      count={3}
                      width={
                        isInProcessing &&
                        window.matchMedia("(max-width: 576px)").matches // check mobile size
                          ? 170
                          : 405
                      }
                    />
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isGettingPosts &&
          (posts.length > 0 ? (
            posts.map((item) => (
              <div
                className="card card-search"
                style={{ cursor: "pointer" }}
                key={item.postId}
                onClick={() => {
                  window.location.href = `/detail-post/${item.postId}`;
                }}
              >
                {item.image ? (
                  <img
                    src={item.urlImage}
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
                    {item.user.avatar ? (
                      <img
                        src={item.user.urlAvatar}
                        alt="avatar"
                        width={50}
                        height={50}
                        style={{ borderRadius: "50%" }}
                        loading="lazy"
                      />
                    ) : (
                      <img
                        src="/Image/user_icon.png"
                        alt="avatar"
                        width={50}
                        height={50}
                        style={{ borderRadius: "50%" }}
                        loading="lazy"
                      />
                    )}
                    <span>{`${item.user.firstName} ${item.user.lastName}`}</span>
                  </div>
                  <h3 style={{ fontWeight: "700", marginBottom: "10px" }}>
                    <a href={`/detail-post/${item.postId}`}>{item.title}</a>
                  </h3>
                  <ReactMarkdown
                    children={item.description}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  ></ReactMarkdown>
                </div>

                {/* Status */}
                <div
                  className={
                    item.typePost === "Found"
                      ? "status-post-found"
                      : "status-post-lost"
                  }
                >
                  {item.typePost}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <Suspense fallback={<p>Loading animation...</p>}>
                <DotLottieReact
                  src="../assets/animations/NotFoundPost.json"
                  className="m-auto no-data"
                  style={{ width: "15%" }}
                  autoplay
                  loop
                />
              </Suspense>
              <h1 className="no-posts">No posts yet</h1>
            </div>
          ))
        )}
      </div>
    </>
  );
}
