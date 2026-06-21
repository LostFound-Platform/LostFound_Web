import { useEffect, useState } from "react";
import SidebarProfile from "../components/SidebarProfile";
import axios from "axios";
import dayjs from "dayjs";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { debounce, set } from "lodash";
import axiosInstance from "../api/axiosInstance";

export default function Users() {
  // Variables
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [isInProcessing, setIsInProcessing] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

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
      // Receive user suspended
      connection.on("ReceiveUserSuspended", (data) => {
        setUsers((prevUsers) => {
          const index = prevUsers.findIndex((u) => u.userId === data.userId);
          if (index === -1) return prevUsers;
          const next = [...prevUsers];
          next[index].isActive = false;
          return next;
        });
      });

      // Receive user suspended
      connection.on("ReceiveUserUnsuspended", (data) => {
        setUsers((prevUsers) => {
          const index = prevUsers.findIndex((u) => u.userId === data.userId);
          if (index === -1) return prevUsers;
          const next = [...prevUsers];
          next[index] = {
            ...next[index],
            isActive: true,
          };
          return next;
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

  // Get category posts
  const searchEmail = async (query) => {
    if (query.trim() == "") return null;

    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get(
        `/Users/search-email?query=${query}`,
        {
          // withCredentials: true,
          validateStatus: (status) =>
            status === 200 || status === 401 || status === 404,
        },
      );

      if (response.status === 200) {
        setUsers(response.data);
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

  const debouncedFetch = debounce(searchEmail, 500);

  // Handle mark received
  const handleMarkReceived = async (postId) => {
    setIsInProcessing(true);

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
      setIsInProcessing(false);
    }
  };

  // Get all users
  const handleGetAllUsers = async () => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get("/Users", {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404 || status === 403,
      });

      if (response.status === 200) {
        setUsers(response.data);
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

  // Suspend user
  const suspendUser = async (userId) => {
    setIsRequesting(true);

    try {
      const response = await axiosInstance.put(
        `/Users/suspend-user/${userId}`,
        null,
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
              message: response.data,
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

  // Unsuspend user
  const unsuspendUser = async (userId) => {
    setIsRequesting(true);

    try {
      const response = await axiosInstance.put(
        `/Users/unsuspend-user/${userId}`,
        null,
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
              message: response.data,
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

  // Fetch data from API
  useEffect(() => {
    handleGetAllUsers();
  }, []);

  // Run realtime
  useEffect(() => {
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
              placeholder="Search email..."
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
                  <th>Avatar</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Student ID</th>
                  <th>Date Created</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isInProcessing ? (
                  <tr>
                    <td colSpan={7}>
                      <i className="fas fa-spinner fa-spin"></i>
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((item, index) => (
                    <tr key={item.userId}>
                      <td>{index + 1}</td>
                      <td>
                        <a href={`/dashboard/user/${item.userId}`}>
                          {item.avatar ? (
                            <img
                              src={item.urlAvatar}
                              alt="user avatar"
                              style={{
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                              width={50}
                              height={50}
                            />
                          ) : (
                            <img
                              src="/Image/user_icon.png"
                              alt="user avatar"
                              style={{
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                              width={50}
                              height={50}
                            />
                          )}
                        </a>
                      </td>
                      <td>
                        {item.firstName} {item.lastName}
                      </td>
                      <td>{item.email}</td>
                      <td>{item.role}</td>
                      <td>{item.studentId}</td>
                      <td>{dayjs(item.createdAt).format("MM/DD/YYYY")}</td>
                      <td>
                        <span
                          className={`status ${
                            item.isActive ? "active" : "inactive"
                          }`}
                        >
                          {item.isActive ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td>
                        <button
                          aria-label={
                            item.isActive
                              ? "Suspend account button"
                              : "Unsuspend account button"
                          }
                          className="btn"
                          style={{
                            backgroundColor: item.isActive ? "red" : "green",
                          }}
                          type="button"
                          onClick={() => {
                            item.isActive
                              ? suspendUser(item.userId)
                              : unsuspendUser(item.userId);
                          }}
                        >
                          {isRequesting ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : item.isActive ? (
                            "Suspend account"
                          ) : (
                            "Unsuspend account"
                          )}
                        </button>
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
