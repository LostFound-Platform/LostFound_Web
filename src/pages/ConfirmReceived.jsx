import { useEffect, useState } from "react";
import SidebarProfile from "../components/SidebarProfile";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { debounce } from "lodash";
import axiosInstance from "../api/axiosInstance";

export default function ConfirmReceived() {
  // Variables
  const [codes, setCodes] = useState([]);
  const [objectToPrint, setObjectToPrint] = useState(null);
  const [query, setQuery] = useState("");
  const [isInProcessing, setIsInProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // APIs

  // Functions
  // Remove tags in html when printing
  const stripHtml = (html = "") => {
    const div = document.createElement("div");
    div.innerHTML = html; // remove tags (apply that tag to real html)
    return div.textContent || div.innerText || "";
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
      connection.on("ReceiveNewLostPostCode", (data) => {
        setCodes((preCodes) => {
          if (preCodes.some((p) => p.postId == data.postId)) return preCodes;

          return [data, ...preCodes];
        });
      });

      // Get status mark post
      connection.on("ReceiveStatusMarkPost", (data) => {
        setCodes((preCodes) => {
          return preCodes.map((p) => {
            return p.postId === data.postId
              ? { ...p, isReceived: data.isReceived }
              : p;
          });
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
  const searchCodes = async (query) => {
    if (query.trim() == "") return null;

    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get(
        `/Post/search-codes?query=${query}`,
        {
          // withCredentials: true,
          validateStatus: (status) =>
            status === 200 || status === 401 || status === 404,
        },
      );

      if (response.status === 200) {
        setCodes(response.data);
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

  const debouncedFetch = debounce(searchCodes, 500);

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
        document.getElementById("popup-confirm-signed-in").style.display =
          "none";
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

  // Get codes of lost items
  const handleCodeLost = async () => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.get("/Post/lost-post-codes", {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404 || status === 403,
      });

      if (response.status === 200) {
        setCodes(response.data);
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
    handleCodeLost();
  }, []);

  // Print confirmation form
  useEffect(() => {
    if (objectToPrint) {
      window.print();

      document.getElementById("popup-confirm-signed-in").style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  }, [objectToPrint]);

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
              placeholder="Search code..."
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
                  <th>Code</th>
                  <th>Item</th>
                  <th>Type</th>
                  <th>User</th>
                  <th>Date Posted</th>
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
                ) : codes.length > 0 ? (
                  codes.map((item, index) => (
                    <tr key={item.postId}>
                      <td>{index + 1}</td>
                      <td>{item.code}</td>
                      <td>
                        <a
                          href={`/detail-post/${item.postId}`}
                          style={{ textDecoration: "underline" }}
                          aria-label={`Detail link for ${item.title}`}
                        >
                          {item.title}
                        </a>
                      </td>
                      <td>{item.typePost}</td>
                      <td>
                        {item.user.firstName} {item.user.lastName}
                      </td>
                      <td>{dayjs(item.createdAt).format("MM/DD/YYYY")}</td>
                      <td>
                        <span
                          className={`status ${item.isReceived ? "active" : "inactive"
                            }`}
                        >
                          {item.isReceived ? "Received" : "Not Receive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn"
                          type="button"
                          onClick={() => {
                            // handleMarkReceived(item.postId);
                            setObjectToPrint({
                              fullName: `${item.user.firstName} ${item.user.lastName}`,
                              code: `${item.code}`,
                              studentId: `${item.studentId}`,
                              description: item.description,
                              itemName: item.title,
                              categoryName: item.categoryName,
                              email: item.user?.email,
                              postId: item.postId,
                              typePost: item.typePost,
                            });
                          }}
                          disabled={isInProcessing || item.isReceived}
                        >
                          {isInProcessing ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : item.isReceived ? (
                            <>
                              <i className="fa-solid fa-circle-check"></i>{" "}
                              Received
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-print"></i> Print
                              Receipt
                            </>
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

      {/* Popup change pick up time */}
      <div className="modal" id="popup-confirm-signed-in">
        <div className="modal-content">
          <h2 style={{ backgroundColor: "transparent" }}>
            Did the student sign the receipt confirming they received the item?
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
              Please ensure that the student has signed the receipt before
              leaving.
            </p>
          </div>

          <div style={{ marginTop: "40px" }}>
            <button
              className="btn"
              onClick={() => {
                handleMarkReceived(objectToPrint?.postId);
              }}
              disabled={isInProcessing}
            >
              {isInProcessing ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                "Yes"
              )}
            </button>
            <button
              className="btn-yellow btn-cancel-pick-up"
              onClick={() => {
                document.getElementById(
                  "popup-confirm-signed-in",
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

      {/* Form to print */}
      <div className="form-container-print">
        <h1>RECEIPT CONFIRMATION</h1>
        <p className="subtitle">Confirmation of Lost Item Pick-up</p>

        <div className="section">
          <h2>User Information</h2>

          <div className="row">
            <div className="field">
              <span>Full Name:</span>
              <div className="box">{objectToPrint?.fullName}</div>
            </div>
            <div className="field">
              <span>Student ID:</span>
              <div className="box">{objectToPrint?.studentId}</div>
            </div>
          </div>

          <div className="row">
            <div className="field">
              <span>Email:</span>
              <div className="box">{objectToPrint?.email}</div>
            </div>
            <div className="field">
              <span>Code to Get Item:</span>
              <div className="box">{objectToPrint?.code}</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Item Information</h2>

          <div className="row">
            <div className="field">
              <span>Item Name:</span>
              <div className="box">{objectToPrint?.itemName}</div>
            </div>
            <div className="field">
              <span>Category:</span>
              <div className="box">{objectToPrint?.categoryName}</div>
            </div>
          </div>

          <div className="row">
            <div className="field">
              <span>Post ID:</span>
              <div className="box">{objectToPrint?.postId}</div>
            </div>
            <div className="field">
              <span>Status:</span>
              <div className="box">{objectToPrint?.typePost}</div>
            </div>
          </div>

          <div className="row">
            <div className="field full">
              <span>Description:</span>
              <div className="box large">
                {objectToPrint?.description ? (
                  stripHtml(objectToPrint?.description)
                ) : (
                  <span
                    style={{
                      fontSize: "unset",
                      fontWeight: "unset",
                      fontStyle: "italic",
                      padding: "5px 0",
                    }}
                  >
                    (The user did not provide this information)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Confirmation</h2>
          <p className="confirm-text">
            I confirm that I have received the lost item described above.
          </p>

          <div className="row">
            <div className="field">
              <span>Signature:</span>
              <div className="box signature"></div>
            </div>
            <div className="field">
              <span>Date:</span>
              <div className="box">
                {dayjs(new Date()).format("MM/DD/YYYY")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
