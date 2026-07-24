import { useState } from "react";
import SidebarProfile from "../components/SidebarProfile";

export default function InstitutionRequests() {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const requests = [
    {
      initials: "SF",
      institution: "St. Francis Academy",
      applicant: "Dr. Helena Vance",
      date: "Oct 24, 2023",
    },
    {
      initials: "UV",
      institution: "University of Valdosta",
      applicant: "Mark Thompson",
      date: "Oct 23, 2023",
    },
    {
      initials: "GH",
      institution: "Green Hills Institute",
      applicant: "Sarah Jenkins",
      date: "Oct 23, 2023",
    },
    {
      initials: "NT",
      institution: "North Tech College",
      applicant: "Julian O’Connor",
      date: "Oct 22, 2023",
    },
    {
      initials: "MS",
      institution: "Mountain Science HS",
      applicant: "Linda Wu",
      date: "Oct 22, 2023",
    },
  ];

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
                    {requests.map((request) => (
                      <tr
                        key={request.institution}
                        className={
                          selectedRequest?.institution === request.institution
                            ? "institution-admin-row-selected"
                            : ""
                        }
                        onClick={() => setSelectedRequest(request)}
                      >
                        <td>
                          <div className="institution-admin-institution-cell">
                            <span className="institution-admin-avatar">
                              {request.initials}
                            </span>

                            <strong>{request.institution}</strong>
                          </div>
                        </td>

                        <td>{request.applicant}</td>

                        <td>{request.date}</td>

                        <td>
                          <span className="institution-admin-status">
                            Pending
                          </span>
                        </td>

                        <td>
                          <i className="fa-solid fa-chevron-right"></i>
                        </td>
                      </tr>
                    ))}
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

                  <h2>{selectedRequest.institution}</h2>

                  <p className="institution-admin-details-applicant">
                    Submitted by {selectedRequest.applicant}
                  </p>

                  <div className="institution-admin-detail-block">
                    <span>Submission date</span>
                    <strong>{selectedRequest.date}</strong>
                  </div>

                  <div className="institution-admin-detail-block">
                    <span>Status</span>
                    <strong>Pending review</strong>
                  </div>

                  <a
                    href="/dashboard/review-application/st-francis-academy"
                    className="btn"
                    style={{ width: "100%", marginTop: "8px" }}
                  >
                    Review application
                  </a>
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
  );
}
