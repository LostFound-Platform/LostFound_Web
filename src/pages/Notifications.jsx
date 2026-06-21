// import Lottie from "lottie-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import SidebarProfile from "../components/SidebarProfile";
import { Suspense, useEffect, useState } from "react";
import NotFoundPost from "../assets/animations/Not-Found-Post.json";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axiosInstance from "../api/axiosInstance";

export default function Notifications() {
  // Variables
  const [isInProcessing, setIsInProcessing] = useState(false);
  const [notificationsMatchImage, setNotificationsMatchImage] = useState([]);
  const [notificationsMatchDescription, setNotificationsMatchDescription] =
    useState([]);

  // Functions
  // Get notifications with similar images
  const handleFetchNotificationsMatchImage = async () => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get(
        "/Notification/my-notifications-match-image",
        {
          // withCredentials: true,
          validateStatus: (status) =>
            status === 200 || status === 401 || status === 404,
        },
      );

      if (response.status === 200) {
        setNotificationsMatchImage(response.data);
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

  // Get notifications with similar descriptions
  const handleFetchNotificationsMatchDescription = async () => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get(
        "/Notification/my-notifications-match-description",
        {
          // withCredentials: true,
          validateStatus: (status) =>
            status === 200 || status === 401 || status === 404,
        },
      );

      if (response.status === 200) {
        setNotificationsMatchDescription(response.data);
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

  // UseEffects
  // Fetch notifications on load
  useEffect(() => {
    handleFetchNotificationsMatchImage();
    handleFetchNotificationsMatchDescription();
  }, []);

  return (
    <>
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
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "100px",
            gap: "30px",
          }}
        >
          <div style={{ width: "100%" }}>
            <h3
              style={{
                fontWeight: "500",
              }}
            >
              We found some posts with
              <span
                style={{
                  fontFamily: "Mochiy Pop One, sans-serif",
                  fontSize: "20px",
                  fontWeight: "100",
                  marginLeft: "10px",
                }}
              >
                similar images
              </span>
            </h3>
          </div>

          {/* Card */}
          <div className="newest-post-container notification-container">
            {/* Cards */}
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
            ) : notificationsMatchImage.length > 0 ? (
              notificationsMatchImage.map((item) => (
                <div
                  className="card card-notification"
                  key={item.notificationId}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    onClick={() => {
                      window.location.href = `/detail-post/${item.postMatchedId}`;
                    }}
                  >
                    {/* Image */}
                    {item.imagePostMatched ? (
                      <img
                        src={item.urlImagePostMatched}
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
                      className="card-text card-text-notification"
                      style={{ marginBottom: "20px" }}
                    >
                      <div className="info-user-suggestion">
                        {item.avatarUserMatched ? (
                          <img
                            src={item.urlAvatarUserMatched}
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
                        <span>{`${item.firstNameMatched} ${item.lastNameMatched}`}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h3 style={{ fontWeight: "700", marginBottom: "10px" }}>
                          <a href={`/detail-post/${item.postMatchedId}`}>
                            {item.titlePostMatched}
                          </a>
                        </h3>
                      </div>
                      <a href={`/detail-post/${item.postMatchedId}`}>
                        <ReactMarkdown
                          children={item.descriptionPostMatched}
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
          <div style={{ width: "100%" }}>
            <h3
              style={{
                fontWeight: "500",
              }}
            >
              We found some posts with
              <span
                style={{
                  fontFamily: "Mochiy Pop One, sans-serif",
                  fontSize: "20px",
                  fontWeight: "100",
                  marginLeft: "10px",
                }}
              >
                similar descriptions
              </span>
            </h3>
          </div>

          {/* Card */}
          <div className="newest-post-container notification-container">
            {/* Cards */}
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
            ) : notificationsMatchDescription.length > 0 ? (
              notificationsMatchDescription.map((item) => (
                <div
                  className="card card-notification"
                  key={item.notificationId}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    onClick={() => {
                      window.location.href = `/detail-post/${item.postMatchedId}`;
                    }}
                  >
                    {/* Image */}
                    {item.imagePostMatched ? (
                      <img
                        src={item.urlImagePostMatched}
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
                      className="card-text card-text-notification"
                      style={{ marginBottom: "20px" }}
                    >
                      <div className="info-user-suggestion">
                        {item.avatarUserMatched ? (
                          <img
                            src={item.urlAvatarUserMatched}
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
                        <span>{`${item.firstNameMatched} ${item.lastNameMatched}`}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h3 style={{ fontWeight: "700", marginBottom: "10px" }}>
                          <a href={`/detail-post/${item.postId}`}>
                            {item.titlePostMatched}
                          </a>
                        </h3>
                      </div>
                      <a href={`/detail-post/${item.postId}`}>
                        <ReactMarkdown
                          children={item.descriptionPostMatched}
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
    </>
  );
}
