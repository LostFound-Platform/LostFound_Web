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

export default function MyPost() {
  // Variables
  const [posts, setPosts] = useState([]);
  const [isInProcessing, setIsInProcessing] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [user, setUser] = useState("");
  const [pickUpDate, setPickUpDate] = useState("");
  const [matchedPosts, setMatchedPosts] = useState({});
  const [handoverStatus, setHandoverStatus] = useState({});
  const [pickUpStatus, setPickUpStatus] = useState({});
  const [objectToShowPopup, setObjectToShowPopup] = useState({
    name: "",
    code: "",
    postId: "",
  });

  // APIs

  // Functions
  // Handle mark received
  const handleMarkReceived = async (postId) => {
    setIsRequesting(true);

    try {
      const response = await axiosInstance.post(
        `/Post/mark-received/${postId}`,
        null,
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
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: response.data?.message,
              status: "success",
            },
          }),
        );
      }

      if (response.status === 403) {
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "You don't have permission to perform this action",
              status: "error",
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
      setIsRequesting(false);
    }
  };

  // Handle pick later
  const handlePickLater = async (postId) => {
    setIsRequesting(true);

    try {
      const response = await axiosInstance.delete(
        `/PickUpRequest/pick-later/${postId}`,
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
      setIsRequesting(false);
    }
  };

  // Handle accept time rescheduled
  const handleAcceptTimeRescheduled = async (requestId) => {
    setIsRequesting(true);

    try {
      const response = await axiosInstance.post(
        `/PickUpRequest/accept-time-rescheduled/${requestId}`,
        null,
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
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: response.data?.message,
              status: "success",
            },
          }),
        );
      }

      if (response.status === 403) {
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "You don't have permission to perform this action",
              status: "error",
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
      setIsRequesting(false);
    }
  };

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

  // Handle Handover to admin
  const handleCreateRequest = async () => {
    setIsRequesting(true);

    try {
      const response = await axiosInstance.post(
        "/TransferRequests",
        {
          postId: objectToShowPopup.postId,
          oldUserId: user.userId,
        },
        {
          // withCredentials: true,
          validateStatus: (status) =>
            status === 200 || status === 401 || status === 404,
        },
      );

      if (response.status === 200) {
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: response.data?.message,
              status: "success",
            },
          }),
        );

        document.getElementById("popup-confirm-handover").style.display =
          "none";
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

  // Handle notify admin pick up
  const handleNotifyAdminPickUp = async () => {
    setIsRequesting(true);

    if (pickUpDate.trim() === "") {
      window.dispatchEvent(
        new CustomEvent("app-error", {
          detail: {
            message: "Please select the date and time for pick-up",
            status: "warning",
          },
        }),
      );
      return;
    }

    const payload = {
      requestId: 0,
      postId: objectToShowPopup.postId,
      description: "n",
      pickUpDate: pickUpDate,
      status: "Pending",
    };

    try {
      const response = await axiosInstance.post("/PickUpRequest", payload, {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status === 200) {
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: response.data?.message,
              status: "success",
            },
          }),
        );

        document.getElementById("popup-pick-up").style.display = "none";
        setPickUpDate("");
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

  // Handle sort by status
  const handleSortByStatus = async (status) => {
    if (status === "All") {
      handleFetchPosts();
      return;
    }

    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get(
        `/Post/sort-status?typePost=${status}`,
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

  // Handle check matched post
  const handleCheckMatchedPost = async (postId) => {
    try {
      const response = await axiosInstance.get(
        `/Match/check-matched-post/${postId}`,
        {
          // withCredentials: true,
          validateStatus: (status) =>
            status === 200 || status === 401 || status === 404,
        },
      );

      if (response.status === 200) {
        setMatchedPosts((prev) => ({
          ...prev,
          [postId]: response.status === 200,
        }));
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
      // setIsInProcessing(false);
    }
  };

  // Get my profile
  const getMyProfile = async () => {
    // setIsInProcessing(true);

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
      console.log(error);
    } finally {
      // setIsInProcessing(false);
    }
  };

  // Get posts
  const handleFetchPosts = async () => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get("/Post/my-posts", {
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

  // Get status hand over
  const handleGetStatusHandover = async () => {
    // setIsInProcessing(true);

    const results = {};

    try {
      for (const post of posts) {
        if (post.typePost === "Found") {
          const response = await axiosInstance.get(
            `/TransferRequests/status-request-post/${post.postId}`,
            {
              // withCredentials: true,
              validateStatus: (status) =>
                status === 200 || status === 401 || status === 404,
            },
          );

          results[post.postId] = response.data;
        }
      }

      setHandoverStatus(results);
    } catch (error) {
      console.log(error);

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
      // setIsInProcessing(false);
    }
  };

  // Get status pick up
  const handleGetStatusPickUp = async () => {
    // setIsInProcessing(true);

    const results = {};

    try {
      for (const post of posts) {
        if (post.typePost === "Lost") {
          const response = await axiosInstance.get(
            `/PickUpRequest/check-status-post-pick-up/${post.postId}`,
            {
              // withCredentials: true,
              validateStatus: (status) =>
                status === 200 || status === 401 || status === 404,
            },
          );

          results[post.postId] = response.data;
        }
      }

      setPickUpStatus(results);
    } catch (error) {
      console.log(error);

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
      // setIsInProcessing(false);
    }
  };

  // Fetch data from API
  useEffect(() => {
    handleFetchPosts();
    getMyProfile();
    connectToSignalR(); // Run realtime
  }, []);

  useEffect(() => {
    handleGetStatusHandover();
    handleGetStatusPickUp();
    posts.forEach((post) => handleCheckMatchedPost(post.postId));
  }, [posts]);

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
                  handleSortByStatus("All");
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
                  handleSortByStatus("Lost");
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
                  handleSortByStatus("Found");
                }}
                id="found"
              />{" "}
              <label htmlFor="found">
                <strong>Found</strong>
              </label>
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

                      {/* Buttons */}
                      {(post.typePost === "Lost" || user.role === "Admin") && (
                        <>
                          <div
                            className={
                              matchedPosts[post.postId] && !post.isReceived
                                ? "btn-my-post-container"
                                : "btn-my-post-container-no-matched"
                            }
                          >
                            {matchedPosts[post.postId] &&
                              !post.isReceived &&
                              pickUpStatus[post.postId]?.status !==
                                "Reschedule" && (
                                <button
                                  className="btn-yellow btn-pick-up"
                                  style={{
                                    width: "100%",
                                  }}
                                  onClick={() => {
                                    document.getElementById(
                                      "popup-pick-up",
                                    ).style.display = "flex";
                                    document.body.style.overflow = "hidden";

                                    setObjectToShowPopup({
                                      name: post.title,
                                      code: post.code,
                                      postId: post.postId,
                                    });
                                  }}
                                  disabled={
                                    pickUpStatus[post.postId]?.status ===
                                      "Pending" ||
                                    pickUpStatus[post.postId]?.status ===
                                      "Confirmed"
                                  }
                                >
                                  {pickUpStatus[post.postId]?.status ===
                                  "Pending" ? (
                                    <>
                                      <i className="fa-solid fa-user-clock"></i>{" "}
                                      Awaiting admin
                                    </>
                                  ) : pickUpStatus[post.postId]?.status ===
                                    "Confirmed" ? (
                                    <>
                                      <i className="fa-solid fa-circle-check"></i>{" "}
                                      You're good to go!
                                    </>
                                  ) : (
                                    <>
                                      <i className="fa-solid fa-person-walking"></i>{" "}
                                      I'm picking up
                                    </>
                                  )}
                                </button>
                              )}

                            {post.typePost === "Lost" && !post.isReceived && (
                              <button
                                className="btn"
                                style={{
                                  width: "100%",
                                }}
                                onClick={() => {
                                  handleMarkReceived(post.postId);
                                }}
                                disabled={
                                  pickUpStatus[post.postId]?.status ===
                                    "Pending" ||
                                  pickUpStatus[post.postId]?.status ===
                                    "Confirmed" ||
                                  isRequesting
                                }
                              >
                                {isRequesting ? (
                                  <i className="fas fa-spinner fa-spin"></i>
                                ) : (
                                  <>
                                    <i className="fa-solid fa-check"></i>{" "}
                                    Received
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                          {pickUpStatus[post.postId]?.status ===
                          "Reschedule" ? (
                            <div
                              className="btn-yellow"
                              style={{
                                width: "100%",
                                marginTop: "30px",
                                cursor: "auto",
                              }}
                            >
                              <div>
                                <i className="fa-solid fa-calendar"></i>{" "}
                                Rescheduled to{" "}
                                {dayjs(
                                  pickUpStatus[post.postId].pickUpDate,
                                ).format("MM/DD/YYYY h:mm:ss A")}
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {isRequesting ? (
                                  <div
                                    style={{
                                      marginTop: "20px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    <i className="fas fa-spinner fa-spin"></i>
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      className="btn"
                                      onClick={() => {
                                        handleAcceptTimeRescheduled(
                                          pickUpStatus[post.postId].requestId,
                                        );
                                      }}
                                      disabled={isRequesting}
                                    >
                                      Accept
                                    </button>
                                    <button
                                      className="btn-with-border"
                                      onClick={() => {
                                        handlePickLater(post.postId);
                                      }}
                                      disabled={isRequesting}
                                    >
                                      I'll pick it later!
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </>
                      )}

                      {post.typePost === "Found" &&
                        user.role !== "Admin" &&
                        !post.isReceived && (
                          <button
                            className="btn"
                            style={{ width: "100%" }}
                            onClick={() => {
                              document.getElementById(
                                "popup-confirm-handover",
                              ).style.display = "flex";
                              document.body.style.overflow = "hidden";

                              setObjectToShowPopup({
                                name: post.title,
                                code: post.code,
                                postId: post.postId,
                              });
                            }}
                            disabled={
                              handoverStatus[post.postId]?.status === "Pending"
                            }
                          >
                            {handoverStatus[post.postId]?.status ===
                            "Pending" ? (
                              <>
                                <i className="fa-solid fa-user-clock"></i>{" "}
                                Awaiting admin
                              </>
                            ) : (
                              <>
                                <i className="fa-solid fa-arrow-right-to-bracket"></i>{" "}
                                Handed over to admin
                              </>
                            )}
                          </button>
                        )}
                    </div>

                    {user.role === "Admin" &&
                      post.typePost === "Found" &&
                      !post.isReceived && (
                        <button
                          className="btn"
                          style={{ width: "100%" }}
                          onClick={() => {
                            const code = `Code: ${post.code}`;

                            window.dispatchEvent(
                              new CustomEvent("codeToPrint", {
                                detail: code,
                              }),
                            );
                          }}
                        >
                          <i className="fa-solid fa-print"></i> Print Code
                        </button>
                      )}
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
                        autoplay
                        loop
                        style={{ width: "60%", margin: "auto" }}
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
      <div className="modal" id="popup-confirm-handover">
        <div className="modal-content">
          <h2 style={{ backgroundColor: "transparent" }}>
            Have you handed{" "}
            <span style={{ color: "#ec7207" }}>{objectToShowPopup.name}</span>{" "}
            over to the admin?
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
              Please confirm that you have handed the {objectToShowPopup.name}{" "}
              over to the admin.
            </p>
          </div>

          <div style={{ marginTop: "40px" }}>
            <button
              aria-label="Confirm handover button"
              className="btn"
              onClick={() => {
                handleCreateRequest();
              }}
            >
              Confirm
            </button>
            <button
              aria-label="Cancel handover button"
              className="btn-yellow"
              onClick={() => {
                document.getElementById(
                  "popup-confirm-handover",
                ).style.display = "none";
                document.body.style.overflow = "auto";
              }}
              style={{ marginLeft: "10px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Popup pick up */}
      <div className="modal" id="popup-pick-up">
        <div className="modal-content">
          <h2 style={{ backgroundColor: "transparent" }}>
            Ready to pick up{" "}
            <span style={{ color: "#ec7207" }}>{objectToShowPopup.name}</span>{" "}
            today?
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
              By confirming, you will notify the admin that you are preparing to
              pick up the {objectToShowPopup.name}. You will wait for the admin
              to approve the time, and our system will notify you when you can
              start picking up.
            </p>

            <h3 style={{ backgroundColor: "transparent", marginTop: "10px" }}>
              Pick-up date and time
            </h3>
            <input
              type="datetime-local"
              value={pickUpDate}
              min={new Date().toISOString().slice(0, 16)} // Not allow to choose date in the past
              onChange={(e) => setPickUpDate(e.target.value)}
              className="datetime-input"
            />
          </div>

          <div style={{ marginTop: "40px" }}>
            <button
              aria-label="Notify admin pick up button"
              className="btn"
              onClick={() => {
                handleNotifyAdminPickUp();
              }}
              disabled={isRequesting}
            >
              {isRequesting ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                "I'm picking up"
              )}
            </button>
            <button
              aria-label="Cancel pick up button"
              className="btn-yellow btn-cancel-pick-up"
              onClick={() => {
                document.getElementById("popup-pick-up").style.display = "none";
                document.body.style.overflow = "auto";
              }}
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
