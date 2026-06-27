import { lazy, Suspense, useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Sucesso from "../assets/animations/Sucesso.json";
import axiosInstance from "../api/axiosInstance";

export default function AuthenticationForgotPassword() {
  // Variables
  const images = [
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
  const initialState = images.map(() => ({ isActive: false }));

  const [selectedIndex, setSelectedIndex] = useState(initialState);
  let [isAgreeTerm, setIsAgreeTerm] = useState(false);
  let [isRequestingResetPassword, setIsRequestingResetPassword] =
    useState(false);
  let [isClickShowPasswordSignUp, setIsClickShowPasswordSignUp] =
    useState(false);
  let [isClickShowPasswordSignIn, setIsClickShowPasswordSignIn] =
    useState(false);
  let [isClickShowNewPassword, setIsClickShowNewPassword] = useState(false);
  let [isChangeImages, setIsChangeImages] = useState(false);
  let [isChangedPassword, setIsChangedPassword] = useState(false);
  let [isCheckingEmail, setIsCheckingEmail] = useState(false);
  let [isEmailVerified, setIsEmailVerified] = useState(false);
  let [isClickShowConfirmNewPassword, setIsClickShowConfirmNewPassword] =
    useState(false);
  let [isMatchPassword, setIsMatchPassword] = useState(false);
  let [msgSignIn, setMsgSignIn] = useState({
    msg: "",
    status: "",
  });
  const [searchParams] = new useSearchParams();
  let [newPassword, setNewPassword] = useState("");
  let [confirmNewPassword, setConfirmNewPassword] = useState("");
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [email, setEmail] = useState("");
  let [passwordSignUp, setPasswordSignUp] = useState("");
  let [confirmPasswordSignUp, setConfirmPasswordSignUp] = useState("");
  let [studentId, setStudentId] = useState("");
  let [studentIdOrEmailForSignIn, setStudentIdOrEmailForSignIn] = useState("");
  let [isInProcessing, setIsInProcessing] = useState(false);
  let [isTypeStudentId, setIsTypeStudentId] = useState(false);
  let [isValidStudentId, setIsValidStudentId] = useState(false);
  let [isValidPassword, setIsValidPassword] = useState(false);
  let [isExistSpecialChar, setIsExistSpecialChar] = useState(false);
  let [isExistNumber, setIsExistNumber] = useState(false);
  let [isClickSignIn, setIsClickSignIn] = useState(false);
  let [isExistUppercase, setIsExistUppercase] = useState(false);
  let [isExistLowercase, setIsExistLowercase] = useState(false);
  let [isValidLength, setIsValidLength] = useState(false);
  let [passwordSignIn, setPasswordSignIn] = useState("");
  let [isClickShowConfirmPassword, setIsClickShowConfirmPassword] =
    useState(false);

  // Functions
  // Handle close select image
  const handleCloseSelectImage = () => {
    document.getElementById("pick-image-container").style.visibility = "hidden";
    document.getElementById("pick-image-container").style.opacity = "0";
  };

  // Handle check email for reset password
  const handleSubmitCheckEmailResetPassword = async (email) => {
    setIsCheckingEmail(true);
    setIsInProcessing(true);
    try {
      const responseSignInUser = await axiosInstance.get(
        `/Users/check-email-reset-password/${email}`,
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

      // Success, then pick image
      if (responseSignInUser.status == 200) {
        // handleChangeToSelectImage(e);
        setMsgSignIn({
          msg: responseSignInUser.data.message,
          status: responseSignInUser.status,
        });
      }

      if (responseSignInUser.status == 404) {
        // handleChangeToSelectImage(e);
        setMsgSignIn({
          msg: "This email does not exist",
          status: responseSignInUser.status,
        });
      }

      if (responseSignInUser.status === 401) {
        handleCloseSelectImage();
        setMsgSignIn({
          msg: responseSignInUser.data,
          status: responseSignInUser.status,
        });
      }

      if (responseSignInUser.status === 403) {
        setMsgSignIn({
          msg: "Your account is currently disabled. Please contact admin for assistance",
          status: responseSignInUser.status,
        });
      }
    } catch (error) {
      handleCloseSelectImage();

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Server error";

        setMsgSignIn({
          msg: message,
          status: status,
        });
      } else if (error.request) {
        // If offline
        if (!navigator.onLine) {
          setMsgSignIn({
            msg: "Network error. Please check your internet connection",
            status: 0,
          });
        } else {
          // Server offline
          setMsgSignIn({
            msg: "Server is currently unavailable. Please try again later.",
            status: 503,
          });
        }
      } else {
        // Other errors
        setMsgSignIn({
          msg: "Something went wrong. Please try again",
          status: 500,
        });
      }
    } finally {
      setIsInProcessing(false);
      setIsCheckingEmail(false);
    }
  };

  // Handle confirm reset password
  const handleSubmitConfirmResetPassword = async (email) => {
    setIsRequestingResetPassword(true);

    try {
      const responseSignInUser = await axiosInstance.put(
        `/Users/confirm-reset-password/${email}/${newPassword}`,
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

      // Success, then pick image
      if (responseSignInUser.status == 200) {
        setIsChangedPassword(true);
        setMsgSignIn({
          msg: responseSignInUser.data.message,
          status: responseSignInUser.status,
        });

        document.getElementById("popup-change-image").style.display = "flex";
      }

      if (responseSignInUser.status == 404) {
        // handleChangeToSelectImage(e);
        setMsgSignIn({
          msg: "This email does not exist",
          status: responseSignInUser.status,
        });
      }

      if (responseSignInUser.status === 401) {
        handleCloseSelectImage();
        setMsgSignIn({
          msg: responseSignInUser.data,
          status: responseSignInUser.status,
        });
      }

      if (responseSignInUser.status === 403) {
        setMsgSignIn({
          msg: "Your account is currently disabled. Please contact admin for assistance",
          status: responseSignInUser.status,
        });
      }
    } catch (error) {
      handleCloseSelectImage();

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Server error";

        setMsgSignIn({
          msg: message,
          status: status,
        });
      } else if (error.request) {
        // If offline
        if (!navigator.onLine) {
          setMsgSignIn({
            msg: "Network error. Please check your internet connection",
            status: 0,
          });
        } else {
          // Server offline
          setMsgSignIn({
            msg: "Server is currently unavailable. Please try again later.",
            status: 503,
          });
        }
      } else {
        // Other errors
        setMsgSignIn({
          msg: "Something went wrong. Please try again",
          status: 500,
        });
      }
    } finally {
      setIsInProcessing(false);
      setIsCheckingEmail(false);
      setIsRequestingResetPassword(false);
    }
  };

  // Validate Sign Up inputs
  function validateSignUp() {
    if (
      firstName.trim() == "" ||
      lastName.trim() == "" ||
      email.trim() == "" ||
      studentId.trim() == "" ||
      passwordSignUp.trim() == "" ||
      confirmPasswordSignUp.trim() == "" ||
      !isMatchPassword ||
      !isAgreeTerm ||
      !isValidStudentId ||
      !isValidPassword
    ) {
      return false;
    } else {
      return true;
    }
  }

  // Validate Sign In inputs
  function validateSignIn() {
    if (studentIdOrEmailForSignIn.trim() == "" || passwordSignIn.trim() == "") {
      return false;
    } else {
      return true;
    }
  }

  // Handle verify email
  const handleVerifyEmail = async () => {
    setIsCheckingEmail(true);

    try {
      const response = await axiosInstance.get(
        `/Users/verify-email?token=${searchParams.get("token")}&isForgotPassword=true`,
        {
          // withCredentials: true,
          validateStatus: (status) =>
            status === 200 ||
            status === 401 ||
            status === 404 ||
            status === 400,
        },
      );

      if (response.status === 200) {
        setIsEmailVerified(true);
        setEmail(response.data.email);

        // window.dispatchEvent(
        //   new CustomEvent("app-error", {
        //     detail: {
        //       message: response.data,
        //       status: "success",
        //     },
        //   }),
        // );
      }

      if (response.status == 400) {
        // handleChangeToSelectImage(e);
        setMsgSignIn({
          msg: response.data.message,
          status: response.status,
        });
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
      setIsCheckingEmail(false);
    }
  };

  // Check if passwords match
  function checkPasswordMatch(password, reTypePassword) {
    // Add logic to check if passwords match
    if (password !== reTypePassword) {
      setIsMatchPassword(false);
    } else {
      setIsMatchPassword(true);
    }
  }

  // useEffect
  useEffect(() => {
    validateSignUp();
  }, [
    firstName,
    lastName,
    studentId,
    email,
    passwordSignUp,
    confirmPasswordSignUp,
    isAgreeTerm,
    isValidStudentId,
  ]);

  useEffect(() => {
    if (searchParams.get("token")) {
      handleVerifyEmail();
    }
  }, []);

  // Check student id if valid
  useEffect(() => {
    if (studentId.length == 9) {
      setIsValidStudentId(true);
    } else {
      setIsValidStudentId(false);
    }
  }, [studentId]);

  // Handle with param in url for sign in
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      const withParam = searchParams.get("with");
      if (withParam === "sign-in") {
        document
          .getElementById("form-sign-up-in-container")
          .classList.add("move-sign-up");
        document
          .getElementById("form-sign-up-in-container")
          .classList.remove("move-sign-in");
        document
          .getElementById("form-sign-up-in-container")
          .classList.remove("move-forgot-password");
        document
          .getElementById("form-sign-up-in-container")
          .classList.remove("move-cancel-forgot");
      }

      const resetPasswordParam = window.location.pathname.startsWith(
        "/authentication/reset-password",
      );
      if (resetPasswordParam) {
        document
          .getElementById("form-sign-up-in-container")
          .classList.remove("move-sign-up");
        document
          .getElementById("form-sign-up-in-container")
          .classList.remove("move-sign-in");
        document
          .getElementById("form-sign-up-in-container")
          .classList.add("move-forgot-password");
        document
          .getElementById("form-sign-up-in-container")
          .classList.remove("move-cancel-forgot");
      }
    }
  }, []);

  // Check password if valid
  useEffect(() => {
    const hasSpecial = /[@$!%*?&]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasMinLength = newPassword.length >= 12;

    // Check special
    if (hasSpecial) {
      setIsExistSpecialChar(true);
    } else {
      setIsExistSpecialChar(false);
    }

    // Check number
    if (hasNumber) {
      setIsExistNumber(true);
    } else {
      setIsExistNumber(false);
    }

    // Check uppercase
    if (hasUppercase) {
      setIsExistUppercase(true);
    } else {
      setIsExistUppercase(false);
    }

    // Check lowercase
    if (hasLowercase) {
      setIsExistLowercase(true);
    } else {
      setIsExistLowercase(false);
    }

    // Check valid length
    if (hasMinLength) {
      setIsValidLength(true);
    } else {
      setIsValidLength(false);
    }

    // Set valid password
    if (
      hasNumber &&
      hasUppercase &&
      hasLowercase &&
      hasMinLength &&
      hasSpecial
    ) {
      setIsValidPassword(true);
    } else {
      setIsValidPassword(false);
    }

    // Check Match confirm password
    checkPasswordMatch(newPassword, confirmNewPassword);
  }, [newPassword]);

  // Check password if valid
  useEffect(() => {
    const hasSpecial = /[@$!%*?&]/.test(passwordSignUp);
    const hasNumber = /\d/.test(passwordSignUp);
    const hasUppercase = /[A-Z]/.test(passwordSignUp);
    const hasLowercase = /[a-z]/.test(passwordSignUp);
    const hasMinLength = passwordSignUp.length >= 12;

    // Check special
    if (hasSpecial) {
      setIsExistSpecialChar(true);
    } else {
      setIsExistSpecialChar(false);
    }

    // Check number
    if (hasNumber) {
      setIsExistNumber(true);
    } else {
      setIsExistNumber(false);
    }

    // Check uppercase
    if (hasUppercase) {
      setIsExistUppercase(true);
    } else {
      setIsExistUppercase(false);
    }

    // Check lowercase
    if (hasLowercase) {
      setIsExistLowercase(true);
    } else {
      setIsExistLowercase(false);
    }

    // Check valid length
    if (hasMinLength) {
      setIsValidLength(true);
    } else {
      setIsValidLength(false);
    }

    // Set valid password
    if (
      hasNumber &&
      hasUppercase &&
      hasLowercase &&
      hasMinLength &&
      hasSpecial
    ) {
      setIsValidPassword(true);
    } else {
      setIsValidPassword(false);
    }

    // Check Match confirm password
    checkPasswordMatch(passwordSignUp, confirmPasswordSignUp);
  }, [passwordSignUp]);

  return (
    <>
      {/* Forgot password */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        style={{ width: "100%", paddingLeft: "23px" }}
      >
        <div className="sign-in">
          <h1 style={{ marginBottom: "20px", fontSize: "40px" }}>
            Forgot Password
          </h1>
          <p
            style={{
              marginBottom: "20px",
              color: msgSignIn.status === 200 ? "green" : "red",
            }}
          >
            {msgSignIn.msg}
          </p>
          <div className="form-control-authentication">
            <input
              type="email"
              name=""
              id="email-forgot-password"
              placeholder="Ex: demo@ex.io"
              className="form-control-input"
              required
              disabled={isEmailVerified}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <label htmlFor="email-forgot-password">Email*</label>
          </div>
          {isEmailVerified && (
            <>
              <div className="form-control-authentication">
                <input
                  type={isClickShowNewPassword ? "text" : "password"}
                  name=""
                  style={{
                    backgroundColor:
                      isRequestingResetPassword || isChangedPassword
                        ? "#f0f0f0"
                        : "#fff",
                    opacity:
                      isRequestingResetPassword || isChangedPassword ? 0.6 : 1,
                    cursor:
                      isRequestingResetPassword || isChangedPassword
                        ? "not-allowed"
                        : "auto",
                  }}
                  id="password-forgot-password"
                  className="form-control-input"
                  placeholder="Ex: Password"
                  disabled={isRequestingResetPassword || isChangedPassword}
                  required
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                />
                {isClickShowNewPassword ? (
                  <i
                    className="fa-solid fa-eye-slash"
                    style={{
                      pointerEvents: isChangedPassword ? "none" : "auto",
                    }}
                    onClick={() => {
                      setIsClickShowNewPassword(!isClickShowNewPassword);
                    }}
                  ></i>
                ) : (
                  <i
                    className="fa-solid fa-eye"
                    style={{
                      pointerEvents: isChangedPassword ? "none" : "auto",
                    }}
                    onClick={() => {
                      setIsClickShowNewPassword(!isClickShowNewPassword);
                    }}
                  ></i>
                )}
                <label
                  htmlFor="password-forgot-password"
                  style={{
                    backgroundColor:
                      isRequestingResetPassword || isChangedPassword
                        ? "#F6F6F6"
                        : "#fff",
                    opacity:
                      isRequestingResetPassword || isChangedPassword ? 1 : 0.9,
                  }}
                >
                  New Password*
                </label>
              </div>

              {/* Password Requirement */}
              {!isExistSpecialChar && (
                <div
                  className="form-control-authentication label-required-password"
                  style={{
                    marginTop: "-15px",
                    justifyContent: "left",
                    color: isExistSpecialChar ? "green" : "red",
                    fontSize: "14px",
                  }}
                >
                  <p>
                    <i className="fa-solid fa-x"></i> Has special characters
                    (@$!%*?&)
                  </p>
                </div>
              )}

              {!isExistNumber && (
                <div
                  className="form-control-authentication label-required-password"
                  style={{
                    marginTop: "-15px",
                    justifyContent: "left",
                    color: isExistNumber ? "green" : "red",
                    fontSize: "14px",
                  }}
                >
                  <p>
                    <i className="fa-solid fa-x"></i> Has number
                  </p>
                </div>
              )}

              {!isExistUppercase && (
                <div
                  className="form-control-authentication label-required-password"
                  style={{
                    marginTop: "-15px",
                    justifyContent: "left",
                    color: isExistUppercase ? "green" : "red",
                    fontSize: "14px",
                  }}
                >
                  <p>
                    <i className="fa-solid fa-x"></i> Has uppercase characters
                  </p>
                </div>
              )}

              {!isExistLowercase && (
                <div
                  className="form-control-authentication label-required-password"
                  style={{
                    marginTop: "-15px",
                    justifyContent: "left",
                    color: isExistLowercase ? "green" : "red",
                    fontSize: "14px",
                  }}
                >
                  <p>
                    <i className="fa-solid fa-x"></i> Has lowercase characters
                  </p>
                </div>
              )}

              {!isValidLength && (
                <div
                  className="form-control-authentication label-required-password"
                  style={{
                    marginTop: "-15px",
                    justifyContent: "left",
                    color: isValidLength ? "green" : "red",
                    fontSize: "14px",
                  }}
                >
                  <p>
                    <i className="fa-solid fa-x"></i> Minimum length of 12
                    characters
                  </p>
                </div>
              )}
              <div className="form-control-authentication">
                <input
                  type={isClickShowConfirmNewPassword ? "text" : "password"}
                  style={{
                    backgroundColor:
                      isRequestingResetPassword || isChangedPassword
                        ? "#f0f0f0"
                        : "#fff",
                    opacity:
                      isRequestingResetPassword || isChangedPassword ? 0.6 : 1,
                    cursor:
                      isRequestingResetPassword || isChangedPassword
                        ? "not-allowed"
                        : "auto",
                  }}
                  name=""
                  id="confirm-password-forgot-password"
                  className="form-control-input"
                  placeholder="Ex: New password"
                  required
                  disabled={isRequestingResetPassword || isChangedPassword}
                  onChange={(e) => {
                    setConfirmNewPassword(e.target.value);
                    checkPasswordMatch(newPassword, e.target.value);
                  }}
                />
                {isClickShowConfirmNewPassword ? (
                  <i
                    className="fa-solid fa-eye-slash"
                    style={{
                      pointerEvents: isChangedPassword ? "none" : "auto",
                    }}
                    onClick={() => {
                      setIsClickShowConfirmNewPassword(
                        !isClickShowConfirmNewPassword,
                      );
                    }}
                  ></i>
                ) : (
                  <i
                    className="fa-solid fa-eye"
                    style={{
                      pointerEvents: isChangedPassword ? "none" : "auto",
                    }}
                    onClick={() => {
                      setIsClickShowConfirmNewPassword(
                        !isClickShowConfirmNewPassword,
                      );
                    }}
                  ></i>
                )}
                <label
                  htmlFor="confirm-password-forgot-password"
                  style={{
                    backgroundColor:
                      isRequestingResetPassword || isChangedPassword
                        ? "#f6f6f6"
                        : "#fff",
                    opacity:
                      isRequestingResetPassword || isChangedPassword ? 0.9 : 1,
                  }}
                >
                  Confirm New Password*
                </label>
              </div>
              {confirmNewPassword.trim() !== "" && !isMatchPassword && (
                <div
                  className="form-control-authentication"
                  style={{
                    marginTop: "-15px",
                    justifyContent: "left",
                    color: "red",
                    fontSize: "14px",
                  }}
                >
                  <p>Confirm password doesn't match</p>
                </div>
              )}
            </>
          )}
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            {!isEmailVerified && (
              <button
                className="btn-authentication"
                disabled={isCheckingEmail || email.trim() === ""}
                onClick={() => {
                  handleSubmitCheckEmailResetPassword(email);
                }}
              >
                {isCheckingEmail ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <>
                    Continue <i className="fa-solid fa-arrow-right"></i>
                  </>
                )}
              </button>
            )}
            {isEmailVerified && (
              <button
                className="btn-yellow"
                disabled={
                  newPassword.trim() === "" ||
                  confirmNewPassword.trim() === "" ||
                  !isMatchPassword ||
                  !isValidPassword ||
                  isRequestingResetPassword ||
                  isChangedPassword
                }
                onClick={() => {
                  handleSubmitConfirmResetPassword(email);
                }}
              >
                {isRequestingResetPassword ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <>
                    <i className="fa-solid fa-rotate"></i> Change Password
                  </>
                )}
              </button>
            )}
          </div>
          <br />
          <p
            style={{
              color: "#5d6d7c",
              fontSize: "14px",
            }}
          >
            <span
              onClick={() => {
                document
                  .getElementById("form-sign-up-in-container")
                  .classList.remove("move-sign-up");
                document
                  .getElementById("form-sign-up-in-container")
                  .classList.remove("move-sign-in");
                document
                  .getElementById("form-sign-up-in-container")
                  .classList.remove("move-forgot-password");
                document
                  .getElementById("form-sign-up-in-container")
                  .classList.add("move-cancel-forgot");
              }}
              style={{
                color: "#072138",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              <i className="fa-solid fa-arrow-left"></i> Cancel
            </span>
          </p>
        </div>
      </form>
    </>
  );
}
