import ModalReportStuff from "./ModalReportStuff";
import { Suspense, useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import DocumentScan from "../assets/animations/Document-OCR-Scan.json";
import axiosInstance from "../api/axiosInstance";
import Skeleton from "react-loading-skeleton";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { HubConnectionBuilder } from "@microsoft/signalr";

export default function Header() {
  // Variables
  let [code, setCode] = useState("");
  let [user, setUser] = useState("");
  let [selectedFoundPost, setSelectedFoundPost] = useState("");
  const [resultByAI, setResultByAI] = useState([]);
  let [posts, setPosts] = useState([]);
  let [isInProcessing, setIsInProcessing] = useState(false);
  const [isShowPopup, setIsShowPopup] = useState(false);
  let [isRequesting, setIsRequesting] = useState(false);
  let [isLoadingMyPost, setIsLoadingMyPost] = useState(false);
  let [showMenu, setShowMenu] = useState(false);
  let [msgErrorAI, setMsgErrorAI] = useState("");

  // APIs
  const API_URL_Auth = `/CheckAuth/check-auth`;

  // Functions
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
      // Get new request
      connection.on("ReceiveNewRequest", (data) => {
        // notice admin toast
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: data.message,
              status: "success",
            },
          }),
        );
      });

      // Auto sign out when account is suspended
      connection.on("ReceiveForceSignOut", (data) => {
        // notice admin toast
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: data.message,
              status: "success",
            },
          }),
        );

        localStorage.removeItem("accessToken");
        window.location.href = "/authentication";
      });

      connection.on("ReceiveNewPickUpRequest", (data) => {
        // notice admin toast
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: data.message,
              status: "success",
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

  const handleSearchByImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1014 * 1014;

    // Check type of file
    if (!allowedTypes.includes(file.type)) {
      alert("Only accept JPG, PNG or WebP files");
      return;
    }

    if (file.size > maxSize) {
      alert("The image exceeds 5MB. Please select a smaller image");
      return;
    }

    // Close result modal
    const modal = document.querySelector(".modal-result-by-ai");
    modal.style.visibility = "hidden";
    modal.style.opacity = "0";
    document.body.style.overflow = "auto";

    const overlay = document.getElementById("overlay-search-image");
    overlay.style.visibility = "visible";
    overlay.style.opacity = "1";
    document.body.style.overflow = "hidden";

    const formData = new FormData();
    formData.append("image", file);

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
        // Call search API
        searchImageSimilarity(res.data);

        // Reset input file
        e.target.value = null;
      }
    } catch (error) {
      // Reset input file
      e.target.value = null;

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Server error";

        setMsgErrorAI({
          msg: message,
          status: status,
        });
      } else if (error.request) {
        // If offline
        if (!navigator.onLine) {
          setMsgErrorAI({
            msg: "Network error. Please check your internet connection",
            status: 0,
          });
        } else {
          // Server offline
          setMsgErrorAI({
            msg: "Server is currently unavailable. Please try again later.",
            status: 503,
          });
        }
      } else {
        // Other errors
        setMsgErrorAI({
          msg: "Something went wrong. Please try again",
          status: 500,
        });
      }
    }
  };

  // Check authentication status and redirect if not authenticated
  const checkAuthentication = () => {
    axiosInstance.get(API_URL_Auth).catch((err) => {
      console.error(err);
    });
  };

  const signOut = async () => {
    // e.preventDefault();

    try {
      const response = await axiosInstance.post(`/Users/sign-out`, null, {
        headers: {
          "Content-Type": "application/json",
        },
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status == 200) {
        localStorage.removeItem("accessToken");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMyProfile = async () => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get("/Users/profile", {
        // // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status === 200) {
        setUser(response.data);
      }

      if (response.status === 401) {
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Unauthorized access. Please sign in again.",
              status: "warning",
            },
          }),
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsInProcessing(false);
    }
  };

  const searchImageSimilarity = async (vector) => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.post(
        "/Post/search-image-similarity",
        vector,
        {
          // withCredentials: true,
          validateStatus: (status) =>
            status === 200 || status === 401 || status === 404,
        },
      );

      if (response.status === 200) {
        const overlay = document.getElementById("overlay-search-image");
        overlay.style.visibility = "hidden";
        overlay.style.opacity = "0";
        document.body.style.overflow = "auto";

        document.getElementById("modal-result-by-ai").style.visibility =
          "visible";
        document.getElementById("modal-result-by-ai").style.opacity = "1";
        document.body.style.overflow = "hidden";

        setResultByAI(response.data);
      }

      if (response.status === 401) {
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: "Unauthorized access. Please sign in again.",
              status: "warning",
            },
          }),
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsInProcessing(false);
    }
  };

  // UseEffect
  useEffect(() => {
    getMyProfile();
    connectToSignalR();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          backgroundColor: "#fffde3ff",
          position: "sticky",
          top: "0",
          zIndex: "1",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        className="nav"
      >
        <a href="/" aria-label="Back2Me homepage link">
          <h1
            className="homepageh1"
            style={{ fontFamily: "Mochiy Pop One, sans-serif" }}
          >
            Back2Me
          </h1>
        </a>
        <div className="bar">
          {showMenu ? (
            <i
              className="fa-solid fa-x"
              onClick={() => {
                setShowMenu(!showMenu);
                document.getElementById("list-service").style.height = "0";
              }}
            ></i>
          ) : (
            <i
              className="fa-solid fa-bars"
              onClick={() => {
                setShowMenu(!showMenu);
                document.getElementById("list-service").style.height =
                  document.getElementById("list-service").scrollHeight + "px";
              }}
            ></i>
          )}
        </div>
        <div className="btn-with-border search-by-image">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="search-by-image">
              <i className="fa-solid fa-cloud-arrow-up"></i> Search by image
            </label>
            <label htmlFor="search-by-image">
              <i className="fa-solid fa-bolt"></i> Super Quick
            </label>
            <label htmlFor="search-by-image">
              <i className="fa-solid fa-hand-pointer"></i> Just 1 Click
            </label>
          </div>
          <input
            type="file"
            hidden
            id="search-by-image"
            onChange={handleSearchByImage}
          />

          <i
            className="fa-solid fa-magnifying-glass"
            style={{
              position: "absolute",
              top: "7px",
              left: "10px",
              fontSize: "18px",
            }}
            onClick={() => {
              window.location.href = "/search";
            }}
          ></i>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
          }}
          className="list-service"
          id="list-service"
        >
          <a
            href="#policyModal2"
            style={{ marginRight: "40px" }}
            aria-label="Terms and guide link"
            onClick={() => {
              document.body.style.overflow = "hidden";
            }}
          >
            Terms & Guide
          </a>
          <a
            href="/about"
            style={{ marginRight: "40px" }}
            aria-label="About us link"
          >
            About Us
          </a>
          <a
            href="/lost-and-found"
            style={{ marginRight: "40px" }}
            aria-label="Lost & Found link"
          >
            Lost & Found
          </a>
          <a
            href="/support"
            style={{ marginRight: "40px" }}
            aria-label="Support link"
          >
            Support
          </a>
          <div className="profile-menu">
            <button
              className="avatar-btn"
              aria-label="Sign in button"
              onClick={() => {
                document.getElementById("dropdown").classList.toggle("hidden");
                document
                  .getElementById("dropdown")
                  .classList.toggle("show-mobile");
              }}
            >
              {isInProcessing ? (
                <Skeleton
                  width={45}
                  height={45}
                  style={{ borderRadius: "50%" }}
                />
              ) : user?.avatar ? (
                <img
                  src={`${user.urlAvatar}`}
                  alt="avatar"
                  width={45}
                  height={45}
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                />
              ) : (
                <img
                  src="/Image/user_icon.png"
                  alt="avatar"
                  width={45}
                  loading="lazy"
                />
              )}
            </button>

            <div id="dropdown" className="dropdown hidden">
              {user.role ? (
                <>
                  <a href="/me" aria-label="Profile link">
                    <i className="fa-solid fa-user"></i> Profile
                  </a>
                  <a href="/my-posts" aria-label="My posts link">
                    <i className="fa-solid fa-file-lines"></i> My Post
                  </a>
                  {user.role === "Admin" && (
                    <a
                      href="/dashboard/report"
                      aria-label="Admin dashboard link"
                    >
                      <i className="fa-solid fa-home"></i> Dashboard
                    </a>
                  )}
                  <a
                    href=""
                    onClick={() => {
                      if (localStorage.getItem("mute")) {
                        localStorage.removeItem("mute");
                      } else {
                        localStorage.setItem("mute", true);
                      }
                    }}
                  >
                    {!localStorage.getItem("mute") ? (
                      <>
                        <i className="fa-solid fa-volume-high"></i> Mute
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-volume-xmark"></i> Unmute
                      </>
                    )}
                  </a>
                  <a
                    href=""
                    onClick={(e) => {
                      e.preventDefault();

                      signOut();
                    }}
                    aria-label="Sign out link"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>{" "}
                    Sign Out
                  </a>
                </>
              ) : (
                <>
                  <a
                    href=""
                    onClick={() => {
                      if (localStorage.getItem("mute")) {
                        localStorage.removeItem("mute");
                      } else {
                        localStorage.setItem("mute", true);
                      }
                    }}
                    aria-label="Mute and unmute"
                  >
                    {!localStorage.getItem("mute") ? (
                      <>
                        <i className="fa-solid fa-volume-high"></i> Mute
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-volume-xmark"></i> Unmute
                      </>
                    )}
                  </a>
                  <a
                    href="/authentication?with=sign-in"
                    aria-label="Sign in link"
                  >
                    <i className="fa-solid fa-arrow-right-to-bracket"></i> Sign
                    In
                  </a>
                </>
              )}
            </div>
          </div>
          <button
            aria-label="Create post button"
            style={{
              marginLeft: "60px",
            }}
            className="btn btn-create-post"
            onClick={() => {
              checkAuthentication();

              const modal = document.querySelector(".modal-report-stuff");
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
            <i className="fa-solid fa-plus"></i> Create a post
          </button>
        </div>
      </div>

      {/* Modal report stuff component */}
      <ModalReportStuff></ModalReportStuff>

      {/* Overlay processing search by image */}
      <div className="overlay" id="overlay-search-image">
        <Suspense fallback={<p>Loading animation...</p>}>
          <DotLottieReact
            data={JSON.stringify(DocumentScan)}
            autoplay
            loop
            style={{ width: "50%", margin: "auto" }}
          />
        </Suspense>

        <p
          style={{
            marginTop: "-150px",
            marginBottom: "200px",
            textAlign: "center",
          }}
          className="analyzing-text"
        >
          {msgErrorAI.msg ? msgErrorAI.msg : "Analyzing..."}
        </p>
      </div>

      {/* Modal Policy */}
      <div id="policyModal2" className="modal">
        <div className="modal-content">
          <h2>Terms of Use & Recovery Guide</h2>

          <div className="policy-section">
            <h3>Users agree NOT to:</h3>
            <ul>
              <li>Use the website for any unlawful purpose.</li>
              <li>
                Disrupt, interfere with, or attempt unauthorized access to the
                website or its systems.
              </li>
              <li>
                Upload or share content that is false, offensive, violates
                privacy, or infringes copyright.
              </li>
              <li>
                Provide inaccurate information when creating an account (if
                applicable).
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h3>We reserve the right to:</h3>
            <ul>
              <li>
                Suspend, terminate, or limit your access if any violation is
                detected.
              </li>
              <li>
                Modify or temporarily disable any part of the website without
                prior notice.
              </li>
              <li>
                Collect and use user information as described in our Privacy
                Policy.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h3>For individuals seeking to reclaim lost items:</h3>
            <ul>
              <li>
                You <strong>MUST</strong> provide a detailed description of the
                lost item for verification with the holder.
              </li>
              <li>
                You are <strong>REQUIRED</strong> to create a post in order to
                receive a verification code.
              </li>
              <li>
                The post <strong>MUST</strong> include a complete and accurate
                description of the lost item.
              </li>
              <li>
                Users are responsible for regularly checking their post on the
                website for updates.
              </li>
              <li>
                You <strong>MUST</strong> present the verification code when
                retrieving your item.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h3>For individuals holding found items:</h3>
            <ul>
              <li>
                You are <strong>RESPONSIBLE</strong> for verifying the
                claimant's verification code and item description to ensure they
                match the item in your possession.
              </li>
              <li>
                You are <strong>RESPONSIBLE</strong> for creating a post to
                assist in returning the item to its rightful owner.
              </li>
            </ul>
          </div>

          <a
            aria-label="I got it button"
            className="close"
            href="#"
            onClick={() => {
              document.body.style.overflow = "auto";
            }}
          >
            I got it
          </a>
        </div>
      </div>

      <div className="modal-result-by-ai" id="modal-result-by-ai">
        <div className="modal-content-result-by-ai">
          <h2>Are any of these your lost items?</h2>
          <div
            className="results-container"
            style={{
              gridTemplateColumns: resultByAI.length == 0 ? "unset" : "",
            }}
          >
            {resultByAI.length > 0 ? (
              resultByAI.map((item) => (
                <div
                  className="card card-search-by-image"
                  key={item.post.postId}
                >
                  <div
                    onClick={() => {
                      window.location.href = `/detail-post/${item.post.postId}`;
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {item.post.image ? (
                      <img
                        src={item.post.urlImage}
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
                      style={{ marginBottom: "30px" }}
                    >
                      <div className="info-user-suggestion">
                        <img
                          src={item.post.user.urlAvatar}
                          alt="avatar"
                          width={50}
                          height={50}
                          style={{ borderRadius: "50%" }}
                          loading="lazy"
                        />
                        <span>{`${item.post.user.firstName} ${item.post.user.lastName}`}</span>
                      </div>
                      <h3 style={{ fontWeight: "700", marginBottom: "10px" }}>
                        <a
                          href={`/detail-post/${item.post.postId}`}
                          aria-label={`Detail post of ${item.post.title}`}
                        >
                          {item.post.title}
                        </a>
                      </h3>
                      <a
                        href={`/detail-post/${item.post.postId}`}
                        aria-label={`Detail post of ${item.post.title}`}
                      >
                        <ReactMarkdown
                          children={item.post.description}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        ></ReactMarkdown>
                      </a>
                    </div>
                  </div>

                  <button
                    aria-label="This is my item button"
                    className="btn"
                    style={{ width: "100%" }}
                    onClick={() => {
                      setSelectedFoundPost(item.postId);
                      document.getElementById(
                        "modal-my-post-to-match-header",
                      ).style.visibility = "visible";
                      document.getElementById(
                        "modal-my-post-to-match-header",
                      ).style.opacity = "1";

                      // Load my post to pick to match post is showing
                      handleFetchPosts();
                    }}
                  >
                    <i className="fa-solid fa-hand-point-up"></i> This is my
                    item
                  </button>

                  {/* Status */}
                  <div
                    className={
                      item.post.typePost === "Found"
                        ? "status-post-found"
                        : "status-post-lost"
                    }
                  >
                    {item.post.typePost}
                  </div>

                  {/* Show score */}
                  <div className="show-code">
                    {Math.round(item.score * 100)}%
                  </div>
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
                <p>No similar items found.</p>
                <div className="btn-with-border search-by-image-again">
                  <div>
                    <label htmlFor="search-by-image">
                      Please try another image{" "}
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                    </label>
                  </div>
                  <input
                    type="file"
                    hidden
                    id="search-by-image"
                    onChange={handleSearchByImage}
                  />

                  <i
                    className="fa-solid fa-magnifying-glass"
                    style={{
                      position: "absolute",
                      top: "7px",
                      left: "10px",
                      fontSize: "18px",
                    }}
                  ></i>
                </div>
              </div>
            )}
          </div>
          <button
            aria-label="Close button"
            className="btn-yellow close-result-by-ai"
            style={{
              width: "90%",
            }}
            href="#"
            onClick={() => {
              const modal = document.querySelector(".modal-result-by-ai");
              modal.style.visibility = "hidden";
              modal.style.opacity = "0";
            }}
          >
            <i className="fa-solid fa-xmark"></i> Close
          </button>
        </div>
      </div>

      {/* Modal popup choose my post to math with currently post is showing */}
      <div
        className="modal-my-post-to-match"
        id="modal-my-post-to-match-header"
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
                className="skeleton-load-select-post"
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto auto",
                  width: "100%",
                  overflow: "hidden",
                  gap: "10px",
                }}
              >
                {Array.from({ length: 3 }).map((_, index) => (
                  <div className="" key={index}>
                    <Skeleton
                      height={290}
                      style={{ marginBottom: "10px", borderRadius: "20px" }}
                    />
                    <div className="">
                      <h3 style={{ fontWeight: "700", marginBottom: "10px" }}>
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
                    <div className="card-text" style={{ marginBottom: "20px" }}>
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
                      handleMatchPost(item.postId, selectedFoundPost);
                    }}
                    disabled={isRequesting}
                  >
                    {isRequesting ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <>
                        <i className="fa-solid fa-hand-point-up"></i> Select
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
                <p>You don't have any lost items to match this found item</p>
                <button
                  className="btn"
                  onClick={() => {
                    checkAuthentication();

                    // Hidden select my posts modal
                    document.getElementById(
                      "modal-my-post-to-match-header",
                    ).style.visibility = "hidden";
                    document.getElementById(
                      "modal-my-post-to-match-header",
                    ).style.opacity = "0";

                    // Hidden results by ai modal
                    document.getElementById(
                      "modal-result-by-ai",
                    ).style.visibility = "hidden";
                    document.getElementById(
                      "modal-result-by-ai",
                    ).style.opacity = "0";

                    // Show modal create post
                    const modal = document.querySelector(".modal-report-stuff");
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
                "#modal-my-post-to-match-header",
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
                This code is used to verify ownership when retrieving your lost
                item. Share it only with the person who has your item. Keep it
                private.
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

                    document.getElementById("popup-notice-code").style.display =
                      "none";
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
  );
}
