import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const benefits = [
  [
    "fa-solid fa-briefcase",
    "Real-world experience",
    "Work on a platform used by real students.",
  ],
  [
    "fa-solid fa-folder-open",
    "Build your portfolio",
    "Contributions may be featured on GitHub, project documentation, and contributor records.",
  ],
  [
    "fa-solid fa-users",
    "Learn from collaboration",
    "Gain experience working with contributors across product, engineering, testing, and operations.",
  ],
  [
    "fa-solid fa-face-grin-stars",
    "Make an impact",
    "Help improve student life on campus.",
  ],
];

const roles = [
  [
    "Engineering",
    "Frontend Contributor",
    "React, UI improvements, Accessibility",
    "fa-solid fa-code",
  ],
  [
    "Engineering",
    "Backend Contributor",
    "APIs, Databases, Business logic",
    "fa-solid fa-database",
  ],
  [
    "Quality",
    "QA Contributor",
    "Testing, Bug reporting, User validation",
    "fa-solid fa-list-check",
  ],
  [
    "Management",
    "Product & Operations",
    "Documentation, User feedback, Process improvement",
    "fa-solid fa-file-lines",
  ],
  [
    "Communication",
    "Outreach Contributor",
    "Events, Communication, Campus awareness",
    "fa-solid fa-bullhorn",
  ],
];

const steps = [
  ["fa-solid fa-pen", "Interest Form"],
  ["fa-solid fa-comments", "Conversation"],
  ["fa-solid fa-clipboard-check", "Trial Task"],
  ["fa-solid fa-user-check", "Contributor"],
  ["fa-solid fa-crown", "Lead"],
];

export default function JoinUs() {
  useEffect(() => {
    if (window.location.href.includes("join")) {
      document.getElementById("wrapper").style.width = "100%";
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Join Us | Back2Me </title>
      </Helmet>

      <main className="join-page">
        <section className="hero">
          <div className="corner corner-top" />
          <div className="corner corner-left" />

          <span className="pill">OPPORTUNITY</span>
          <h1>Join the Team</h1>
          <p>
            Help build a platform that makes it easier for students to report,
            discover, and recover lost items on campus.
          </p>
          <a
            href="https://forms.gle/zQUMNSTb1r4EqVTa8"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            Submit Interest Form{" "}
            <i className="fa-solid fa-up-right-from-square"></i>
          </a>
        </section>

        <section className="about section">
          <div className="about-text">
            <h2>What is Campus Lost & Found?</h2>
            <p>
              Campus Lost & Found is a student-led platform being developed to
              improve how lost and found items are reported, discovered, and
              recovered on campus.
            </p>
            <p>
              The project is currently being piloted at Gwinnett Technical
              College and is supported by student contributors across technical
              and non-technical roles.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900"
            alt="Campus Lost and Found dashboard"
          />
        </section>

        <section className="why">
          <div className="section">
            <h2>Why Join?</h2>
            <div className="benefit-grid">
              {benefits.map(([icon, title, text]) => (
                <div className="benefit-card" key={title}>
                  <div className="icon">
                    <i className={icon}></i>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="roles section">
          <h2>Open Roles</h2>
          <p className="intro">
            We value curiosity, reliability, and a willingness to learn. Prior
            experience is helpful but not required for every role. Students from
            all majors are welcome to apply.
          </p>

          <div className="role-grid">
            {roles.map(([tag, title, text, symbol]) => (
              <div className="role-card" key={title}>
                <div className="role-top">
                  <span>{tag}</span>
                  <b>
                    <i className={symbol}></i>
                  </b>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <a
                  href="https://forms.gle/zQUMNSTb1r4EqVTa8"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply Now <i className="fa-solid fa-arrow-right-long"></i>
                </a>
              </div>
            ))}

            <div className="contact-card">
              <h3>Don't see a fit?</h3>
              <p>We're always looking for talented students. Reach out!</p>
              <button className="btn">Contact Us</button>
            </div>
          </div>
        </section>

        <section className="path">
          <div className="section">
            <h2>Contributor Path</h2>
            <div className="timeline">
              {steps.map(([icon, label], index) => (
                <div
                  className={`step ${index === 4 ? "active" : ""}`}
                  key={label}
                >
                  <div>
                    <i className={icon}></i>
                  </div>
                  <p>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="faq section">
          <h2>Frequently Asked Questions</h2>

          <details className="faq-item" open>
            <summary>Is this a paid position?</summary>
            <div className="faq-content">
              <p>
                No. This is currently a volunteer contributor program focused on
                skill development and community building.
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Do I need prior experience?</summary>
            <div className="faq-content">
              <p>No. Reliability and willingness to learn matter most.</p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Can I contribute remotely?</summary>
            <div className="faq-content">
              <p>Some roles may be remote, depending on the task.</p>
            </div>
          </details>

          <details className="faq-item">
            <summary>How much time is expected?</summary>
            <div className="faq-content">
              <p>Usually a few focused hours per week.</p>
            </div>
          </details>
        </section>

        <section className="interested-cta">
          <h2>Interested? Help us build something meaningful for students.</h2>
          <a
            href="https://forms.gle/zQUMNSTb1r4EqVTa8"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            Submit Interest Form{" "}
            <i className="fa-solid fa-up-right-from-square"></i>
          </a>
        </section>
      </main>
    </>
  );
}
