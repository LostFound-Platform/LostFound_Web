import { useEffect, useState } from "react";
import SidebarProfile from "../components/SidebarProfile";
import axiosInstance from "../api/axiosInstance";
import { FormatDate } from "../components/FormatDate";
import { Helmet } from "react-helmet-async";
import DeclineRequestModal from "../components/DeclineRequestModal";

export default function InstitutionRequests() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isGettingRequests, setIsGettingRequests] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [requests, setRequests] = useState([]);

  // Functions
  // Get institution requests
  const getInstitutionRequests = async () => {
    setIsGettingRequests(true);

    try {
      const response = await axiosInstance.get("/InstitutionRequest", {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status === 200) {
        const updatedData = response.data.map((item) => {
          const nameParts = item.institutionName
            ? item.institutionName.trim().split(" ")
            : [""];
          const initials =
            nameParts.length > 1
              ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
              : `${nameParts[0][0] || ""}`.toUpperCase();

          return {
            ...item,
            initials: initials, // Add field initials
          };
        });

        setRequests(updatedData);
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
      setIsGettingRequests(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getInstitutionRequests();
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Helmet for setting the page title */}
      <Helmet>
        <title>Institution Requests | Back2Me </title>
      </Helmet>

      <main
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

        <div className="institution-admin-page">
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

          <section className="institution-admin-content">
            <div className="institution-admin-heading">
              <h1>Institution Requests</h1>
              <p>
                Review and manage pending partnership applications from academic
                institutions.
              </p>
            </div>

            <section className="institution-admin-stat-grid">
              <article className="institution-admin-stat-card">
                <div className="institution-admin-stat-decoration institution-admin-stat-decoration-peach" />

                <div className="institution-admin-stat-icon institution-admin-stat-icon-peach">
                  <i className="fa-solid fa-clipboard-list"></i>
                </div>

                <span className="institution-admin-stat-label">
                  Pending Requests
                </span>

                <strong>24</strong>

                <p className="institution-admin-stat-positive">
                  ↗ &nbsp;+12% from last week
                </p>
              </article>

              <article className="institution-admin-stat-card">
                <div className="institution-admin-stat-decoration institution-admin-stat-decoration-blue" />

                <div className="institution-admin-stat-icon institution-admin-stat-icon-blue">
                  <i className="fa-solid fa-building"></i>
                </div>

                <span className="institution-admin-stat-label">
                  Total Institutions
                </span>

                <strong>142</strong>

                <p>Across 4 different regions</p>
              </article>

              <article className="institution-admin-stat-card">
                <div className="institution-admin-stat-decoration institution-admin-stat-decoration-yellow" />

                <div className="institution-admin-stat-icon institution-admin-stat-icon-yellow">
                  <i className="fa-solid fa-bolt"></i>
                </div>

                <span className="institution-admin-stat-label">New Today</span>

                <strong>8</strong>

                <p>
                  <span className="institution-admin-live-dot" />
                  Last request 12m ago
                </p>
              </article>
            </section>

            <section className="institution-admin-main-grid">
              <div className="institution-admin-table-card">
                <div className="institution-admin-table-header">
                  <h2>Recent Submissions</h2>

                  <div>
                    <button type="button" aria-label="Filter requests">
                      <i className="fa-solid fa-filter"></i>
                    </button>

                    <button type="button" aria-label="Download requests">
                      <i className="fa-solid fa-download"></i>
                    </button>
                  </div>
                </div>

                <div className="institution-admin-table-scroll">
                  <table className="institution-admin-table">
                    <thead>
                      <tr>
                        <th>Institution Name</th>
                        <th>Applicant</th>
                        <th>
                          Date
                          <br />
                          Submitted
                        </th>
                        <th>Status</th>
                        <th aria-label="Open request" />
                      </tr>
                    </thead>

                    <tbody>
                      {isGettingRequests ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: "center" }}>
                            <i className="fas fa-spinner fa-spin"></i>
                          </td>
                        </tr>
                      ) : requests && requests.length == 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: "center" }}>
                            No data
                          </td>
                        </tr>
                      ) : (
                        requests.map((request) => (
                          <tr
                            key={request.institutionRequestId}
                            className={
                              selectedRequest?.institutionName ===
                              request.institutionName
                                ? "institution-admin-row-selected"
                                : ""
                            }
                            onClick={() => setSelectedRequest(request)}
                          >
                            <td>
                              <div className="institution-admin-institution-cell">
                                <span className="institution-admin-avatar">
                                  {console.log(request.initials)}
                                  {request.initials}
                                </span>

                                <strong>{request.institutionName}</strong>
                              </div>
                            </td>

                            <td>{request.applicantName}</td>

                            <td>{FormatDate(request.submittedDate)}</td>

                            <td>
                              <span
                                className={`institution-admin-status ${request.status === "Pending" ? "pending" : request.status === "Approved" ? "approved" : "declined"}`}
                              >
                                <i
                                  className={`fa-solid fa-${request.status === "Pending" ? "clock" : request.status === "Approved" ? "check" : "xmark"}`}
                                  style={{ marginRight: "3px" }}
                                ></i>{" "}
                                {request.status}
                              </span>
                            </td>

                            <td>
                              <i className="fa-solid fa-chevron-right"></i>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="institution-admin-table-footer">
                  <span>Showing 5 of 24 requests</span>

                  <div>
                    <button type="button">Previous</button>
                    <button type="button">Next</button>
                  </div>
                </div>
              </div>

              <aside className="institution-admin-details-card">
                {selectedRequest ? (
                  <div className="institution-admin-selected-details">
                    <div className="institution-admin-details-icon">
                      <i className="fa-solid fa-building"></i>
                    </div>

                    <h2>{selectedRequest.institutionName}</h2>

                    <p className="institution-admin-details-applicant">
                      Submitted by {selectedRequest.applicantName}
                    </p>

                    <div className="institution-admin-detail-block">
                      <span>Work Email</span>
                      <strong>{selectedRequest.workEmail}</strong>
                    </div>

                    <div className="institution-admin-detail-block">
                      <span>Official Website</span>
                      <a
                        href={selectedRequest.institutionWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "underline" }}
                      >
                        <strong>
                          {selectedRequest.institutionWebsite || "Not provided"}
                        </strong>
                      </a>
                    </div>

                    <div className="institution-admin-detail-block">
                      <span>Verification</span>

                      <div className="verification-summary">
                        <div
                          style={{
                            opacity: selectedRequest.isVerifiedEmail ? 1 : 0.5,
                          }}
                        >
                          <i
                            className={`fa-solid fa-${selectedRequest.isVerifiedEmail ? "check" : "clock"}`}
                          ></i>{" "}
                          Email Verified
                        </div>

                        <div
                          style={{
                            opacity: selectedRequest.isVerifiedWebsite
                              ? 1
                              : 0.5,
                          }}
                        >
                          <i
                            className={`fa-solid fa-${selectedRequest.isVerifiedWebsite ? "check" : "clock"}`}
                          ></i>{" "}
                          Website Verified
                        </div>
                      </div>
                    </div>

                    <div className="institution-admin-detail-block">
                      <span>Status</span>
                      <strong>
                        {selectedRequest.status === "Pending"
                          ? "Pending review"
                          : selectedRequest.status === "Approved"
                            ? "Approved"
                            : "declined"}
                      </strong>
                    </div>

                    <div className="institution-review-decline-button-container">
                      <a
                        href={`/dashboard/review-application/${selectedRequest.institutionRequestId}`}
                        className="btn"
                        aria-label="Review application link"
                        style={{ width: "100%", marginTop: "8px" }}
                      >
                        {selectedRequest.status === "Pending" ? (
                          <>
                            <i className="fa-solid fa-clipboard-check"></i>{" "}
                            Review application
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-eye"></i> View application
                          </>
                        )}
                      </a>
                      {selectedRequest.status === "Pending" && (
                        <button
                          className="btn-with-border"
                          aria-label="Decline Institution button"
                          onClick={() => {
                            // handleDeclineInstitution();
                            setShowDeclineModal(true);
                          }}
                        >
                          <i className="fa-solid fa-circle-xmark"></i> Decline
                        </button>
                      )}

                      {/* Popup Modal Decline */}
                      {showDeclineModal && (
                        <DeclineRequestModal
                          onClose={() => setShowDeclineModal(false)}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="institution-admin-empty-details">
                    <div className="institution-admin-details-icon">
                      <i className="fa-solid fa-inbox"></i>
                    </div>

                    <h2>No Request Selected</h2>

                    <p>
                      Select a row from the list to see detailed institution
                      information and application files.
                    </p>

                    <button type="button">
                      <i className="fa-solid fa-history"></i>
                      Review pending history
                    </button>

                    <button type="button">
                      <i className="fa-solid fa-clipboard-check"></i>
                      Verification checklist
                    </button>
                  </div>
                )}
              </aside>
            </section>
          </section>
        </div>
      </main>
    </>
  );
}
