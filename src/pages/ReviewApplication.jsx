import SidebarProfile from "../components/SidebarProfile";

export default function ReviewApplication() {
  return (
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
        <nav className="review-app-breadcrumb">
          <a href="/">Home</a>
          <span>›</span>
          <a href="/institution-requests">Institution Requests</a>
          <span>›</span>
          <strong>St. Francis Academy</strong>
        </nav>

        <header className="review-app-header">
          <div className="review-app-title-area">
            <h1>Review Application: St. Francis Academy</h1>

            <div className="review-app-title-meta">
              <span className="review-app-pending-badge">
                <span />
                Pending Review
              </span>

              <span className="review-app-submitted">
                <i className="fas fa-clock" />
                Submitted Oct 24, 2023
              </span>
            </div>
          </div>

          <div className="review-app-header-actions">
            <button type="button" className="review-app-decline-button">
              Decline
            </button>

            <button type="button" className="review-app-approve-button">
              Approve
              <br />
              Institution
            </button>
          </div>
        </header>

        <section className="review-app-layout">
          <div className="review-app-main-column">
            <article className="review-app-card">
              <div className="review-app-card-title">
                <div className="review-app-title-icon review-app-title-icon-peach">
                  <i className="fas fa-building" />
                </div>
                <h2>Institution Information</h2>
              </div>

              <div className="review-app-information-grid">
                <div className="review-app-information-item">
                  <span>School Name</span>
                  <strong>St. Francis Academy</strong>
                </div>

                <div className="review-app-information-item">
                  <span>Website</span>
                  <a href="https://www.stfrancis.edu">www.stfrancis.edu</a>
                </div>

                <div className="review-app-information-item">
                  <span>Estimated Population</span>
                  <strong>4,500 Students &amp; Staff</strong>
                </div>

                <div className="review-app-information-item">
                  <span>Address</span>
                  <strong>
                    1200 University Ave,
                    <br />
                    Cambridge, MA
                  </strong>
                </div>
              </div>
            </article>

            <article className="review-app-card">
              <div className="review-app-card-title">
                <div className="review-app-title-icon review-app-title-icon-blue">
                  <i className="fas fa-user" />
                </div>
                <h2>Applicant Information</h2>
              </div>

              <div className="review-app-information-grid">
                <div className="review-app-information-item">
                  <span>Full Name</span>
                  <strong>Dr. Eleanor Rigby</strong>
                </div>

                <div className="review-app-information-item">
                  <span>Work Email</span>
                  <strong>e.rigby@stfrancis.edu</strong>
                </div>

                <div className="review-app-information-item">
                  <span>Job Title / Department</span>
                  <strong>Director of Student Affairs</strong>
                </div>

                <div className="review-app-information-item">
                  <span>Phone Number</span>
                  <strong>+1(555) 982-3041</strong>
                </div>
              </div>
            </article>

            <article className="review-app-card review-app-additional-card">
              <div className="review-app-card-title">
                <div className="review-app-title-icon review-app-title-icon-yellow">
                  <i className="fas fa-file-alt" />
                </div>
                <h2>Additional Information</h2>
              </div>

              <div className="review-app-text-section">
                <span>Why Back2Me?</span>
                <p>
                  “Our campus currently lacks a centralized, modern solution for
                  lost and found. We have multiple departments handling items
                  independently, leading to low return rates. We want to unify
                  our campus community and reduce student stress through
                  Back2Me’s automated notification system.”
                </p>
              </div>

              <div className="review-app-text-divider" />

              <div className="review-app-text-section">
                <span>Additional Notes</span>
                <p className="review-app-italic-text">
                  “We are looking to implement this before the spring semester
                  begins. Please let us know if additional documentation
                  regarding our campus charter is required.”
                </p>
              </div>
            </article>
          </div>

          <aside className="review-app-side-column">
            <article className="review-app-card review-app-checklist-card">
              <h2>Verification Checklist</h2>

              <div className="review-app-check-item review-app-check-item-complete">
                <div className="review-app-check-checkbox">
                  <i className="fas fa-check" />
                </div>

                <div className="review-app-check-copy">
                  <strong>Email Verified</strong>
                  <span>
                    Domain @stfrancis.edu
                    <br />
                    confirmed
                  </span>
                </div>

                <i
                  className="fas fa-check-circle review-app-check-success"
                  size={18}
                />
              </div>

              <div className="review-app-check-item review-app-check-item-complete">
                <div className="review-app-check-checkbox">
                  <i className="fas fa-check" />
                </div>

                <div className="review-app-check-copy">
                  <strong>Website Authenticated</strong>
                  <span>
                    SSL and WHOIS checks
                    <br />
                    passed
                  </span>
                </div>

                <i
                  className="fas fa-check-circle review-app-check-success"
                  size={18}
                />
              </div>

              <div className="review-app-check-item review-app-check-item-pending">
                <div className="review-app-check-checkbox" />

                <div className="review-app-check-copy">
                  <strong>Institutional Authorization</strong>
                  <span>
                    Manual signature check
                    <br />
                    required
                  </span>
                </div>

                <i
                  className="fas fa-clock review-app-check-waiting"
                  size={17}
                />
              </div>
            </article>

            <article className="review-app-card review-app-activity-card">
              <h2>Activity Log</h2>

              <div className="review-app-activity-timeline">
                <div className="review-app-activity-row">
                  <div className="review-app-activity-line">
                    <span className="review-app-activity-dot review-app-activity-dot-orange">
                      <i className="fas fa-clock" />
                    </span>
                  </div>

                  <div className="review-app-activity-content">
                    <strong>Email Verified</strong>
                    <span>Oct 24, 2023 at 11:45 AM</span>

                    <div className="review-app-activity-note">
                      The automated verification link was clicked and confirmed
                      by the applicant.
                    </div>
                  </div>
                </div>

                <div className="review-app-activity-row">
                  <div className="review-app-activity-line">
                    <span className="review-app-activity-dot review-app-activity-dot-blue">
                      <i className="fas fa-file-alt" />
                    </span>
                  </div>

                  <div className="review-app-activity-content">
                    <strong>Form Submitted</strong>
                    <span>Oct 24, 2023 at 11:30 AM</span>
                    <p>Application successfully reached the admin queue.</p>
                  </div>
                </div>

                <div className="review-app-activity-row review-app-activity-row-last">
                  <div className="review-app-activity-line">
                    <span className="review-app-activity-dot review-app-activity-dot-muted">
                      <i className="fas fa-clock" />
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
              <img
                src="/institution-campus-map.png"
                alt="St. Francis Academy campus map"
              />

              <div className="review-app-map-overlay">
                <i className="fas fa-map-marker-alt" />
                Location Verification
              </div>
            </article>
          </aside>
        </section>
      </div>
    </main>
  );
}
