import axios from "axios";
import { Suspense, useEffect, useRef, useState } from "react";
import SidebarProfile from "../components/SidebarProfile";
import { data } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import axiosInstance from "../api/axiosInstance";

export default function Dashboard() {
  // Variables
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const chartRef3 = useRef(null);
  const chartInstanceRef = useRef(null);
  const chartInstanceRef2 = useRef(null);
  const chartInstanceRef3 = useRef(null);
  let [totalPendingFoundItems, setTotalPendingFoundItems] = useState("");
  let [countLostPosts, setCountLostPosts] = useState([]);
  let [countFoundPosts, setCountFoundPosts] = useState([]);
  let [countReceivedPosts, setCountReceivedPosts] = useState([]);
  let [countFoundPostsNotReceived, setCountFoundPostsNotReceived] = useState(
    [],
  );
  let [isInProcessing, setIsInProcessing] = useState(false);

  // APIs

  // Functions
  // Get lost posts per month
  const handleGetLostPostsPerMonth = async () => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get("/Post/lost-posts-per-month", {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404 || status === 403,
      });

      if (response.status === 200) {
        const defaultMonthsArray = new Array(12).fill(0);

        response.data.map((item) => {
          const monthIndex = item.month - 1; // Get the month index (0-11)
          defaultMonthsArray[monthIndex] = item.count; // Set the count for the corresponding month
        });

        setCountLostPosts(defaultMonthsArray);
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
      setIsInProcessing(false);
    }
  };

  // Get found posts per month
  const handleGetFoundPostsPerMonth = async () => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get("/Post/found-posts-per-month", {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404 || status === 403,
      });

      if (response.status === 200) {
        const defaultMonthsArray = new Array(12).fill(0);

        response.data.map((item) => {
          const monthIndex = item.month - 1; // Get the month index (0-11)
          defaultMonthsArray[monthIndex] = item.count; // Set the count for the corresponding month
        });

        setCountFoundPosts(defaultMonthsArray);
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
      setIsInProcessing(false);
    }
  };

  // Get received posts per month
  const handleGetReceivedPostsPerMonth = async () => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get(
        "/Post/received-posts-per-month",
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
        const defaultMonthsArray = new Array(12).fill(0);

        response.data.map((item) => {
          const monthIndex = item.month - 1; // Get the month index (0-11)
          defaultMonthsArray[monthIndex] = item.count; // Set the count for the corresponding month
        });

        setCountReceivedPosts(defaultMonthsArray);
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
      setIsInProcessing(false);
    }
  };

  // Get found posts not received
  const handleGetFoundPostsNotReceived = async () => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get(
        "/Post/found-posts-not-received",
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
        const defaultMonthsArray = new Array(12).fill(0);

        response.data.map((item) => {
          const monthIndex = item.month - 1; // Get the month index (0-11)
          defaultMonthsArray[monthIndex] = item.count; // Set the count for the corresponding month
        });

        setCountFoundPostsNotReceived(defaultMonthsArray);
        setTotalPendingFoundItems(
          defaultMonthsArray.reduce((a, b) => a + b, 0),
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
      setIsInProcessing(false);
    }
  };

  // UseEffect
  useEffect(() => {
    handleGetLostPostsPerMonth();
    handleGetFoundPostsPerMonth();
    handleGetReceivedPostsPerMonth();
    handleGetFoundPostsNotReceived();
  }, []);

  useEffect(() => {
    // Render Chart.js chart
    import("chart.js/auto").then(async ({ default: Chart }) => {
      // Posts overview
      if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "rgba(236, 114, 7, 0.3)"); // Top: light blue
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // Bottom: white (transparent)

        // Destroy previous chart instance if it exists
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        // Create a new chart
        chartInstanceRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            datasets: [
              {
                label: "Lost",
                data: countLostPosts,
                backgroundColor: "rgb(253, 204, 75)",
                fill: true,
                tension: 0.4,
              },
              {
                label: "Found",
                data: countFoundPosts,
                backgroundColor: "rgb(236, 114, 7)",
                fill: true,
                tension: 0.4,
              },
              {
                label: "Received",
                data: countReceivedPosts,
                backgroundColor: "rgb(7, 33, 56)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            interaction: {
              mode: "index",
              intersect: false,
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.dataset.label; // Get label of each data set
                    const value = context.raw; // Get y value
                    return `${label}: ${value} posts`; // Display as $xxx
                  },
                },
              },
            },
            scales: {
              x: {
                type: "category",
                position: "bottom",
                grid: {
                  display: true,
                },
              },
              y: {
                type: "linear",
                position: "left",
                grid: {
                  display: false,
                },
              },
            },
          },
        });
      }

      // Post Status Distribution
      if (chartRef2.current) {
        const ChartDateLabels = (await import("chartjs-plugin-datalabels"))
          .default;

        const ctx = chartRef2.current.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "rgba(236, 114, 7, 0.3)"); // Top: light blue
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // Bottom: white (transparent)

        // Destroy previous chart instance if it exists
        if (chartInstanceRef2.current) {
          chartInstanceRef2.current.destroy();
        }

        // Create a new chart
        chartInstanceRef2.current = new Chart(ctx, {
          type: "pie",
          data: {
            labels: ["Lost", "Found", "Received"],
            datasets: [
              {
                data: [
                  countLostPosts.reduce((a, b) => a + b, 0),
                  countFoundPosts.reduce((a, b) => a + b, 0),
                  countReceivedPosts.reduce((a, b) => a + b, 0),
                ],
                backgroundColor: [
                  "rgb(253,204,75)",
                  "rgb(236,114,7)",
                  "rgb(7,33,56)",
                ],
                borderWidth: 0,
                borderColor: "transparent",
              },
            ],
          },
          options: {
            interaction: {
              mode: "point",
              intersect: false,
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const value = context.raw; // Get y value
                    const total = context.dataset.data.reduce(
                      (a, b) => a + b,
                      0,
                    );
                    const percent = total
                      ? ((value / total) * 100).toFixed(1)
                      : 0;
                    return `${context.label}: ${percent}% (${value} posts)`;
                  },
                },
              },
              // Set up for text on each slice
              datalabels: {
                color: "#fff",
                font: { weight: "bold", size: 14 },
                formatter: (value, context) => {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percent = total
                    ? ((value / total) * 100).toFixed(1)
                    : 0;
                  return `${percent}%`;
                },
              },
            },
          },
          plugins: [ChartDateLabels],
        });
      }

      // Total posts
      if (chartRef3.current) {
        const ctx = chartRef3.current.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "rgba(236, 114, 7, 0.3)"); // Top: light blue
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // Bottom: white (transparent)

        // Destroy previous chart instance if it exists
        if (chartInstanceRef3.current) {
          chartInstanceRef3.current.destroy();
        }

        // Create a new chart
        chartInstanceRef3.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            datasets: [
              {
                label: `Total: ${
                  totalPendingFoundItems ? totalPendingFoundItems : 0
                }`,
                data: countFoundPostsNotReceived,
                backgroundColor: gradient,
                borderColor: "#ec7207",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            interaction: {
              mode: "index",
              intersect: false,
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const value = context.raw; // Get y value
                    return `${value} posts`;
                  },
                },
              },
            },
            scales: {
              x: {
                position: "bottom",
                grid: {
                  display: true,
                },
              },
              y: {
                type: "linear",
                position: "left",
                grid: {
                  display: false,
                },
              },
            },
          },
        });
      }
    });
    return () => {
      // Cleanup chart instance when component unmount
      chartInstanceRef.current?.destroy();
      chartInstanceRef2.current?.destroy();
      chartInstanceRef3.current?.destroy();
    };
  }, [
    countLostPosts,
    countFoundPosts,
    countReceivedPosts,
    totalPendingFoundItems,
    countFoundPostsNotReceived,
  ]);

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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "100px",
            gap: "30px",
          }}
        >
          <div>
            <div className="status-filter">
              <p
                style={{
                  backgroundColor: "#072138",
                  width: "max-content",
                  color: "white",
                  padding: "1px 30px",
                  borderRadius: "8px",
                  position: "absolute",
                  top: "-50%",
                  left: "0",
                  marginTop: "20px",
                }}
              >
                Posts Overview
              </p>
            </div>

            {/* Chart bar */}
            <div className="" style={{ marginTop: "40px" }}>
              {isInProcessing ? (
                <Skeleton
                  height={370}
                  style={{ marginBottom: "10px", borderRadius: "20px" }}
                />
              ) : (
                <Suspense
                  fallback={
                    <p style={{ position: "absolute", backgroundColor: "red" }}>
                      Loading animation...
                    </p>
                  }
                >
                  <div
                    style={{
                      boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2)",
                      borderRadius: "20px",
                      padding: "20px",
                    }}
                  >
                    <canvas
                      ref={chartRef}
                      style={{ width: "100%", height: "400px" }}
                    ></canvas>
                  </div>
                </Suspense>
              )}
            </div>
          </div>
          <div
            className="chart-pending-found-percent"
            style={{
              display: "flex",
              gap: "5%",
              width: "100%",
              marginTop: "5%",
            }}
          >
            <div style={{ width: "100%" }}>
              <div className="status-filter">
                <p
                  style={{
                    backgroundColor: "#072138",
                    width: "max-content",
                    color: "white",
                    padding: "1px 30px",
                    borderRadius: "8px",
                    position: "absolute",
                    top: "-50%",
                    left: "0",
                    marginTop: "20px",
                  }}
                >
                  Post Status Distribution
                </p>
              </div>

              {/* Chart pipe */}
              <div className="" style={{ marginTop: "40px" }}>
                {isInProcessing ? (
                  <Skeleton
                    height={370}
                    style={{ marginBottom: "10px", borderRadius: "20px" }}
                  />
                ) : (
                  <Suspense
                    fallback={
                      <p
                        style={{ position: "absolute", backgroundColor: "red" }}
                      >
                        Loading animation...
                      </p>
                    }
                  >
                    <div
                      style={{
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.8)",
                        borderRadius: "20px",
                        padding: "20px",
                      }}
                    >
                      <canvas
                        ref={chartRef2}
                        style={{ width: "100%", height: "400px" }}
                      ></canvas>
                    </div>
                  </Suspense>
                )}
              </div>
            </div>
            <div style={{ width: "100%" }}>
              <div className="status-filter">
                <p
                  style={{
                    backgroundColor: "#072138",
                    width: "max-content",
                    color: "white",
                    padding: "1px 30px",
                    borderRadius: "8px",
                    position: "absolute",
                    top: "-50%",
                    left: "0",
                    marginTop: "20px",
                  }}
                >
                  Pending Found Items
                </p>
              </div>

              {/* Chart line */}
              <div className="" style={{ marginTop: "40px" }}>
                {isInProcessing ? (
                  <Skeleton
                    height={370}
                    style={{ marginBottom: "10px", borderRadius: "20px" }}
                  />
                ) : (
                  <Suspense
                    fallback={
                      <p
                        style={{ position: "absolute", backgroundColor: "red" }}
                      >
                        Loading animation...
                      </p>
                    }
                  >
                    <div
                      style={{
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.8)",
                        borderRadius: "20px",
                        padding: "20px",
                      }}
                    >
                      <canvas
                        ref={chartRef3}
                        style={{ width: "100%", height: "400px" }}
                      ></canvas>
                    </div>
                  </Suspense>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
