import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
// const Lottie = lazy(() => import("lottie-react"));
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Lonely404 from "../assets/animations/Lonely404.json";

export default function NotFound() {
  return (
    <>
      {/* Helmet for setting the page title */}
      <Helmet>
        <title>Not Found 404 | Back2Me </title>
      </Helmet>

      <main>
        <div className="not-found">
          <Suspense fallback={<p>Loading animation...</p>}>
            <DotLottieReact
              src="../assets/animations/Lonely404.json"
              autoplay
              loop
              style={{ width: "50%", margin: "auto" }}
            />
          </Suspense>
          <h1 style={{ fontSize: "40px" }}>Page Not Found</h1>
          <p style={{ color: "", marginBottom: "20px" }}>
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <button
            aria-label="Go back button"
            className="btn"
            onClick={() => {
              window.history.back();
            }}
          >
            <i className="fa-solid fa-arrow-left"></i> Go Back
          </button>
        </div>
      </main>
    </>
  );
}
