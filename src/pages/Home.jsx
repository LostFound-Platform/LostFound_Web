import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Skeleton from "react-loading-skeleton";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import axiosInstance from "../api/axiosInstance";

export default function Home() {
  // Variables
  let [categoryPosts, setCategoryPosts] = useState([]);
  let [newestPosts, setNewestPosts] = useState([]);
  let [pick60LostPosts, setPick60LostPosts] = useState("");
  let [pick60ReceivedPosts, setPick60ReceivedPosts] = useState("");
  let [categoryId, setCategoryId] = useState("");
  let [status, setStatus] = useState("");
  let [isGettingCategories, setIsGettingCategories] = useState(false);
  let [isGettingReceivedItem, setIsGettingReceivedItem] = useState(false);
  let [isGettingLostItems, setIsGettingLostItems] = useState(false);
  let [isLoadingNewestPosts, setIsLoadingNewestPosts] = useState(false);

  // Functions
  // Get category posts
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

  function handleSearch(e) {
    e.preventDefault();

    window.location.href = `/search${categoryId && !status ? `?categoryId=${categoryId}` : ""}${!categoryId && status ? `?status=${status}` : ""}${categoryId && status ? `?categoryId=${categoryId}&status=${status}` : ""}`;
  }

  // Get Newest Posts
  const getNewestPosts = async () => {
    setIsLoadingNewestPosts(true);

    try {
      const response = await axiosInstance.get("/Post/newest-posts", {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status === 200) {
        setNewestPosts(response.data);
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
      setIsLoadingNewestPosts(false);
    }
  };

  // Get Pick 60 Lost Posts
  const getPick60LostPosts = async () => {
    setIsGettingLostItems(true);

    try {
      const response = await axiosInstance.get("/Post/quick-60-lost-posts", {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status === 200) {
        setPick60LostPosts(response.data.length);
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
      setIsGettingLostItems(false);
    }
  };

  // Get Pick 60 Received Posts
  const getPick60ReceivedPosts = async () => {
    setIsGettingReceivedItem(true);

    try {
      const response = await axiosInstance.get(
        "/Post/quick-60-received-posts",
        {
          // withCredentials: true,
          validateStatus: (status) =>
            status === 200 || status === 401 || status === 404,
        },
      );

      if (response.status === 200) {
        setPick60ReceivedPosts(response.data.length);
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
      setIsGettingReceivedItem(false);
    }
  };

  // UseEffect
  useEffect(() => {
    getCategoryPosts();
    getPick60LostPosts();
    getPick60ReceivedPosts();
    getNewestPosts();
  }, []);

  return (
    <>
      {/* Helmet for setting the page title */}
      <Helmet>
        <title>Lost & Found | Back2Me </title>
      </Helmet>

      <div
        className="hero"
        style={{ display: "flex", justifyContent: "space-around" }}
      >
        <div
          className="hero-text"
          style={{
            marginTop: "83px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "32px",
              marginLeft: "2%",
              textAlign: "center",
              width: "100%",
              marginTop: "18px",
              lineHeight: "1.8",
              marginBottom: "11px",
            }}
          >
            We can help find your{" "}
            <strong
              style={{
                fontSize: "55px",
                fontFamily: "Mochiy Pop One, sans-serif",
              }}
            >
              LOST
            </strong>
            <br />
            Items or reunite{" "}
            <strong
              style={{
                fontSize: "55px",
                fontFamily: "Mochiy Pop One, sans-serif",
              }}
            >
              FOUND
            </strong>{" "}
            Items with
            <br />
            their owners
          </p>

          <div
            className="number-buttons"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "30px",
              background: "linear-gradient(to right, #ec7207, #fadf45ff)",
              padding: "10px",
              width: "400px",
              borderRadius: "100px",
              marginTop: "40px",
            }}
          >
            <button
              aria-label="Lost stuffs button"
              style={{
                fontSize: "20px",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              <strong style={{ color: "#072138" }}>
                <span style={{ fontSize: "25px" }}>
                  {isGettingLostItems ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    pick60LostPosts || "0"
                  )}
                </span>{" "}
                <br /> Lost Items
              </strong>
            </button>
            <p style={{ fontSize: "20px" }}>
              <strong className="pipe">|</strong>
            </p>
            <button
              aria-label="Receive stuffs button"
              style={{
                fontSize: "20px",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              <strong style={{ color: "#072138" }}>
                <span style={{ fontSize: "25px" }}>
                  {isGettingReceivedItem ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    pick60ReceivedPosts || "0"
                  )}
                </span>{" "}
                <br /> Received Items
              </strong>
            </button>
          </div>

          <p
            className="easy"
            style={{
              fontSize: "18px",
              textAlign: "center",
              width: "100%",
              marginTop: "25px",
              marginLeft: "2%",
            }}
          >
            It's super easy and takes only minutes. Just add your item's info,
            <br />
            and your contact information.
          </p>
        </div>

        <img
          src="./Image/detective.png"
          alt=""
          className="move-up-down"
          width="850"
          loading="lazy"
          style={{ objectFit: "cover", width: "692px", marginRight: "-70px" }}
        />
      </div>
      <p
        className="learn-how-it-works"
        style={{
          fontSize: "40px",
          marginTop: "35px",
          textAlign: "left",
          color: "#072138",
          marginRight: "90%",
          width: "100%",
          padding: "20px 10px",
        }}
      >
        Learn{" "}
        <span style={{ fontFamily: "Mochiy Pop One, sans-serif" }}>
          how it works
        </span>
      </p>

      {/* Learn how it works */}
      <div
        className="how-it-works"
        style={{
          display: "grid",
          gridTemplateColumns: "30% 70%",
          gap: "30px",
          width: "90%",
          margin: "auto",
          marginTop: "50px",
        }}
      >
        {/* Card 1 */}
        <div
          style={{
            background: "linear-gradient(135deg, #f5f4c2, #ffbd83)",
            borderRadius: "15px",
            position: "relative",
          }}
          className="paddingp"
        >
          <p
            style={{
              fontSize: "20px",
              marginTop: "10px",
              marginBottom: "50px",
              left: "18%",
              color: "white",
              backgroundColor: "#f78f2eff",
              padding: "8px 20px",
              borderRadius: "17px",
              border: "none",
              width: "173px",
              textAlign: "center",
              position: "absolute",
              top: "-30px",
            }}
          >
            Register
          </p>
          <p>
            This step allows you to have a personalized space for managing your
            item. You can edit and update your profile, contact other users, and
            access useful tools.
          </p>
        </div>

        {/* Card 2 */}
        <div
          style={{
            background: "linear-gradient(135deg, #f5f4c2, #ffbd83)",
            borderRadius: "15px",
            position: "relative",
          }}
          className="paddingp"
        >
          <p
            className="report"
            style={{
              fontSize: "20px",
              width: "30%",
              marginTop: "10px",
              marginBottom: "50px",
              left: "8%",
              color: "white",
              backgroundColor: "#f78f2eff",
              padding: "8px 20px",
              borderRadius: "15px",
              border: "none",
              textAlign: "center",
              position: "absolute",
              top: "-30px",
            }}
          >
            Report an item
          </p>
          <p>
            Share details about your lost or found item by creating a post.
            Providing accurate information helps us match lost and found items
            more effectively.
          </p>
        </div>
      </div>

      {/* 2 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "70% 30%",
          gap: "30px",
          width: "90%",
          margin: "auto",
          marginTop: "50px",
        }}
        className="paddingp-bottom"
      >
        {/* Card 1 */}
        <div
          style={{
            background: "linear-gradient(135deg, #f5f4c2, #ffbd83)",
            borderRadius: "15px",
            position: "relative",
          }}
          className="paddingp"
        >
          <p
            style={{
              fontSize: "20px",
              marginTop: "10px",
              marginBottom: "50px",
              left: "8%",
              color: "white",
              backgroundColor: "#f78f2eff",
              padding: "8px 20px",
              borderRadius: "17px",
              border: "none",
              width: "173px",
              textAlign: "center",
              position: "absolute",
              top: "-30px",
            }}
          >
            Promote
          </p>
          <p>
            Our platform allows you to share your listing on social media to
            reach a wider audience. The more you promote your listing, the
            higher the chance of recovery.
          </p>
        </div>

        {/* Card 2 */}
        <div
          style={{
            background: "linear-gradient(135deg, #f5f4c2, #ffbd83)",
            borderRadius: "15px",
            position: "relative",
          }}
          className="paddingp"
        >
          <p
            className="report"
            style={{
              fontSize: "20px",
              width: "30%",
              marginTop: "10px",
              marginBottom: "50px",
              left: "17%",
              color: "white",
              backgroundColor: "#f78f2eff",
              padding: "8px 20px",
              borderRadius: "15px",
              border: "none",
              textAlign: "center",
              position: "absolute",
              top: "-30px",
            }}
          >
            Reunite
          </p>
          <p>
            This is our ultimate goal. With a strong user community and
            effective promotion, reuniting lost items with their owners becomes
            much more likely.
          </p>
        </div>
      </div>

      {/* Newest posts */}
      <div
        className="title-newest-post"
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
            Newest
          </span>{" "}
          posts
        </p>
      </div>

      {/* Newest images */}
      <div className="newest-post-container">
        {/* Cards */}
        {isLoadingNewestPosts ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto auto auto",
              gap: "16px",
            }}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="" key={index} style={{ marginBottom: "60px" }}>
                <Skeleton
                  height={290}
                  style={{ marginBottom: "10px", borderRadius: "20px" }}
                />
                <div className="">
                  <h3 style={{ fontWeight: "700", marginBottom: "10px" }}>
                    <Skeleton height={35} width={405} />
                  </h3>
                  <p>
                    <Skeleton count={3} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : newestPosts.length > 0 ? (
          newestPosts.map((item) => (
            <div
              className="card suggestion-card"
              key={item.postId}
              style={{ cursor: "pointer" }}
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
          <h2>No posts yet</h2>
        )}
      </div>

      <div
        style={{
          textAlign: "center",
          marginBottom: "100px",
          marginTop: "-60px",
        }}
      >
        <a
          href="/lost-and-found"
          className="btn"
          aria-label="View all posts link"
        >
          View all <i className="fa-solid fa-arrow-right"></i>
        </a>
      </div>

      {/* Quick Search */}
      <p
        className="title-quick-search"
        style={{ fontSize: "30px", textAlign: "center", marginBottom: "30px" }}
      >
        <span
          style={{
            fontFamily: "Mochiy Pop One, sans-serif",
          }}
        >
          Search
        </span>{" "}
        for <strong>Items</strong> in your
        <span
          style={{
            fontFamily: "Mochiy Pop One, sans-serif",
          }}
        >
          {" "}
          School
        </span>
      </p>

      <form onSubmit={handleSearch}>
        <div className="quick-search">
          <div className="categories">
            <div className="left">
              <label htmlFor="category">Type of Item</label>
              <br />
              <select
                name=""
                id="type"
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                }}
                className="select"
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
            </div>
            <div className="right">
              <i className="fa-solid fa-list"></i>
            </div>
          </div>
          <div className="pipe">|</div>
          <div className="status-quick-search">
            <div className="left">
              <label htmlFor="status">Status</label>
              <br />
              <select
                className="select"
                name=""
                id="status"
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              >
                <option value="">Select Status</option>
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
            </div>
            <div className="right">
              <i className="fa-solid fa-tag"></i>
            </div>
          </div>
          <div className="pipe">|</div>
          <div className="btn-quick-search">
            <button className="">
              Search item <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
