import { Helmet } from "react-helmet-async";

export default function Support() {
  return (
    <>
      {/* Helmet for setting the page title */}
      <Helmet>
        <title>Support | Back2Me </title>
      </Helmet>

      <div className="faq-container">
        <h2 className="faq-title">Frequently Asked Questions</h2>

        <details className="faq-item">
          <summary>I can't log in. What should I do?</summary>
          <div className="faq-content">
            <p>
              Please check your email/username and password. If you forgot your
              password, use the “Forgot password” option.
            </p>
          </div>
        </details>

        <details className="faq-item">
          <summary>I forgot my password. How can I reset it?</summary>
          <div className="faq-content">
            <p>
              Click “Forgot password” on the login page and follow the
              instructions sent to your email.
            </p>
          </div>
        </details>

        <details className="faq-item">
          <summary>I didn't receive the verification email.</summary>
          <div className="faq-content">
            <p>
              Please check your Spam/Junk folder. If it's still not there, try
              resending the email.
            </p>
          </div>
        </details>

        <details className="faq-item">
          <summary>Why am I logged out automatically?</summary>
          <div className="faq-content">
            <p>
              For security reasons, the system logs you out after a period of
              inactivity.
            </p>
          </div>
        </details>

        <details className="faq-item">
          <summary>Can I create an Admin account by myself?</summary>
          <div className="faq-content">
            <p>
              No. Admin accounts cannot be registered manually for security
              reasons.
            </p>
          </div>
        </details>

        <details className="faq-item">
          <summary>How can I get an Admin account?</summary>
          <div className="faq-content">
            <p>
              Please contact the website administrator. After verification, the
              Admin will create and assign the account for you.
            </p>
          </div>
        </details>

        <details className="faq-item">
          <summary>Can my account be upgraded to Admin later?</summary>
          <div className="faq-content">
            <p>
              Yes. Please contact the administrator to request a role upgrade.
            </p>
          </div>
        </details>

        <details className="faq-item">
          <summary>What does “Something went wrong” mean?</summary>
          <div className="faq-content">
            <p>
              This usually indicates a temporary system issue. Please refresh
              the page or try again later.
            </p>
          </div>
        </details>

        <details className="faq-item">
          <summary>Is my personal information safe?</summary>
          <div className="faq-content">
            <p>
              Yes. We take data security seriously and protect your information
              according to our privacy policy.
            </p>
          </div>
        </details>

        <details className="faq-item">
          <summary>How can I contact support?</summary>
          <div className="faq-content">
            <p>
              You can reach us via the Support page or use the contact
              information provided on the website.
            </p>
          </div>
        </details>
      </div>
    </>
  );
}
