import { useEffect, useState } from "react";
import SidebarProfile from "../components/SidebarProfile";
import axios from "axios";
import dayjs from "dayjs";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { debounce } from "lodash";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import axiosInstance from "../api/axiosInstance";

export default function PickUpRequest() {
  // Variables
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState("");
  const [pickUpDate, setPickUpDate] = useState("");
  const [objectToShowPopup, setObjectToShowPopup] = useState({
    requestId: 0,
    pickUpDate: "",
  });
  const [isInProcessing, setIsInProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // APIs

  // Functions
  // search Request
  const searchRequest = async (query) => {
    if (query.trim() == "") return null;

    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get(
        `/PickUpRequest/search-request?query=${query}`,
        {
          // withCredentials: true,
          validateStatus: (status) =>
            status === 200 || status === 401 || status === 404,
        },
      );

      if (response.status === 200) {
        setRequests(response.data);
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
      console.log(error);
    } finally {
      setIsInProcessing(false);
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
      // Get new pick up request
      connection.on("ReceiveNewPickUpRequest", (data) => {
        setRequests((preRequests) => {
          if (preRequests.some((p) => p.requestId == data.request.requestId))
            return preRequests;

          return [data.request, ...preRequests];
        });
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

  // Handle accept time
  const handleAcceptTime = async (requestId) => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.post(
        `/PickUpRequest/accept-time/${requestId}`,
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
      setIsInProcessing(false);
    }
  };

  const debouncedFetch = debounce(searchRequest, 500);

  // Handle change time
  const handleChangeTime = async (requestId) => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.post(
        `/PickUpRequest/change-time/${requestId}`,
        pickUpDate,
        {
          // withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          validateStatus: (status) =>
            status === 200 ||
            status === 401 ||
            status === 404 ||
            status === 403,
        },
      );

      if (response.status === 200) {
        document.getElementById("popup-change-pick-up-time").style.display =
          "none";
        document.body.style.overflow = "auto";
        setPickUpDate("");

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
      setIsInProcessing(false);
    }
  };

  // Get all requests
  const handleGetAllRequests = async () => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.get("/PickUpRequest", {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404 || status === 403,
      });

      if (response.status === 200) {
        setRequests(response.data);
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
      setIsLoading(false);
    }
  };

  // Fetch data from API
  useEffect(() => {
    handleGetAllRequests();
  }, []);

  // Run realtime
  useEffect(() => {
    getMyProfile();
    connectToSignalR();
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

  useEffect(() => {
    debouncedFetch(query);
    return debouncedFetch.cancel; // Cleanup
  }, [query]);

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
          <div className="search-codes-container">
            <input
              type="text"
              placeholder="Search by description..."
              className="form-control-input search-codes"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
            <i className="fa-solid fa-search"></i>
          </div>

          {/* List codes */}
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Pick-Up Time</th>
                  <th>Date Created</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7}>
                      <i className="fas fa-spinner fa-spin"></i>
                    </td>
                  </tr>
                ) : requests.length > 0 ? (
                  requests.map((item, index) => (
                    <tr key={item.requestId}>
                      <td>{index + 1}</td>
                      <td>
                        <ReactMarkdown
                          children={item.description}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        ></ReactMarkdown>
                      </td>
                      <td>{dayjs(item.pickUpDate).format("h:mm:ss A")}</td>
                      <td>{dayjs(item.createdDate).format("MM/DD/YYYY")}</td>
                      <td>
                        <span
                          className={`status ${
                            item.status === "Pending"
                              ? "warning"
                              : item.status === "Cancelled"
                                ? "inactive"
                                : "active"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button
                          aria-label="Accept button"
                          className="btn"
                          style={{
                            backgroundColor: item.isActive ? "red" : "",
                            marginRight: "10px",
                          }}
                          type="button"
                          onClick={() => {
                            handleAcceptTime(item.requestId);
                          }}
                          disabled={item.status !== "Pending" || isInProcessing}
                        >
                          {item.status === "Pending" ? (
                            isInProcessing ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              "Accept"
                            )
                          ) : item.status === "Reschedule" ? (
                            <>
                              <i className="fa-solid fa-user-clock"></i>{" "}
                              Awaiting user
                            </>
                          ) : (
                            item.status
                          )}
                        </button>
                        {item.status === "Pending" && (
                          <button
                            aria-label="Change time button"
                            className="btn-yellow"
                            type="button"
                            onClick={() => {
                              document.getElementById(
                                "popup-change-pick-up-time",
                              ).style.display = "flex";
                              document.body.style.overflow = "hidden";

                              setObjectToShowPopup({
                                requestId: item.requestId,
                                pickUpDate: dayjs(item.pickUpDate).format(
                                  "MM/DD/YYYY h:mm:ss A",
                                ),
                              });
                            }}
                            disabled={isInProcessing}
                          >
                            {isInProcessing ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              "Change Time"
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>No results</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Popup change pick up time */}
      <div className="modal" id="popup-change-pick-up-time">
        <div className="modal-content">
          <h2 style={{ backgroundColor: "transparent" }}>
            Change pick-up time for{" "}
            <span style={{ color: "#ec7207" }}>
              {objectToShowPopup.pickUpDate}
            </span>
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
              You are changing the pick-up time for{" "}
              <strong>this request</strong>. The user will be notified of the
              new time once you confirm the change.
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
              aria-label="Change pick up time button"
              className="btn"
              onClick={() => {
                handleChangeTime(objectToShowPopup.requestId);
              }}
              disabled={isInProcessing}
            >
              {isInProcessing ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                "Change"
              )}
            </button>
            <button
              aria-label="Cancel change pick up time button"
              className="btn-yellow btn-cancel-pick-up"
              onClick={() => {
                document.getElementById(
                  "popup-change-pick-up-time",
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
    </>
  );
}
