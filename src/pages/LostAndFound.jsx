// import Lottie from "lottie-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Skeleton from "react-loading-skeleton";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import NotFoundPost from "../assets/animations/Not-Found-Post.json";
import axiosInstance from "../api/axiosInstance";

export default function LostAndFound() {
  // Variables
  let [posts, setPosts] = useState([]);
  let [isInProcessing, setIsInProcessing] = useState(false);

  // Get all Posts
  const getAllPosts = async () => {
    setIsInProcessing(true);

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
      setIsInProcessing(false);
    }
  };

  // UseEffect
  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <>
      {/* Helmet for setting the page title */}
      <Helmet>
        <title>All Posts | Back2Me </title>
      </Helmet>

      <main>
        <div
          className="title-lost-and-found"
          style={{
            display: "flex",
            gap: "2%",
            padding: " 70px 10px",
          }}
        >
          <p style={{ fontSize: "30px" }}>
            <span
              style={{
                fontFamily: "Mochiy Pop One, sans-serif",
              }}
            >
              Lost & Found
            </span>{" "}
            posts
          </p>
        </div>

        <div className={posts.length > 0 ? "newest-post-container" : ""}>
          {/* Cards */}
          {isInProcessing ? (
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
          ) : posts.length > 0 ? (
            posts.map((item) => (
              <div
                className="card suggestion-card"
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <h3 style={{ fontWeight: "700", marginBottom: "10px" }}>
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
                        (<i className="fa-solid fa-circle-check"></i> Received)
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
                margin: "auto",
                textAlign: "center",
              }}
            >
              <Suspense fallback={<p>Loading animation...</p>}>
                <DotLottieReact
                  data={JSON.stringify(NotFoundPost)}
                  autoplay
                  loop
                  style={{ width: "20%", margin: "auto" }}
                />
              </Suspense>
              <h1 className="no-posts">No posts yet</h1>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
