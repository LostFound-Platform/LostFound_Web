export default function ApplicationSuccess() {
  return (
    <main className="application-success-page">
      <section className="application-success-hero">
        <div className="application-success-main-icon">
          <i className="fa-solid fa-circle-check"></i>
        </div>

        <p className="application-success-kicker">Application Received!</p>

        <p className="application-success-message">
          Thank you for helping us bring <strong>Back2Me</strong> to your
          campus. You’re
          <br />
          one step closer to reuniting students with their lost essentials.
        </p>
      </section>

      <section className="application-success-steps">
        <article className="application-success-step-card">
          <span className="application-success-step-number">1</span>

          <div className="application-success-step-icon application-success-step-icon-yellow">
            <i className="fa-solid fa-envelope"></i>
          </div>

          <h2>Email Verification</h2>

          <p>
            Check your inbox for a confirmation link. We've sent a secure URL to
            the administrative address you provided.
          </p>
        </article>

        <article className="application-success-step-card">
          <span className="application-success-step-number">2</span>

          <div className="application-success-step-icon application-success-step-icon-peach">
            <i className="fa-solid fa-file-lines"></i>
          </div>

          <h2>Review Process</h2>

          <p>
            Our verification team will review your institution’s credentials.
            This typically takes 1–2 business days.
          </p>
        </article>

        <article className="application-success-step-card">
          <span className="application-success-step-number">3</span>

          <div className="application-success-step-icon application-success-step-icon-blue">
            <i className="fa-solid fa-key"></i>
          </div>

          <h2>Activation</h2>

          <p>
            Once approved, you’ll receive your official admin credentials and a
            toolkit to launch on campus.
          </p>
        </article>
      </section>

      <section className="application-success-help-card">
        <div className="application-success-help-image">
          <img
            src="/application-success-campus.jpg"
            alt="Students celebrating together on campus"
          />
        </div>

        <div className="application-success-help-content">
          <span>Need Help?</span>

          <p>
            While our team processes your application, feel free to explore our
            implementation guides or reach out to our campus success
            specialists.
          </p>

          <a href="/help">
            Visit Help Center
            <i className="fa-solid fa-arrow-right-long"></i>
          </a>
        </div>
      </section>

      <div className="application-success-actions">
        <a
          href="/"
          className="application-success-button application-success-button-primary btn"
        >
          Back to Home
        </a>

        <a
          href="/dashboard"
          className="application-success-button application-success-button-outline"
        >
          View My Dashboard
        </a>
      </div>
    </main>
  );
}
