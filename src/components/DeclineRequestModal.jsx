import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function DeclineRequestModal({ id, onClose }) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isDeclining, setIsDeclining] = useState(false);

  // Handle Decline Institution
  const handleDeclineInstitution = async () => {
    if (!rejectionReason.trim()) return;

    setIsDeclining(true);

    try {
      const response = await axiosInstance.post(
        `/InstitutionRequest/decline/${id}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
          },
          // withCredentials: true,
          validateStatus: (status) =>
            status === 200 ||
            status === 401 ||
            status === 404 ||
            status === 403,
        },
      );

      if (response.status === 200) {
        setInstitution((prev) => ({
          ...prev,
          status: "Approved",
        }));
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
      onClose();
      setIsDeclining(false);
    }
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
            onClick={handleDeclineInstitution}
          >
            Confirm Decline
          </button>
        </div>
      </section>
    </div>
  );
}
