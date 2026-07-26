import { Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
// import Lottie from "lottie-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function VerifyEmail() {
  // Variables
  let [isVerifying, setIsVerifying] = useState("");
  let [statusVerify, setStatusVerify] = useState({
    status: false,
    message: "",
  });
  const [searchParams] = useSearchParams();

  // Handle verify email
  const handleVerifyEmail = async () => {
    setIsVerifying(true);

    try {
      const response = await axiosInstance.get(
        `/InstitutionRequest/verify-email?token=${searchParams.get("token")}&isForgotPassword=false`,
        {
          // withCredentials: true,
          validateStatus: (status) =>
            status === 200 || status === 401 || status === 404,
        },
      );

      if (response.status === 200) {
        setStatusVerify({
          status: response.status,
          message: response.data.message,
        });

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: response.data.message,
              status: "success",
            },
          }),
        );
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
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await handleVerifyEmail();
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Helmet for setting the page title */}
      <Helmet>
        <title>Verify Email | Back2Me </title>
      </Helmet>

      <main>
        <h1 style={{ textAlign: "center", marginTop: "70px" }}>
          {isVerifying ? (
            "Verifying email..."
          ) : (
            <div className="not-found">
              {statusVerify.status === 200 && (
                <Suspense fallback={<p>Loading animation...</p>}>
                  <DotLottieReact
                    src="../assets/animations/Sucesso.json"
                    style={{ width: "300px", margin: "auto" }}
                    autoplay
                    loop
                  />
                </Suspense>
              )}
              <h1 style={{ fontSize: "40px" }}>
                {statusVerify.status !== 200 ? "Failed" : statusVerify.message}
              </h1>
              <button
                aria-label="Go back button"
                className="btn"
                onClick={() => {
                  window.location.href = "/me";
                }}
              >
                Go to Profile <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          )}
        </h1>
      </main>
    </>
  );
}
