import { lazy, Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import axiosInstance from "../api/axiosInstance";
import { useSearchParams } from "react-router-dom";
// const Lottie = lazy(() => import("lottie-react"));
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Sucesso from "../assets/animations/Sucesso.json";

export default function Authentication() {
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
  // Handle form submission for Sign Up
  const handleSubmitSignUp = async (e) => {
    e.preventDefault();

    setIsInProcessing(true);

    // Two image is picked
    const pickedIndexes = selectedIndex
      .map((item, i) => (item.isActive ? i : null))
      .filter((i) => i !== null);
    const imagePicked1 = pickedIndexes[0];
    const imagePicked2 = pickedIndexes[1];

    try {
      const payload = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        studentId: Number(studentId),
        password: confirmPasswordSignUp,
        pickImage1: imagePicked1.toString(),
        pickImage2: imagePicked2.toString(),
        isAgreedToTerms: isAgreeTerm,
        role: "Student",
      };

      const response = await axiosInstance.post("/Users/sign-up", payload, {
        headers: {
          "Content-Type": "application/json",
        },
        // withCredentials: true,
        validateStatus: (status) => status === 200 || status === 401,
      });

      // Success
      if (response.status == 200) {
        sessionStorage.removeItem("requiredSignIn");

        // Set token
        localStorage.setItem("accessToken", response.data.accessToken);

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: response.data?.message,
              status: "success",
            },
          }),
        );

        setMsgSignIn({
          msg: "Signed up successfully",
          status: response.status,
        });

        window.location.href = "/";
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
    }
  };

  const handleChangeToSelectImage = (e) => {
    e.preventDefault();

    const isValidSignUp = validateSignUp();
    const isValidSignIn = validateSignIn();

    if (isValidSignUp || isValidSignIn) {
      document.getElementById("pick-image-container").style.visibility =
        "visible";
      document.getElementById("pick-image-container").style.opacity = "1";
    }
  };

  const handleCloseSelectImage = () => {
    document.getElementById("pick-image-container").style.visibility = "hidden";
    document.getElementById("pick-image-container").style.opacity = "0";
  };

  // Handle form submission for Sign In
  const handleSubmitSignIn = async (e) => {
    e.preventDefault();

    setIsInProcessing(true);
    try {
      const responseSignInUser = await axiosInstance.post(
        `/Users/sign-in`,
        {
          studentId: studentIdOrEmailForSignIn.includes("@")
            ? 0
            : studentIdOrEmailForSignIn,
          password: passwordSignIn,
          email: studentIdOrEmailForSignIn,
        },
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
        handleChangeToSelectImage(e);

        setMsgSignIn({
          msg: responseSignInUser.data,
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

      setIsInProcessing(false);
    } catch (error) {
      setIsInProcessing(false);
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
    }
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

  // Handle confirm reset images
  const handleSubmitConfirmResetImages = async () => {
    setIsRequestingResetPassword(true);
    setIsInProcessing(true);

    // Two image is picked
    const pickedIndexes = selectedIndex
      .map((item, i) => (item.isActive ? i : null))
      .filter((i) => i !== null);
    const imagePicked1 = pickedIndexes[0];
    const imagePicked2 = pickedIndexes[1];
    console.log(
      `/Users/confirm-reset-images/${email}/${imagePicked1}/${imagePicked2}`,
    );
    try {
      const responseSignInUser = await axiosInstance.put(
        `/Users/confirm-reset-images/${email}/${imagePicked1}/${imagePicked2}`,
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
        setIsChangeImages(false);
        setMsgSignIn({
          msg: responseSignInUser.data.message,
          status: responseSignInUser.status,
        });

        // Hide modal select images
        document.getElementById("pick-image-container").style.visibility =
          "hidden";
        document.getElementById("pick-image-container").style.opacity = "0";

        // Move to sign in
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

  const handleSubmitImageChose = async (e) => {
    e.preventDefault();

    setIsInProcessing(true);

    // Two image is picked
    const pickedIndexes = selectedIndex
      .map((item, i) => (item.isActive ? i : null))
      .filter((i) => i !== null);

    try {
      const responseSignInUser = await axiosInstance.post(
        `/Users/select-images`,
        {
          studentId: studentIdOrEmailForSignIn.includes("@")
            ? 0
            : studentIdOrEmailForSignIn.trim(),
          password: passwordSignIn,
          email: studentIdOrEmailForSignIn.trim(),
          pickedIndexes: pickedIndexes,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          // // withCredentials: true,
          validateStatus: (status) =>
            status === 200 || status === 401 || status === 404,
        },
      );

      // Success, then pick image
      if (responseSignInUser.status == 200) {
        handleChangeToSelectImage(e);
        sessionStorage.removeItem("requiredSignIn");

        // Set token
        localStorage.setItem(
          "accessToken",
          responseSignInUser.data.accessToken,
        );

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: responseSignInUser.data?.message,
              status: "success",
            },
          }),
        );

        setMsgSignIn({
          msg: "Signed in successfully",
          status: responseSignInUser.status,
        });

        window.location.href = "/";
      }

      if (responseSignInUser.status === 401) {
        handleCloseSelectImage();
        setMsgSignIn({
          msg: responseSignInUser.data,
          status: responseSignInUser.status,
        });
      }

      setIsInProcessing(false);
    } catch (error) {
      setIsInProcessing(false);
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
    }
  };

  // Select image function
  const handleSelectImage = (index) => {
    const activeCount = selectedIndex.filter((x) => x.isActive).length;

    setSelectedIndex((prev) =>
      prev.map((item, i) => {
        // If click that icon
        if (i === index) {
          // If that icon is active so remove active it
          if (item.isActive) return { isActive: false };

          // If that icon is not active and total active is < 2 so add active it
          if (activeCount < 2) return { isActive: true };

          // If reach 2 so don't change
          return item;
        }

        return item;
      }),
    );
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
      {/* Helmet for setting the page title */}
      <Helmet>
        <title>Authentication | Back2Me </title>
      </Helmet>

      <div className="authentication-container">
        <div className="form-box">
          {sessionStorage.getItem("requiredSignIn") && (
            <h1
              style={{
                backgroundColor: "red",
                color: "#fff", // chữ tối
                border: "1px solid #f5c6cb",
                padding: "10px 20px",
                borderRadius: "10px",
                fontSize: "18px",
                fontWeight: "bold",
                maxWidth: "400px",
                margin: "20px auto",
              }}
            >
              {sessionStorage.getItem("requiredSignIn")}
            </h1>
          )}
          <div
            className="form-sign-up-in-container"
            id="form-sign-up-in-container"
          >
            {/* Sign Up */}
            <form
              onSubmit={handleChangeToSelectImage}
              style={{ width: "100%" }}
            >
              <div className="sign-up">
                <h1 style={{ marginBottom: "20px", fontSize: "40px" }}>
                  Sign Up
                </h1>
                <p
                  style={{
                    marginBottom: "20px",
                    color: msgSignIn.status === 200 ? "green" : "red",
                  }}
                >
                  {msgSignIn.msg}
                </p>
                <div
                  style={{ display: "flex", gap: "20px" }}
                  className="form-sign-up-last-first"
                >
                  <div className="form-control-authentication">
                    <input
                      type="text"
                      name=""
                      id="first-name"
                      placeholder="Ex: Jason"
                      className="form-control-input"
                      autoFocus
                      required
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}
                    />
                    <label htmlFor="first-name">First Name*</label>
                  </div>
                  <div className="form-control-authentication">
                    <input
                      type="text"
                      name=""
                      id="last-name"
                      placeholder="Ex: PG"
                      className="form-control-input"
                      required
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                    />
                    <label htmlFor="last-name">Last Name*</label>
                  </div>
                </div>
                <div className="form-control-authentication">
                  <input
                    type="text"
                    name=""
                    id="student-id-sign-up"
                    placeholder="Ex: 202434567"
                    className="form-control-input"
                    required
                    onChange={(e) => {
                      setStudentId(e.target.value);
                      setIsTypeStudentId(true);
                    }}
                    onInput={(e) => {
                      e.target.value = e.target.value
                        .replace(/[^0-9]/g, "") // Remove non-numeric characters
                        .slice(0, 9); // Allow only numbers, max length 9
                    }}
                  />
                  <label htmlFor="student-id-sign-up">Student ID*</label>
                </div>
                {studentId.trim() !== "" &&
                  isTypeStudentId &&
                  studentId.length < 9 && (
                    <div
                      className="form-control-authentication"
                      style={{
                        marginTop: "-15px",
                        justifyContent: "left",
                        color: "red",
                        fontSize: "14px",
                      }}
                    >
                      <p>Student ID must be 9 digits long</p>
                    </div>
                  )}
                <div className="form-control-authentication">
                  <input
                    type="email"
                    name=""
                    id="email"
                    placeholder="Ex: demo@ex.io"
                    className="form-control-input"
                    required
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <label htmlFor="email">Email*</label>
                </div>
                <div className="form-control-authentication">
                  <input
                    type={isClickShowPasswordSignUp ? "text" : "password"}
                    name=""
                    id="password"
                    className="form-control-input"
                    placeholder="Ex: Here is password"
                    required
                    onChange={(e) => {
                      setPasswordSignUp(e.target.value);
                    }}
                  />
                  {isClickShowPasswordSignUp ? (
                    <i
                      className="fa-solid fa-eye-slash"
                      onClick={() => {
                        setIsClickShowPasswordSignUp(
                          !isClickShowPasswordSignUp,
                        );
                      }}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-eye"
                      onClick={() => {
                        setIsClickShowPasswordSignUp(
                          !isClickShowPasswordSignUp,
                        );
                      }}
                    ></i>
                  )}
                  <label htmlFor="password">Password*</label>
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
                    type={isClickShowConfirmPassword ? "text" : "password"}
                    name=""
                    id="confirm-password"
                    className="form-control-input"
                    placeholder="Ex: Here is password"
                    required
                    onChange={(e) => {
                      setConfirmPasswordSignUp(e.target.value); // Used to set real password value
                      checkPasswordMatch(passwordSignUp, e.target.value);
                    }}
                  />
                  {isClickShowConfirmPassword ? (
                    <i
                      className="fa-solid fa-eye-slash"
                      onClick={() => {
                        setIsClickShowConfirmPassword(
                          !isClickShowConfirmPassword,
                        );
                      }}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-eye"
                      onClick={() => {
                        setIsClickShowConfirmPassword(
                          !isClickShowConfirmPassword,
                        );
                      }}
                    ></i>
                  )}
                  <label htmlFor="confirm-password">Confirm Password*</label>
                </div>
                {confirmPasswordSignUp.trim() !== "" && !isMatchPassword && (
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

                {/* Agree Term */}
                <div className="agree-container">
                  <label className="agree-box">
                    <span className="text">
                      Click
                      <a
                        href="#policyModal"
                        onClick={(e) => {
                          e.preventDefault();

                          document.getElementById("policyModal").style.display =
                            "flex";
                          document.body.style.overflow = "hidden";
                        }}
                        aria-label="Terms and Recovery Guide link"
                      >
                        {" "}
                        "Terms & Recovery Guide"
                      </a>{" "}
                      to read and agree
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  aria-label="Sign up button"
                  className="btn-authentication"
                  disabled={!validateSignUp()}
                  onClick={() => {
                    setIsClickSignIn(false);
                  }}
                >
                  <i className="fa-solid fa-user-plus"></i> Sign Up
                </button>
                <p style={{ color: "#5d6d7c", fontSize: "14px" }}>
                  Already have an account?{" "}
                  <span
                    onClick={() => {
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
                    }}
                    style={{
                      color: "#072138",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Sign In
                  </span>
                </p>
              </div>
            </form>

            {/* Sign In */}
            <form
              onSubmit={handleSubmitSignIn}
              style={{ width: "100%", paddingLeft: "10px" }}
            >
              <div className="sign-in">
                <h1 style={{ marginBottom: "20px", fontSize: "40px" }}>
                  Sign In
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
                    type={
                      /\D/.test(studentIdOrEmailForSignIn) ? "email" : "text"
                    }
                    name=""
                    id="student-id"
                    placeholder="Ex: 202434567"
                    className="form-control-input"
                    required
                    onChange={(e) => {
                      setStudentIdOrEmailForSignIn(e.target.value);
                    }}
                    onInput={(e) => {
                      const value = e.target.value;

                      if (/^\d*$/.test(value)) {
                        e.target.value = value.slice(0, 9);
                      } else {
                        e.target.value = value;
                      }
                    }}
                  />
                  <label htmlFor="student-id">Student ID or Email*</label>
                </div>
                <div className="form-control-authentication">
                  <input
                    type={isClickShowPasswordSignIn ? "text" : "password"}
                    name=""
                    id="password-sign-in"
                    className="form-control-input"
                    placeholder="Ex: Here is password"
                    required
                    onChange={(e) => {
                      setPasswordSignIn(e.target.value);
                    }}
                  />
                  {isClickShowPasswordSignIn ? (
                    <i
                      className="fa-solid fa-eye-slash"
                      onClick={() => {
                        setIsClickShowPasswordSignIn(
                          !isClickShowPasswordSignIn,
                        );
                      }}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-eye"
                      onClick={() => {
                        setIsClickShowPasswordSignIn(
                          !isClickShowPasswordSignIn,
                        );
                      }}
                    ></i>
                  )}
                  <label htmlFor="password-sign-in">Password*</label>
                </div>
                <div className="form-control-authentication">
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
                        .classList.add("move-forgot-password");
                      document
                        .getElementById("form-sign-up-in-container")
                        .classList.remove("move-cancel-forgot");
                    }}
                    style={{
                      color: "#5d6d7c",
                      fontSize: "14px",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Forgot password?
                  </span>
                </div>
                <button
                  aria-label="Sign in button"
                  className="btn-authentication"
                  disabled={!validateSignIn() || isInProcessing}
                  onClick={() => {
                    setIsClickSignIn(true);
                  }}
                >
                  {isInProcessing ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <>
                      <i className="fa-solid fa-arrow-right-to-bracket"></i>{" "}
                      Sign In
                    </>
                  )}
                </button>
                <br />
                <p
                  style={{
                    color: "#5d6d7c",
                    fontSize: "14px",
                  }}
                >
                  No account?{" "}
                  <span
                    onClick={() => {
                      document
                        .getElementById("form-sign-up-in-container")
                        .classList.remove("move-sign-up");
                      document
                        .getElementById("form-sign-up-in-container")
                        .classList.add("move-sign-in");
                      document
                        .getElementById("form-sign-up-in-container")
                        .classList.remove("move-forgot-password");
                      document
                        .getElementById("form-sign-up-in-container")
                        .classList.remove("move-cancel-forgot");
                    }}
                    style={{
                      color: "#072138",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Sign Up
                  </span>
                </p>
              </div>
            </form>

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
                            isRequestingResetPassword || isChangedPassword
                              ? 0.6
                              : 1,
                          cursor:
                            isRequestingResetPassword || isChangedPassword
                              ? "not-allowed"
                              : "auto",
                        }}
                        id="password-forgot-password"
                        className="form-control-input"
                        placeholder="Ex: Password"
                        disabled={
                          isRequestingResetPassword || isChangedPassword
                        }
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
                            isRequestingResetPassword || isChangedPassword
                              ? 1
                              : 0.9,
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
                          <i className="fa-solid fa-x"></i> Has special
                          characters (@$!%*?&)
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
                          <i className="fa-solid fa-x"></i> Has uppercase
                          characters
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
                          <i className="fa-solid fa-x"></i> Has lowercase
                          characters
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
                        type={
                          isClickShowConfirmNewPassword ? "text" : "password"
                        }
                        style={{
                          backgroundColor:
                            isRequestingResetPassword || isChangedPassword
                              ? "#f0f0f0"
                              : "#fff",
                          opacity:
                            isRequestingResetPassword || isChangedPassword
                              ? 0.6
                              : 1,
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
                        disabled={
                          isRequestingResetPassword || isChangedPassword
                        }
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
                            isRequestingResetPassword || isChangedPassword
                              ? 0.9
                              : 1,
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
          </div>
        </div>
        <div className="img-right">
          <img src="../Image/logo-2.png" alt="picture" loading="lazy" />
        </div>
      </div>

      {/* Modal Policy */}
      <div id="policyModal" className="modal">
        <div className="modal-content">
          <h2>Terms & Recovery Guide</h2>

          <div className="policy-section">
            <h3>Users agree NOT to:</h3>
            <ul>
              <li>Use the website for any unlawful purpose.</li>
              <li>
                Disrupt, interfere with, or attempt unauthorized access to the
                website or its systems.
              </li>
              <li>
                Upload or share content that is false, offensive, violates
                privacy, or infringes copyrights.
              </li>
              <li>
                Provide inaccurate information when creating an account (if
                applicable).
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h3>We reserve the right to:</h3>
            <ul>
              <li>
                Suspend, terminate, or limit your access if any violation is
                detected.
              </li>
              <li>
                Modify or temporarily disable any part of the website without
                prior notice.
              </li>
              <li>
                Collect and use user information as described in our Privacy
                Policy.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h3>For individuals seeking to reclaim lost items:</h3>
            <ul>
              <li>
                You <strong>MUST</strong> provide a detailed description of the
                lost item for verification with the holder.
              </li>
              <li>
                You are <strong>REQUIRED</strong> to create a post in order to
                receive a verification code.
              </li>
              <li>
                The post <strong>MUST</strong> include a complete and accurate
                description of the lost item.
              </li>
              <li>
                Users are responsible for regularly checking their post on the
                website for updates.
              </li>
              <li>
                You <strong>MUST</strong> present the verification code when
                retrieving your item.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h3>For individuals holding found items:</h3>
            <ul>
              <li>
                You are <strong>RESPONSIBLE</strong> for verifying the
                claimant's verification code and item description to ensure they
                match the item in your possession.
              </li>
              <li>
                You are <strong>RESPONSIBLE</strong> for creating a post to
                assist in returning the item to its rightful owner.
              </li>
            </ul>
          </div>

          <a
            className="close"
            href="#"
            onClick={(e) => {
              e.preventDefault();

              document.getElementById("policyModal").style.display = "none";
              document.body.style.overflow = "auto";

              validateSignUp();
              setIsAgreeTerm(true);
            }}
            aria-label="Close terms and recovery guide modal link"
          >
            I got it
          </a>
        </div>
      </div>

      {/* Modal pick image */}
      <div className="pick-image-container" id="pick-image-container">
        <div className="content-images">
          <p style={{ fontSize: "30px", fontWeight: "600" }}>
            {isClickSignIn ? "Select" : isChangeImages ? "Select" : "Register"}{" "}
            two {isChangeImages && "new"} pictures of you:
          </p>
          <p
            style={{
              fontSize: "16px",
              color: "#555",
              fontStyle: "italic",
              marginTop: "4px",
            }}
          >
            (For security reasons, please do not share your selected images)
          </p>
          <div className="images">
            {images.map((src, index) => {
              return (
                <img
                  key={index}
                  src={src}
                  alt={`image-${index}`}
                  width="64"
                  className={selectedIndex[index].isActive ? "active" : ""}
                  loading="lazy"
                  onClick={() => {
                    handleSelectImage(index);
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Accept btn and cancel btn */}
        <div className="btn-continue-container">
          <button
            aria-label={
              isClickSignIn
                ? "Submit sign in images button"
                : "Submit sign up images button"
            }
            className="btn"
            style={{
              backgroundColor:
                selectedIndex.filter((s) => s.isActive).length === 2 &&
                !isInProcessing
                  ? "#ec7207"
                  : "#d3d3d3",
              color:
                selectedIndex.filter((s) => s.isActive).length === 2 &&
                !isInProcessing
                  ? "#fff"
                  : "#8c8c8c",
              cursor:
                selectedIndex.filter((s) => s.isActive).length === 2 &&
                !isInProcessing
                  ? "pointer"
                  : "not-allowed",
              pointerEvents:
                selectedIndex.filter((s) => s.isActive).length === 2 &&
                !isInProcessing
                  ? "auto"
                  : "none",
              opacity:
                selectedIndex.filter((s) => s.isActive).length === 2 &&
                !isInProcessing
                  ? 1
                  : 0.6,
            }}
            disabled={
              (selectedIndex.filter((s) => s.isActive).length == 2
                ? false
                : true) && !isInProcessing
            }
            onClick={
              isClickSignIn
                ? handleSubmitImageChose
                : isChangeImages
                  ? handleSubmitConfirmResetImages
                  : handleSubmitSignUp
            }
          >
            {isInProcessing ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <>
                {isClickSignIn
                  ? "Sign In Account"
                  : isChangeImages
                    ? "Change images"
                    : "Sign Up Account"}{" "}
                <i className="fa-solid fa-arrow-right"></i>
              </>
            )}
          </button>
          <button
            aria-label="Cancel pick image button"
            className="btn-with-border"
            style={{ backgroundColor: "#fff", border: "none" }}
            onClick={() => {
              document.getElementById("pick-image-container").style.visibility =
                "hidden";
              document.getElementById("pick-image-container").style.opacity =
                "0";
            }}
          >
            Cancel <i className="fa-solid fa-x"></i>
          </button>
        </div>
      </div>

      {/* Modal ask if user wants to change images sign in */}
      <div className="modal" id="popup-change-image">
        <div className="modal-content">
          <h2 style={{ backgroundColor: "transparent" }}>Password updated</h2>

          <div className="policy-section">
            <p
              style={{
                fontSize: "16px",
                color: "#555",
                fontStyle: "italic",
                marginTop: "4px",
              }}
            >
              Your password has been updated successfully. Would you like to
              update the two images used for your second-step login as well?
            </p>
          </div>

          <div style={{ marginTop: "40px", display: "flex", gap: "10px" }}>
            <button
              className="btn"
              onClick={() => {
                document.getElementById("popup-change-image").style.display =
                  "none";

                // Move to sign in
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
              }}
              aria-label="Not now button"
            >
              Not now
            </button>
            <button
              className="btn-yellow"
              onClick={() => {
                document.getElementById("popup-change-image").style.display =
                  "none";

                // Show modal select images
                document.getElementById(
                  "pick-image-container",
                ).style.visibility = "visible";
                document.getElementById("pick-image-container").style.opacity =
                  "1";

                setIsChangeImages(true);
              }}
              aria-label="Update images button"
            >
              Update images
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
