import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

export default function SetAdministratorPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const securityImages = [
    "https://img.icons8.com/papercut/120/clock.png",
    "https://img.icons8.com/dusk/64/pencil--v1.png",
    "https://img.icons8.com/color/96/smartphone.png",
    "https://img.icons8.com/fluency/96/umbrella.png",
    "https://img.icons8.com/scribby/100/headphones.png",
    "https://img.icons8.com/doodle/96/ring-front-view--v1.png",
    "https://img.icons8.com/color/96/cap.png",
    "https://img.icons8.com/plasticine/100/camera--v1.png",
    "https://img.icons8.com/color/96/wallet--v1.png",
    "https://img.icons8.com/color/96/bottle-of-water.png",
    "https://img.icons8.com/fluency/96/book--v1.png",
    "https://img.icons8.com/color/96/glasses.png",
    "https://img.icons8.com/color/96/laptop--v1.png",
    "https://img.icons8.com/color/96/keys-holder.png",
    "https://img.icons8.com/emoji/96/credit-card-emoji.png",
    "https://img.icons8.com/plasticine/100/sneakers.png",
    "https://img.icons8.com/officel/80/skateboard.png",
    "https://img.icons8.com/3d-fluency/94/usb-memory-stick.png",
  ];

  const passwordRules = useMemo(
    () => ({
      minLength: password.length >= 12,
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      matches:
        password.length > 0 &&
        confirmPassword.length > 0 &&
        password === confirmPassword,
    }),
    [password, confirmPassword],
  );

  const completedRules = [
    passwordRules.minLength,
    passwordRules.hasNumber,
    passwordRules.hasSpecial,
    passwordRules.matches,
  ].filter(Boolean).length;

  const canSubmit = completedRules === 4;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!canSubmit) return;

    setShowTwoFactorModal(true);
  };

  const handleSelectSecurityImage = (imageId) => {
    setSelectedImages((currentImages) => {
      if (currentImages.includes(imageId)) {
        return currentImages.filter((id) => id !== imageId);
      }

      if (currentImages.length >= 2) {
        return currentImages;
      }

      console.log(imageId);
      return [...currentImages, imageId];
    });
  };

  const handleCompleteSetup = () => {
    if (selectedImages.length !== 2) return;

    console.log("Password:", password);
    console.log("Selected image IDs:", selectedImages);

    /*
      Gọi API tại đây, ví dụ:

      await api.post("/administrator/complete-setup", {
        password,
        confirmPassword,
        securityImageIds: selectedImages,
      });
    */

    setShowTwoFactorModal(false);
    setIsSetupComplete(true);
  };

  return (
    <>
      <Helmet>
        <title>Set Administrator Password | Back2Me</title>
      </Helmet>

      <main className="admin-password-page">
        <section className="admin-password-card">
          <div className="admin-password-wizard">
            <div className="admin-password-wizard-header">
              <span>Administrator Account Setup</span>
              <strong>Step 1 of 2</strong>
            </div>

            <div
              className="admin-password-wizard-progress"
              role="progressbar"
              aria-label="Administrator account setup progress"
              aria-valuemin="1"
              aria-valuemax="2"
              aria-valuenow="1"
            >
              <span />
            </div>

            <div className="admin-password-wizard-labels">
              <span className="admin-password-wizard-current">
                <i className="fa-solid fa-key" /> Create Password
              </span>

              <span>
                <i className="fa-solid fa-images" /> Security Images
              </span>
            </div>
          </div>

          <div className="admin-password-badge">
            <i className="fa-solid fa-certificate" />
            <i className="fa-solid fa-check admin-password-badge-check" />
          </div>

          <h1>Set Your Administrator Password</h1>

          <p className="admin-password-description">
            Welcome to the community! Your institution has been approved. Please
            secure your account to begin managing lost and found items.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="admin-password-field">
              <div className="admin-password-input-wrapper">
                <div className="form-control-authentication">
                  <input
                    id="administrator-new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                    className="form-control-input"
                    required
                    onChange={(event) => setPassword(event.target.value)}
                  />

                  <label htmlFor="administrator-new-password">
                    New Password*
                  </label>

                  <button
                    type="button"
                    className="admin-password-eye-button"
                    aria-label={
                      showPassword ? "Hide new password" : "Show new password"
                    }
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    <i
                      className={
                        showPassword
                          ? "fa-solid fa-eye-slash"
                          : "fa-solid fa-eye"
                      }
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-password-strength-bars">
              {[0, 1, 2, 3].map((index) => (
                <span
                  key={index}
                  className={
                    index < completedRules
                      ? "admin-password-strength-active"
                      : ""
                  }
                />
              ))}
            </div>

            <div className="admin-password-rules">
              <div
                className={
                  passwordRules.minLength
                    ? "admin-password-rule admin-password-rule-valid"
                    : "admin-password-rule"
                }
              >
                <i
                  className={
                    passwordRules.minLength
                      ? "fa-solid fa-circle-check"
                      : "fa-regular fa-circle"
                  }
                />

                <span>At least 12 characters</span>
              </div>

              <div
                className={
                  passwordRules.hasNumber
                    ? "admin-password-rule admin-password-rule-valid"
                    : "admin-password-rule"
                }
              >
                <i
                  className={
                    passwordRules.hasNumber
                      ? "fa-solid fa-circle-check"
                      : "fa-regular fa-circle"
                  }
                />

                <span>One number (0-9)</span>
              </div>

              <div
                className={
                  passwordRules.hasSpecial
                    ? "admin-password-rule admin-password-rule-valid"
                    : "admin-password-rule"
                }
              >
                <i
                  className={
                    passwordRules.hasSpecial
                      ? "fa-solid fa-circle-check"
                      : "fa-regular fa-circle"
                  }
                />

                <span>One special character</span>
              </div>

              <div
                className={
                  passwordRules.matches
                    ? "admin-password-rule admin-password-rule-valid"
                    : "admin-password-rule"
                }
              >
                <i
                  className={
                    passwordRules.matches
                      ? "fa-solid fa-circle-check"
                      : "fa-regular fa-circle"
                  }
                />

                <span>Passwords must match</span>
              </div>
            </div>

            <div className="admin-password-field admin-password-confirm-field">
              <div className="admin-password-input-wrapper">
                <div className="form-control-authentication">
                  <input
                    id="administrator-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="form-control-input"
                    required
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />

                  <label htmlFor="administrator-confirm-password">
                    Confirm Password*
                  </label>

                  <button
                    type="button"
                    className="admin-password-eye-button"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirmed password"
                        : "Show confirmed password"
                    }
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                  >
                    <i
                      className={
                        showConfirmPassword
                          ? "fa-solid fa-eye-slash"
                          : "fa-solid fa-eye"
                      }
                    />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="admin-password-submit btn"
              disabled={!canSubmit}
            >
              <i className="fa-solid fa-key" />
              Create Password
            </button>
          </form>

          {isSetupComplete && (
            <div className="admin-password-success-message">
              <i className="fa-solid fa-circle-check" />

              <div>
                <strong>Account setup complete</strong>

                <span>
                  Your password and two-factor security images have been saved.
                </span>
              </div>
            </div>
          )}

          <p className="admin-password-support">
            Need help? <a href="/support">Contact Support</a>
          </p>
        </section>
      </main>

      {showTwoFactorModal && (
        <div
          className="two-factor-images-overlay"
          onMouseDown={() => setShowTwoFactorModal(false)}
        >
          <section
            className="two-factor-images-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="two-factor-images-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="two-factor-images-close"
              aria-label="Close security image setup"
              onClick={() => setShowTwoFactorModal(false)}
            >
              <i className="fa-solid fa-xmark" />
            </button>

            <div className="two-factor-images-wizard">
              <div className="two-factor-images-wizard-header">
                <span>Administrator Account Setup</span>
                <strong>Step 2 of 2</strong>
              </div>

              <div
                className="two-factor-images-wizard-progress"
                role="progressbar"
                aria-label="Administrator account setup progress"
                aria-valuemin="1"
                aria-valuemax="2"
                aria-valuenow="2"
              >
                <span />
              </div>

              <div className="two-factor-images-wizard-labels">
                <span className="two-factor-images-completed-step">
                  <i className="fa-solid fa-circle-check" />
                  Password Created
                </span>

                <span className="two-factor-images-active-step">
                  <i className="fa-solid fa-images" />
                  Security Images
                </span>
              </div>
            </div>

            <div className="two-factor-images-heading-icon">
              <i className="fa-solid fa-shield-halved" />
            </div>

            <h2 id="two-factor-images-title">Choose Your Security Images</h2>

            <p className="two-factor-images-description">
              Select exactly two images that you will recognize during future
              administrator logins.
            </p>

            <div className="two-factor-images-selection-status">
              <span>{selectedImages.length} of 2 selected</span>

              <div>
                <span
                  className={
                    selectedImages.length >= 1
                      ? "two-factor-images-selection-dot-active"
                      : ""
                  }
                />

                <span
                  className={
                    selectedImages.length === 2
                      ? "two-factor-images-selection-dot-active"
                      : ""
                  }
                />
              </div>
            </div>

            <div className="two-factor-images-grid">
              {securityImages.map((src, index) => {
                const isSelected = selectedImages.includes(index);

                const selectionOrder = selectedImages.indexOf(index) + 1;

                return (
                  <button
                    key={index}
                    type="button"
                    className={
                      isSelected
                        ? "two-factor-images-card two-factor-images-card-selected"
                        : "two-factor-images-card"
                    }
                    aria-pressed={isSelected}
                    onClick={() => handleSelectSecurityImage(index)}
                  >
                    <img src={src} alt={src} loading="lazy" />

                    {isSelected && (
                      <span className="two-factor-images-card-order">
                        {selectionOrder}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="two-factor-images-security-note">
              <i className="fa-solid fa-lock" />

              <span>
                These images provide an additional visual verification step when
                you sign in.
              </span>
            </p>

            <div className="two-factor-images-actions">
              <button
                type="button"
                className="btn-with-border"
                onClick={() => setShowTwoFactorModal(false)}
              >
                <i className="fa-solid fa-arrow-left" /> Back
              </button>

              <button
                type="button"
                className="btn"
                disabled={selectedImages.length !== 2}
                onClick={handleCompleteSetup}
              >
                Complete Account Setup <i className="fa-solid fa-user-check" />
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
