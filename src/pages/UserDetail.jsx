import { Suspense, useEffect, useState } from "react";
import SidebarProfile from "../components/SidebarProfile";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import Skeleton from "react-loading-skeleton";
// import Lottie from "lottie-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import NotFoundPost from "../assets/animations/Not-Found-Post.json";
import { HubConnectionBuilder } from "@microsoft/signalr";
import dayjs from "dayjs";
import axiosInstance from "../api/axiosInstance";

export default function UserDetail() {
  // Variables
  const userId = location.pathname.split("/").pop();
  const [posts, setPosts] = useState([]);
  const [isInProcessing, setIsInProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [handoverStatus, setHandoverStatus] = useState({});
  const [pickUpStatus, setPickUpStatus] = useState({});
  const [objectToShowPopup, setObjectToShowPopup] = useState({
    name: "",
    code: "",
    postId: "",
  });

  // APIs

  // Functions
  // Realtime
  const connectToSignalR = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const connection = new HubConnectionBuilder()
        .withUrl(
          "https://lost-and-found-cqade7hfbjgvcbdq.centralus-01.azurewebsites.net/SystemHub",
          {
            // withCredentials: true,
            accessTokenFactory: () => token,
          },
        )
        .withAutomaticReconnect()
        .build();

      // Listen event from backend
      // Remove post was transferred
      connection.on("ReceivePostHandedOver", (data) => {
        setPosts((prePosts) => {
          return prePosts.filter((p) => p.postId !== data.postId);
        });
      });

      connection.on("ReceiveStatusPost", (data) => {
        setHandoverStatus((preStatus) => {
          return {
            ...preStatus,
            [data.postId]: {
              ...preStatus[data.postId],
              status: data.status,
            },
          };
        });
      });

      connection.on("ReceiveStatusPickUpPost", (data) => {
        setPickUpStatus((preStatus) => {
          return {
            ...preStatus,
            [data.postId]: {
              ...preStatus[data.postId],
              status: data.status,
            },
          };
        });
      });

      connection.on("ReceiveStatusPostCancelled", (data) => {
        setHandoverStatus((preStatus) => {
          return {
            ...preStatus,
            [data.postId]: {
              ...preStatus[data.postId],
              status: data.status,
            },
          };
        });

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Your request was not approved by the admin",
              status: "warning",
            },
          }),
        );
      });

      // Start realtime
      await connection.start();

      return () => {
        connection.stop(); // Ignore leaks memory
      };
    } catch (error) {
      console.log(error);
    }
  };

  // Handle delete post
  const handleDeletePost = async (postId) => {
    setIsDeleting(true);

    try {
      const response = await axiosInstance.delete(`/Post/${postId}`, {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status === 200) {
        handleFetchPosts();

        document.getElementById("popup-confirm-delete").style.display = "none";
        document.body.style.overflow = "auto";

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: response.data?.message,
              status: "success",
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
      setIsDeleting(false);
    }
  };

  // Get posts
  const handleFetchPosts = async () => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get(`/Post/user-posts/${userId}`, {
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

  // Fetch data from API
  useEffect(() => {
    handleFetchPosts();
    connectToSignalR(); // Run realtime
  }, []);

  useEffect(() => {
    const handleCodeToPrint = (event) => {
      const code = event.detail;

      document.getElementById("print-code").innerHTML = code;
      window.print();
    };

    window.addEventListener("codeToPrint", handleCodeToPrint);

    return () => {
      window.removeEventListener("codeToPrint", handleCodeToPrint);
    };
  }, []);

  return (
    <>
      <main>
        <div
          className="sidebar-and-content"
          style={{
            display: "grid",
            gridTemplateColumns: "15% 85%",
            gap: "50px",
            // backgroundColor: "pink",
            position: "relative",
          }}
        >
          {/* Menu for profile */}
          <SidebarProfile></SidebarProfile>

          {/* Post similar to you */}
          <div
            className="my-post-content"
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "100px",
              gap: "30px",
            }}
          >
            <div className="status-filter">
              <button
                className="btn-yellow"
                onClick={() => {
                  window.history.back();
                }}
              >
                <i className="fa-solid fa-arrow-left"></i> Go Back
              </button>
            </div>

            {/* Cards */}
            <div className="newest-post-container my-post-container">
              {isInProcessing ? (
                <div
                  style={{ display: "flex", gap: "20px" }}
                  className="skeleton-my-post"
                >
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div className="" key={index}>
                      <Skeleton
                        height={290}
                        style={{ marginBottom: "10px", borderRadius: "20px" }}
                      />
                      <div className="">
                        <h3 style={{ fontWeight: "700", marginBottom: "10px" }}>
                          <Skeleton height={35} width={345} />
                        </h3>
                        <p>
                          <Skeleton count={3} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    className="card card-my-post"
                    key={post.postId}
                    style={{ cursor: "pointer" }}
                  >
                    <div>
                      <div
                        onClick={() => {
                          window.location.href = `/detail-post/${post.postId}`;
                        }}
                      >
                        {/* Image */}
                        {post.image ? (
                          <img
                            src={post.image ? post.urlImage : ""}
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
                                href={`/detail-post/${post.postId}`}
                                aria-label={`Detail link for ${post.title}`}
                              >
                                {post.title}
                              </a>
                            </h3>
                            {post.isReceived && (
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
                            {post.oldUserId && (
                              <label
                                style={{
                                  // fontSize: "13px",
                                  fontWeight: 500,
                                  color: "#6b7280",
                                }}
                              >
                                (Transferred)
                              </label>
                            )}
                          </div>
                          <a
                            href={`/detail-post/${post.postId}`}
                            aria-label={`Detail link for ${post.title}`}
                          >
                            <ReactMarkdown
                              children={post.description}
                              rehypePlugins={[rehypeRaw, rehypeSanitize]}
                            ></ReactMarkdown>
                          </a>
                        </div>

                        {/* Status */}
                        <div
                          className={
                            post.typePost === "Lost"
                              ? "status-post-lost"
                              : "status-post-found"
                          }
                        >
                          {post.typePost}
                        </div>
                      </div>

                      <button
                        className="btn"
                        style={{ width: "100%" }}
                        onClick={() => {
                          document.getElementById(
                            "popup-confirm-delete",
                          ).style.display = "flex";
                          document.body.style.overflow = "hidden";

                          setObjectToShowPopup({
                            name: post.title,
                            code: post.code,
                            postId: post.postId,
                          });
                        }}
                      >
                        <i className="fa-solid fa-trash-can"></i> Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div
                    className="no-post-my-post"
                    style={{
                      marginLeft: "100%",
                      width: "100%",
                      textAlign: "center",
                      marginTop: "50px",
                    }}
                  >
                    <Suspense fallback={<p>Loading animation...</p>}>
                      <DotLottieReact
                        src="../assets/animations/NotFoundPost.json"
                        className="m-auto"
                        style={{ width: "60%", margin: "auto" }}
                        autoplay
                        loop
                      />
                    </Suspense>
                    <h1>No posts yet</h1>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="print-code" id="print-code"></div>
      </main>

      {/* Popup confirm handover to admin */}
      <div className="modal" id="popup-confirm-delete">
        <div className="modal-content">
          <h2 style={{ backgroundColor: "transparent" }}>
            Are you sure you want to delete{" "}
            <span style={{ color: "#ec7207" }}>"{objectToShowPopup.name}"</span>
            ?
          </h2>

          <div className="policy-section">
            <p
              style={{
                fontSize: "16px",
                color: "#555",
                fontStyle: "italic",
                marginTop: "4px",
              }}
            >
              Please confirm that you want to delete "{objectToShowPopup.name}".
            </p>
          </div>

          <div style={{ marginTop: "40px" }}>
            <button
              aria-label="Confirm handover button"
              className="btn"
              onClick={() => {
                handleDeletePost(objectToShowPopup.postId);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                "Confirm"
              )}
            </button>
            <button
              aria-label="Cancel handover button"
              className="btn-yellow"
              onClick={() => {
                document.getElementById("popup-confirm-delete").style.display =
                  "none";
                document.body.style.overflow = "auto";
              }}
              disabled={isDeleting}
              style={{ marginLeft: "10px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
