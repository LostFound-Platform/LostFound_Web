import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axiosInstance from "../api/axiosInstance";

export default function SidebarProfile() {
  // Variables
  let [user, setUser] = useState("");
  const [openDashboard, setOpenDashboard] = useState(false);
  let [isInProcessing, setIsInProcessing] = useState(false);
  const isActive = (path) => location.pathname === path;

  // APIs

  // Functions
  // Sign out
  const signOut = async () => {
    // e.preventDefault();

    try {
      const response = await axiosInstance.post(`/Users/sign-out`, null, {
        headers: {
          "Content-Type": "application/json",
        },
        // // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status == 200) {
        localStorage.removeItem("accessToken");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Get my profile
  const getMyProfile = async () => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get("/Users/profile", {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsInProcessing(false);
    }
  };

  // UseEffect
  useEffect(() => {
    getMyProfile();
  }, []);

  return (
    <>
      {/* Helmet for setting the page title */}
      <Helmet>
        <title>
          {user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : "Profile"}{" "}
          | Back2Me{" "}
        </title>
      </Helmet>

      <div className="sidebarProfile">
        <div
          className="side-bar-infor-user"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {/* Avatar */}
          {isInProcessing ? (
            <Skeleton height={60} width={60} style={{ borderRadius: "50%" }} />
          ) : user?.avatar ? (
            <img
              src={user.urlAvatar}
              alt="avatar"
              style={{
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                objectFit: "cover",
              }}
              loading="lazy"
            />
          ) : (
            <img
              className="user-avatar"
              src="/Image/user_icon.png"
              alt="avatar"
              style={{
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                objectFit: "cover",
              }}
              loading="lazy"
            />
          )}
          <div className="user-info">
            <h3 className="user-name">
              {user.firstName ? (
                user.firstName
              ) : (
                <Skeleton height={30} width={110} />
              )}
            </h3>
            <h4 className="user-sub">
              {user.role ? (
                user.student?.studentId ? (
                  `ID: ${user.student.studentId}`
                ) : (
                  user.role
                )
              ) : (
                <Skeleton height={20} width={92} style={{ marginTop: "5px" }} />
              )}
            </h4>
          </div>
        </div>

        {/* Personal information  */}
        <div className="list-menu-profile">
          <a
            href="/me"
            style={{
              fontWeight: "400",
              lineHeight: "50px",
            }}
            aria-label="Personal information link"
            className={`${isActive("/me") ? "active" : ""}`}
          >
            {" "}
            <i className="fa-solid fa-user"></i> Personal information
          </a>

          {/* My post */}
          <a
            href="/my-posts"
            style={{
              fontWeight: "400",
              lineHeight: "50px",
            }}
            aria-label="My post link"
            className={`${isActive("/my-posts") ? "active" : ""}`}
          >
            {" "}
            <i className="fa-solid fa-file-lines"></i> My post
          </a>

          {/* Notifications */}
          <a
            href="/notifications"
            style={{
              fontWeight: "400",
              lineHeight: "50px",
            }}
            aria-label="Notifications link"
            className={`${isActive("/notifications") ? "active" : ""}`}
          >
            {" "}
            <i className="fa-solid fa-bell"></i> Notifications
          </a>

          {/* Verification Codes */}
          <a
            href="/verification-codes"
            style={{
              fontWeight: "400",
              lineHeight: "50px",
            }}
            aria-label="Verification codes link"
            className={`${isActive("/verification-codes") ? "active" : ""}`}
          >
            <i className="fa-solid fa-key"></i> Verification Codes
          </a>

          {/* Dashboard */}
          {user.role === "Admin" && (
            <>
              <a
                href="/dashboard"
                style={{
                  fontWeight: "400",
                  lineHeight: "50px",
                }}
                aria-label="Admin dashboard link"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenDashboard(!openDashboard);
                }}
                className={`${isActive("/dashboard") ? "active" : ""}`}
              >
                <i className="fa-solid fa-house"></i> Dashboard{" "}
                <i
                  className={`fa-solid fa-chevron-down arrow ${
                    openDashboard ? "rotate" : ""
                  }`}
                ></i>
              </a>

              {/* Sub Menu */}
              <div
                className={`submenu ${
                  openDashboard || location.pathname.startsWith("/dashboard")
                    ? "show"
                    : ""
                }`}
              >
                <a
                  href="/dashboard/report"
                  aria-label="Report link"
                  className={isActive("/dashboard/report") ? "active" : ""}
                >
                  Report
                </a>

                <a
                  href="/dashboard/confirm-received"
                  className={
                    isActive("/dashboard/confirm-received") ? "active" : ""
                  }
                  aria-label="Confirm received link"
                >
                  Confirm Received
                </a>

                <a
                  href="/dashboard/users"
                  className={
                    isActive("/dashboard/users") ||
                    location.pathname.startsWith("/dashboard/user/")
                      ? "active"
                      : ""
                  }
                  aria-label="Users link"
                >
                  Users
                </a>
                <a
                  href="/dashboard/transfer-requests"
                  className={
                    isActive("/dashboard/transfer-requests") ? "active" : ""
                  }
                  aria-label="Transfer requests link"
                >
                  Transfer Requests
                </a>
                <a
                  href="/dashboard/pick-up-requests"
                  className={
                    isActive("/dashboard/pick-up-requests") ? "active" : ""
                  }
                  aria-label="Pick-Up Requests link"
                >
                  Pick-Up Requests
                </a>
              </div>
            </>
          )}

          {/* Log out */}
          <a
            href=""
            style={{
              fontWeight: "400",
              position: "absolute",
              bottom: "20px",
            }}
            aria-label="Sign out link"
            onClick={(e) => {
              e.preventDefault();

              signOut();
            }}
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Sign out
          </a>
        </div>
      </div>
    </>
  );
}
