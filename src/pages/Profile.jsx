import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import InputMask from "react-input-mask";
import SidebarProfile from "../components/SidebarProfile";
import Skeleton from "react-loading-skeleton";
import dayjs from "dayjs";
import axiosInstance from "../api/axiosInstance";

export default function Profile() {
  // Variables
  let [user, setUser] = useState("");
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [dateOfBirth, setDateOfBirth] = useState("");
  let [avatarPreview, setAvatarPreview] = useState(null);
  let [selectedFileAvatar, setSelectedFileAvatar] = useState(null);
  let [isChangeDateOfBirth, setIsChangeDateOfBirth] = useState(false);
  let [isSending, setIsSending] = useState(false);
  let [isModify, setIsModify] = useState(false);
  let [isInProcessing, setIsInProcessing] = useState(false);

  // APIs

  // Functions
  // Handle resend verification email
  const handleResendVerify = async () => {
    setIsSending(true);

    try {
      const response = await axiosInstance.post(
        "/Users/resend-verify-email",
        null,
        {
          // withCredentials: true,
          validateStatus: (status) =>
            status === 200 || status === 401 || status === 404,
        },
      );

      if (response.status === 200) {
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: response.data?.message
                ? response.data?.message
                : response.data,
              status: "success",
            },
          }),
        );
      }

      if (response.status === 404) {
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: response.data?.message
                ? response.data?.message
                : response.data,
              status: "error",
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
      setIsSending(false);
    }
  };

  // Handle change avatar
  const handleChangeAvatar = (file) => {
    if (!file) return;
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSize = 5 * 1014 * 1014; // 5MB

      // Check type of file
      if (!allowedTypes.includes(file.type)) {
        alert("Only accept JPG, PNG or WebP files");
        return;
      }

      if (file.size > maxSize) {
        alert("The image exceeds 5MB. Please select a smaller image");
        return;
      }

      // To upload to server
      setSelectedFileAvatar(file);

      // To preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setIsModify(true);
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

      file.target.value = "";
    }
  };

  const handleUploadAvatar = (e) => {
    const file = e.target.files[0];
    handleChangeAvatar(file);
  };

  const handleDropAvatar = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleChangeAvatar(file);
  };

  // Get my profile
  const getMyProfile = async () => {
    setIsInProcessing(true);

    try {
      const response = await axiosInstance.get("/Users/profile", {
        // // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status === 200) {
        setUser(response.data);

        // Set details
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setDateOfBirth(response.data.dateOfBirth);
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
      setIsInProcessing(false);
    }
  };

  // Update profile
  const updateProfile = async (e) => {
    e.preventDefault();

    setIsInProcessing(true);

    const formData = new FormData();
    selectedFileAvatar && formData.append("avatarUpload", selectedFileAvatar); // Image
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    if (dateOfBirth && dateOfBirth.trim() != "" && !dateOfBirth.includes("_")) {
      formData.append("dateOfBirth", dateOfBirth);
    }

    try {
      const response = await axiosInstance.put("/Users/update-user", formData, {
        // withCredentials: true,
        validateStatus: (status) =>
          status === 200 || status === 401 || status === 404,
      });

      if (response.status === 200) {
        await getMyProfile();

        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: response.data,
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
      setIsInProcessing(false);
    }
  };

  // UseEffect
  useEffect(() => {
    getMyProfile();
  }, []);

  return (
    <>
      <div
        className="sidebar-and-content"
        style={{
          display: "grid",
          gridTemplateColumns: "15% 50% 15%",
          gap: "50px",
          // backgroundColor: "pink",
          position: "relative",
        }}
      >
        {/* Menu for profile */}
        <SidebarProfile></SidebarProfile>

        {/* Name of profile */}
        <div
          className="profile-info-container"
          style={{ display: "flex", marginTop: "100px" }}
        >
          <div style={{ width: "100%" }}>
            <h1
              className="my-profile-title"
              style={{
                fontFamily: "Mochiy Pop One, sans-serif",
                fontSize: "20px",
                fontWeight: "100",
                marginLeft: "10px",
              }}
            >
              My profile
            </h1>
            <form onSubmit={updateProfile}>
              <table
                border="0"
                style={{
                  padding: "10px",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <tbody>
                  <tr className="table-tr">
                    <th
                      style={{
                        fontWeight: "600",
                        paddingRight: "100px",
                        width: "200px",
                      }}
                    >
                      First Name:
                    </th>
                    <td style={{ verticalAlign: "top" }} className="table-td">
                      {!isInProcessing ? (
                        <input
                          placeholder="Ex: Jennie Nguyen"
                          type="text"
                          className="form-control-input-label-top"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value);

                            setIsModify(true);
                          }}
                        />
                      ) : (
                        <Skeleton
                          className="skeleton-input"
                          height={45}
                          width={530}
                          style={{ marginBottom: "5px", borderRadius: "20px" }}
                        />
                      )}
                    </td>
                  </tr>
                  <tr className="table-tr">
                    <th
                      style={{
                        fontWeight: "600",
                        paddingRight: "100px",
                        width: "200px",
                      }}
                    >
                      Last Name:
                    </th>
                    <td style={{ verticalAlign: "top" }} className="table-td">
                      {!isInProcessing ? (
                        <input
                          placeholder="Ex: Jennie Nguyen"
                          type="text"
                          className="form-control-input-label-top"
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value);

                            setIsModify(true);
                          }}
                        />
                      ) : (
                        <Skeleton
                          className="skeleton-input"
                          height={45}
                          width={530}
                          style={{ marginBottom: "5px", borderRadius: "20px" }}
                        />
                      )}
                    </td>
                  </tr>
                  <tr className="table-tr">
                    <th
                      style={{
                        fontWeight: "600",
                        paddingRight: "100px",
                        width: "200px",
                      }}
                    >
                      DOB:
                    </th>
                    <td style={{ verticalAlign: "top" }} className="table-td">
                      {!isInProcessing ? (
                        <InputMask
                          mask={"99/99/9999"}
                          placeholder="mm/dd/yyyy"
                          value={
                            isChangeDateOfBirth
                              ? dateOfBirth
                              : dayjs(dateOfBirth).format("MM/DD/YYYY") || ""
                          }
                          className="form-control-input-label-top"
                          onChange={(e) => {
                            setDateOfBirth(e.target.value);
                            setIsChangeDateOfBirth(true);
                            setIsModify(true);
                          }}
                        ></InputMask>
                      ) : (
                        <Skeleton
                          height={45}
                          width={530}
                          style={{ marginBottom: "5px", borderRadius: "20px" }}
                        />
                      )}
                    </td>
                  </tr>
                  <tr className="table-tr">
                    <th style={{ fontWeight: "600" }}>Role: </th>
                    <td style={{ verticalAlign: "top" }} className="table-td">
                      {!isInProcessing ? (
                        <input
                          placeholder="Ex: 123 456 789"
                          type="text"
                          className="form-control-input-label-top"
                          value={user.role}
                          style={{ cursor: "not-allowed" }}
                          disabled
                        />
                      ) : (
                        <Skeleton
                          className="skeleton-input"
                          height={45}
                          width={530}
                          style={{ marginBottom: "5px", borderRadius: "20px" }}
                        />
                      )}
                    </td>
                  </tr>
                  <tr className="table-tr">
                    <th style={{ fontWeight: "600" }}>
                      <label>Email: </label>
                    </th>
                    <td style={{ verticalAlign: "top" }} className="table-td">
                      {!isInProcessing ? (
                        <input
                          placeholder="Ex: demo@ex.io"
                          type="email"
                          className="form-control-input-label-top"
                          value={`${user.email}`}
                          style={{ cursor: "not-allowed" }}
                          disabled
                        />
                      ) : (
                        <Skeleton
                          className="skeleton-input"
                          height={45}
                          width={530}
                          style={{ marginBottom: "5px", borderRadius: "20px" }}
                        />
                      )}
                    </td>
                  </tr>
                  <tr className="table-tr">
                    <th></th>
                    <td style={{ verticalAlign: "top" }} className="table-td">
                      {!isInProcessing ? (
                        !user.isVerifiedEmail ? (
                          <>
                            <span className="badge-not-verified">
                              <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                              Not Verified
                            </span>

                            <button
                              className="btn btn-verify"
                              onClick={() => {
                                handleResendVerify();
                              }}
                              type="button"
                              disabled={isSending}
                              aria-label="Send verification email button"
                            >
                              {isSending ? (
                                <i className="fas fa-spinner fa-spin"></i>
                              ) : (
                                "Verify Now"
                              )}
                            </button>
                          </>
                        ) : (
                          <span className="badge-verified">
                            <i className="fa-solid fa-circle-check"></i>{" "}
                            Verified
                          </span>
                        )
                      ) : (
                        <Skeleton
                          className="skeleton-input"
                          height={45}
                          width={530}
                          style={{ marginBottom: "5px", borderRadius: "20px" }}
                        />
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <button
                aria-label="Save changes button"
                className="btn-yellow"
                style={{
                  width: "100%",
                  backgroundColor:
                    isModify && !isInProcessing ? "#ec7207" : "#d3d3d3",
                  color: isModify && !isInProcessing ? "#fff" : "#8c8c8c",
                  cursor:
                    isModify && !isInProcessing ? "pointer" : "not-allowed",
                  opacity: isModify && !isInProcessing ? 1 : 0.6,
                }}
                disabled={!isModify || isInProcessing}
              >
                {isInProcessing ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk me-2"></i> Save
                    changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Avatar */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropAvatar}
          className="change-delete-avatar"
          style={{ marginLeft: "100px" }}
        >
          {isInProcessing ? (
            <Skeleton
              height={420}
              width={420}
              style={{
                borderRadius: "12px",
                marginTop: "150px",
              }}
            />
          ) : (
            <img
              src={
                avatarPreview
                  ? avatarPreview
                  : user?.avatar
                    ? user.urlAvatar
                    : "/Image/user_icon.png"
              }
              alt="avatar"
              loading="lazy"
            />
          )}
          <div
            style={{
              display: "flex",
              gap: "20px",
            }}
          >
            <div style={{ display: "flex" }}>
              <label
                className="btn"
                style={{
                  borderColor: "#ec7207",
                }}
                htmlFor="update-avatar"
              >
                <i className="fa-solid fa-repeat"></i> Change
              </label>
              <input
                type="file"
                id="update-avatar"
                style={{ display: "none" }}
                onChange={handleUploadAvatar}
              />
            </div>
            <div>
              <button
                aria-label="Delete avatar button"
                className="btn-with-border"
                style={{
                  borderColor: "#ec7207",
                }}
                type="button"
                onClick={() => {
                  setAvatarPreview(null);
                  setIsModify(false);
                }}
              >
                <i className="fa-solid fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
