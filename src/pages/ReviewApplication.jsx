import { Suspense, useEffect, useState } from "react";
import SidebarProfile from "../components/SidebarProfile";
import axiosInstance from "../api/axiosInstance";
import { useParams } from "react-router-dom";
import { FormatDate } from "../components/FormatDate";
import { FormatDateTime } from "../components/FormatDateTime";
import { FormatPhoneNumber } from "../components/FormatPhoneNumber";
import { Helmet } from "react-helmet-async";
import DeclineRequestModal from "../components/DeclineRequestModal";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Lonely404 from "../assets/animations/Lonely404.json";

export default function ReviewApplication() {
  const [institution, setInstitution] = useState("");
  const [isGettingInstitution, setIsGettingInstitution] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [isAuthorizedInstitution, setIsAuthorizedInstitution] = useState(false);
  const [mapUrl, setMapUrl] = useState(false);
  const { id } = useParams();
  const populationLabels = {
    Under5000: "Under 5,000",
    From5000To15000: "5,000-15,000",
    From15001To30000: "15,001-30,000",
    Over30000: "Over 30,000",
  };

  // Functions
  // Get institution requests
  const getInstitution = async () => {
    setIsGettingInstitution(true);

    try {
      const response = await axiosInstance.get(`/InstitutionRequest/${id}`, {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404 || status === 403,
      });

      if (response.status === 200) {
        setInstitution(response.data);
        setMapUrl(
          `https://www.google.com/maps?q=${encodeURIComponent(`${response.data.institutionAddress} ${response.data.institutionName}`)}&output=embed`,
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
      setIsGettingInstitution(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getInstitution();
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Helmet for setting the page title */}
      <Helmet>
        <title>Review Application | Back2Me </title>
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

        <div className="review-app-page">
          {isGettingInstitution ? (
            <span
              style={{
                fontSize: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <i className="fas fa-spinner fa-spin"></i> Loading
            </span>
          ) : !institution ? (
            <div className="not-found">
              <Suspense fallback={<p>Loading animation...</p>}>
                <DotLottieReact
                  data={Lonely404}
                  autoplay
                  loop
                  style={{ width: "70%", margin: "auto" }}
                />
              </Suspense>
              <h1 style={{ fontSize: "40px" }}>Application Not Found</h1>
              <p style={{ color: "", marginBottom: "20px" }}>
                Sorry, the application you are looking for doesn't exist or has
                been moved.
              </p>
              <button
                aria-label="Go back button"
                className="btn"
                onClick={() => {
                  window.history.back();
                }}
              >
                <i className="fa-solid fa-arrow-left"></i> Go Back
              </button>
            </div>
          ) : (
            <>
              {" "}
              <header className="review-app-header">
                <div className="review-app-title-area">
                  <h1>Review Application: {institution.institutionName}</h1>

                  <div className="review-app-title-meta">
                    <span
                      className={`review-app-pending-badge ${
                        institution.status === "Pending"
                          ? "review-app-pending-badge"
                          : institution.status === "Approved"
                            ? "review-app-approved-badge"
                            : "review-app-rejected-badge"
                      }`}
                    >
                      <span />
                      {institution.status === "Pending"
                        ? "Pending Review"
                        : institution.status === "Approved"
                          ? "Approved"
                          : "Rejected"}
                    </span>

                    <span className="review-app-submitted">
                      <i className="fa-solid fa-clock" />
                      Submitted {FormatDate(institution.submittedDate)}
                    </span>
                  </div>
                </div>

                <div className="review-app-header-actions">
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

                  <button
                    className={`${isAuthorizedInstitution && "review-app-approve-button"} btn`}
                    onClick={() => {
                      handleApproveInstitution();
                    }}
                    aria-label="Approve Institution button"
                    disabled={!isAuthorizedInstitution}
                  >
                    <i className="fa-solid fa-circle-check"></i> Approve
                  </button>
                </div>

                {/* Popup Modal Decline */}
                {showDeclineModal && (
                  <DeclineRequestModal
                    onClose={() => setShowDeclineModal(false)}
                  />
                )}
              </header>
              <section className="review-app-layout">
                <div className="review-app-main-column">
                  <article className="review-app-card">
                    <div className="review-app-card-title">
                      <div className="review-app-title-icon review-app-title-icon-peach">
                        <i className="fa-solid fa-building" />
                      </div>
                      <h2>Institution Information</h2>
                    </div>

                    <div className="review-app-information-grid">
                      <div className="review-app-information-item">
                        <span>School Name</span>
                        <strong>{institution.institutionName}</strong>
                      </div>

                      <div className="review-app-information-item">
                        <span>Website</span>
                        <a
                          href={`${institution.institutionWebsite}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {institution.institutionWebsite}
                        </a>
                      </div>

                      <div className="review-app-information-item">
                        <span>Estimated Student Population</span>
                        <strong>
                          {populationLabels[institution.estimatedPopulation] ??
                            "Not provided"}
                        </strong>
                      </div>

                      <div className="review-app-information-item">
                        <span>Address</span>
                        <strong>
                          {institution.institutionAddress},{" "}
                          {institution.institutionCity},{" "}
                          {institution.institutionState}
                        </strong>
                      </div>
                    </div>
                  </article>

                  <article className="review-app-card">
                    <div className="review-app-card-title">
                      <div className="review-app-title-icon review-app-title-icon-blue">
                        <i className="fa-solid fa-user" />
                      </div>
                      <h2>Applicant Information</h2>
                    </div>

                    <div className="review-app-information-grid">
                      <div className="review-app-information-item">
                        <span>Full Name</span>
                        <strong>{institution.applicantName}</strong>
                      </div>

                      <div className="review-app-information-item">
                        <span>Work Email</span>
                        <strong>{institution.workEmail}</strong>
                      </div>

                      <div className="review-app-information-item">
                        <span>Job Title / Department</span>
                        <strong>{institution.jobTitle}</strong>
                      </div>

                      <div className="review-app-information-item">
                        <span>Phone Number</span>
                        <a href={`tel:+1${institution.applicantPhoneNumber}`}>
                          <strong>
                            {institution.applicantPhoneNumber
                              ? FormatPhoneNumber(
                                  institution.applicantPhoneNumber,
                                )
                              : "-"}
                          </strong>
                        </a>
                      </div>
                    </div>
                  </article>

                  <article className="review-app-card review-app-additional-card">
                    <div className="review-app-card-title">
                      <div className="review-app-title-icon review-app-title-icon-yellow">
                        <i className="fa-solid fa-file-alt" />
                      </div>
                      <h2>Additional Information</h2>
                    </div>

                    <div className="review-app-text-section">
                      <span>Why Back2Me?</span>
                      <p>“{institution.additionalInformation}”</p>
                    </div>

                    <div className="review-app-text-divider" />

                    <div className="review-app-text-section">
                      <span>Additional Notes</span>
                      <p className="review-app-italic-text">
                        “{institution.additionalNote}”
                      </p>
                    </div>
                  </article>
                </div>

                <aside className="review-app-side-column">
                  <article className="review-app-card review-app-checklist-card">
                    <h2>Verification Checklist</h2>

                    <label
                      className={`review-app-check-item ${institution.isVerifiedEmail ? "review-app-check-item-complete" : "review-app-check-item-pending"}`}
                      style={{ cursor: "not-allowed" }}
                    >
                      <div className="review-app-check-copy">
                        <strong>Email Verified</strong>
                        <span>
                          {institution.isVerifiedEmail
                            ? `Domain ${institution.workEmail.substring(institution.workEmail.indexOf("@"))} confirmed`
                            : `Verification email sent to ${institution.workEmail}`}
                        </span>
                      </div>

                      {institution.isVerifiedEmail ? (
                        <i className="fa-solid fa-circle-check review-app-check-success" />
                      ) : (
                        <i className="fa-solid fa-clock review-app-check-waiting" />
                      )}
                    </label>

                    <label
                      className={`review-app-check-item ${institution.isVerifiedWebsite ? "review-app-check-item-complete" : "review-app-check-item-pending"}`}
                    >
                      <input
                        type="checkbox"
                        className="review-app-real-checkbox"
                        aria-label="Website authenticated"
                      />

                      <div className="review-app-check-copy">
                        <strong>Website Authenticated</strong>
                        <span>
                          {institution.isVerifiedWebsite
                            ? `Official website verified`
                            : `Website verification in progress`}
                        </span>
                      </div>

                      {institution.isVerifiedWebsite ? (
                        <i className="fa-solid fa-circle-check review-app-check-success" />
                      ) : (
                        <i className="fa-solid fa-clock review-app-check-waiting" />
                      )}
                    </label>

                    <label
                      className={`review-app-check-item ${institution.isVerifiedEmail && institution.isVerifiedWebsite ? "review-app-check-item-complete" : "review-app-check-item-pending"}`}
                      style={{ cursor: "not-allowed" }}
                    >
                      <div className="review-app-check-copy">
                        <strong>Institutional Authorization</strong>
                        <span>
                          Automatically verified after email and website
                          validation
                        </span>
                      </div>

                      {institution.isVerifiedEmail &&
                      institution.isVerifiedWebsite ? (
                        <i className="fa-solid fa-circle-check review-app-check-success" />
                      ) : (
                        <i className="fa-solid fa-clock review-app-check-waiting" />
                      )}
                    </label>
                  </article>

                  <article className="review-app-card review-app-activity-card">
                    <h2>Activity Log</h2>

                    <div className="review-app-activity-timeline">
                      <div className="review-app-activity-row">
                        <div className="review-app-activity-line">
                          <span className="review-app-activity-dot review-app-activity-dot-blue">
                            <i className="fa-solid fa-file-alt" />
                          </span>
                        </div>

                        <div className="review-app-activity-content">
                          <strong>Form Submitted</strong>
                          <span>
                            {FormatDateTime(institution.submittedDate)}
                          </span>
                          <p>
                            Application successfully reached the admin queue.
                          </p>
                        </div>
                      </div>

                      {institution.isVerifiedEmail && (
                        <div className="review-app-activity-row">
                          <div className="review-app-activity-line">
                            <span className="review-app-activity-dot review-app-activity-dot-orange">
                              <i className="fa-solid fa-envelope"></i>
                            </span>
                          </div>

                          <div className="review-app-activity-content">
                            <strong>Email Verified</strong>
                            <span>
                              {FormatDateTime(institution.emailVerifiedAt)}
                            </span>

                            <div className="review-app-activity-note">
                              The automated verification link was clicked and
                              confirmed by the applicant.
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="review-app-activity-row review-app-activity-row-last">
                        <div className="review-app-activity-line">
                          <span className="review-app-activity-dot review-app-activity-dot-muted">
                            <i className="fa-solid fa-calendar" />
                          </span>
                        </div>

                        <div className="review-app-activity-content">
                          <strong>Review Started</strong>
                          <span>Awaiting action...</span>
                        </div>
                      </div>
                    </div>
                  </article>

                  <article className="review-app-map-card">
                    <iframe
                      src={mapUrl ? mapUrl : ""}
                      width="350"
                      height="200"
                      style={{ border: "0" }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                    ></iframe>

                    <div className="review-app-map-overlay">
                      <i className="fa-solid fa-map-marker-alt" />
                      Location Verification
                    </div>
                  </article>
                </aside>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}
