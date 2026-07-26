import { useState } from "react";

export default function DeclineRequestModal({ onClose }) {
  const [rejectionReason, setRejectionReason] = useState("");

  const handleConfirmDecline = () => {
    if (!rejectionReason.trim()) return;

    console.log(rejectionReason);

    // Gọi API

    onClose();
  };
  return (
    <div className="decline-request-overlay" onMouseDown={onClose}>
      <section
        className="decline-request-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="decline-request-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="decline-request-red-line" />

        <button
          type="button"
          className="decline-request-close"
          aria-label="Close decline request modal"
          onClick={onClose}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="decline-request-heading">
          <div className="decline-request-icon">
            <i className="fa-solid fa-ban" />
          </div>

          <h2 id="decline-request-title">Decline Institution Request</h2>
        </div>

        <p className="decline-request-description">
          Please provide a detailed reason for declining this application. This
          information will be shared with the institution representative to help
          them understand the decision.
        </p>

        <label
          className="decline-request-label"
          htmlFor="decline-request-reason"
        >
          Rejection Reason
        </label>

        <textarea
          id="decline-request-reason"
          className="decline-request-textarea"
          value={rejectionReason}
          placeholder="Enter the reason for declining this application (e.g., invalid school credentials, unauthorized contact person)"
          onChange={(event) => setRejectionReason(event.target.value)}
        />

        <div className="decline-request-actions">
          <button className="decline-request-cancel" onClick={onClose}>
            Cancel
          </button>

          <button
            type="button"
            className="btn decline-request-confirm"
            disabled={!rejectionReason.trim()}
            onClick={handleConfirmDecline}
          >
            Confirm Decline
          </button>
        </div>
      </section>
    </div>
  );
}
