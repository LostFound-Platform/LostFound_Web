import { useState } from "react";
import { useEffect } from "react";

export default function NotificationSystem() {
  // Variables
  let [msg, setMsg] = useState("");
  let [colorBackground, setColorBackground] = useState("");
  let [icon, setIcon] = useState("");

  // UseEffect
  useEffect(() => {
    const handleError = (e) => {
      setMsg(e.detail.message);

      switch (e.detail.status) {
        case "error":
          setColorBackground("red");
          setIcon("fa-solid fa-circle-exclamation");
          break;

        case "warning":
          setColorBackground("#ec7207");
          setIcon("fa-solid fa-triangle-exclamation");
          break;

        case "success":
          setColorBackground("green");
          setIcon("fa-solid fa-check");
          break;
      }

      document.querySelector(".toast").style.transform = "translateX(0)";
    };

    window.addEventListener("app-error", handleError);

    closeToast();

    return () => {
      window.removeEventListener("app-error", handleError);
    };
  }, []);

  const closeToast = () => {
    setInterval(() => {
      document.querySelector(".toast").style.transform = "translateX(150%)";
    }, 7000);
  };

  return (
    <>
      <div
        className="toast"
        style={{
          backgroundColor: colorBackground,
        }}
      >
        <i className={icon} style={{ marginRight: "20px" }}></i> {msg}
        <i
          className="fa-solid fa-x"
          style={{ cursor: "pointer", marginLeft: "20px" }}
          onClick={() => {
            document.querySelector(".toast").style.transform =
              "translateX(150%)";
          }}
        ></i>
      </div>
    </>
  );
}
