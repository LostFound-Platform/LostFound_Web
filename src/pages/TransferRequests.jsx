import { useEffect, useState } from "react";
import SidebarProfile from "../components/SidebarProfile";
import axios from "axios";
import dayjs from "dayjs";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { debounce } from "lodash";
import axiosInstance from "../api/axiosInstance";

export default function TransferRequests() {
  // Variables
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState("");
  const [isInProcessing, setIsInProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // APIs

  // Functions
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
      // Get new lost post code
      connection.on("ReceiveNewRequest", (data) => {
        setRequests((preRequests) => {
          if (preRequests.some((p) => p.requestId == data.requests.requestId))
            return preRequests;

          return [data.requests, ...preRequests];
        });
      });

      connection.on("ReceivedStatusRequestMarked", (data) => {
        setRequests((preRequests) => {
          return preRequests.map((r) =>
            r.requestId === data.requestId ? { ...r, status: data.status } : r,
          );
        });
      });

      connection.on("ReceivedStatusRequestCancelled", (data) => {
        setRequests((preRequests) => {
          return preRequests.map((r) =>
            r.requestId === data.requestId ? { ...r, status: data.status } : r,
          );
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

  // search First Name and last name Request
  const searchFirstNameLastNameRequest = async (query) => {
    if (query.trim() == "") return null;

    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get(
        `/TransferRequests/search-request?query=${query}`,
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

  const debouncedFetch = debounce(searchFirstNameLastNameRequest, 500);

  // Handle mark received
  const handleMarkReceived = async (requestId, postId) => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.post(
        `/TransferRequests/mark-received`,
        {
          requestId: requestId,
          postId: postId,
          oldUserId: user.userId,
        },
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

  // Handle cancel hand over
  const handleCancelHandOver = async (requestId, postId) => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.post(
        `/TransferRequests/cancel-handover`,
        {
          requestId: requestId,
          postId: postId,
          oldUserId: user.userId,
        },
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

  // Get all requests
  const handleGetAllRequests = async () => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.get("/TransferRequests", {
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
              placeholder="Search by first name..."
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
                  <th>Item</th>
                  <th>User</th>
                  <th>Role</th>
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
                      <td>{item.nameItem}</td>
                      <td>
                        {item.firstName} {item.lastName}
                      </td>
                      <td>{item.role}</td>
                      <td>{dayjs(item.createdAt).format("MM/DD/YYYY")}</td>
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
                      <td
                        style={{
                          display: "flex",
                          gap: "10px",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <button
                          aria-label="Mark as received button"
                          className="btn"
                          style={{
                            backgroundColor: item.isActive ? "red" : "",
                          }}
                          type="button"
                          onClick={() => {
                            handleMarkReceived(item.requestId, item.postId);
                          }}
                          disabled={item.status !== "Pending" || isInProcessing}
                        >
                          {item.status === "Pending" ? (
                            isInProcessing ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              "Mark as received"
                            )
                          ) : (
                            item.status
                          )}
                        </button>
                        {item.status === "Pending" && (
                          <button
                            aria-label="Cancel hand over button"
                            className="btn-yellow"
                            type="button"
                            onClick={() => {
                              handleCancelHandOver(item.requestId);
                            }}
                            disabled={isInProcessing}
                          >
                            {isInProcessing ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              "Cancel handover"
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
    </>
  );
}
