import axiosInstance from "../api/axiosInstance";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import ApplicationSuccess from "./ApplicationSuccess";

export default function Partnership() {
  // Variables
  let [msgSignIn, setMsgSignIn] = useState({
    msg: "",
    status: "",
  });
  const [getUniversitiesResults, setGetUniversitiesResults] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSearchInstitution, setIsSearchInstitution] = useState(false);
  const [isSearchingInstitution, setIsSearchingInstitution] = useState(false);
  let [selectedInstitution, setSelectedInstitution] = useState(false);
  let [isOtherCampus, setIsOtherCampus] = useState(false);
  let [isInProcessing, setIsInProcessing] = useState(false);
  let [isShowOtherCampus, setIsShowOtherCampus] = useState(false);
  let [isConfirmed, setIsConfirmed] = useState(false);
  let [institutionName, setInstitutionName] = useState("");
  let [campusPhone, setCampusPhone] = useState("");
  let [campusAddress, setCampusAddress] = useState("");
  let [otherCampusAddress, setOtherCampusAddress] = useState("");
  let [campusState, setCampusState] = useState("");
  let [otherCampusState, setOtherCampusState] = useState("");
  const [query, setQuery] = useState("");
  let [institutionWebsite, setInstitutionWebsite] = useState("");
  let [campusCity, setCampusCity] = useState("");
  let [otherCampusCity, setOtherCampusCity] = useState("");
  let [jobTitle, setJobTitle] = useState("");
  let [fullName, setFullName] = useState("");
  let [workEmail, setWorkEmail] = useState("");
  let [phone, setPhone] = useState("");
  let [studentPopulation, setStudentPopulation] = useState("");
  let [additionalNotes, setAdditionalNotes] = useState("");

  // Functions
  // Handle get universities information from outside API
  const handleGetUniversities = async (query) => {
    if (!query.trim()) {
      setIsSearchInstitution(false);
      setGetUniversitiesResults([]);
      return;
    }

    try {
      setIsSearchingInstitution(true);

      const response = await axiosInstance.get(
        `/InstitutionRequest/search?query=${query}`,
      );

      setGetUniversitiesResults(response.data);
    } catch (error) {
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
      setIsSearchingInstitution(false);
    }
  };

  // Validate request partnership inputs
  function validateRequestPartnership() {
    if (
      fullName.trim() == "" ||
      jobTitle.trim() == "" ||
      workEmail.trim() == "" ||
      phone.trim() == "" ||
      campusPhone.trim() == "" ||
      institutionName.trim() == "" ||
      institutionWebsite.trim() == "" ||
      campusAddress.trim() == "" ||
      campusCity.trim() == "" ||
      campusState.trim() == "" ||
      !isConfirmed ||
      !selectedInstitution ||
      (isOtherCampus &&
        (otherCampusAddress.trim() == "" ||
          otherCampusCity.trim() == "" ||
          otherCampusState.trim() == ""))
    ) {
      return false; // Not valid
    } else {
      // Valid
      if (!isOtherCampus) {
        setOtherCampusAddress("");
        setOtherCampusCity("");
        setOtherCampusState("");
      }

      return true;
    }
  }

  // Handle form submission for Request Institution
  const handleSubmitRequestInstitution = async (e) => {
    e.preventDefault();

    if (!validateRequestPartnership()) {
      setMsgSignIn({
        msg: "Please fill in all required fields.",
        status: 400,
      });
      return;
    }

    setIsInProcessing(true);

    try {
      const payload = {
        institutionRequestId: 0,
        institutionName: institutionName,
        campusEmail: workEmail,
        campusPhone: campusPhone,
        institutionAddress:
          otherCampusAddress.trim() != "" ? otherCampusAddress : campusAddress,
        institutionCity:
          otherCampusCity.trim() != "" ? otherCampusCity : campusCity,
        institutionState:
          otherCampusState.trim() != "" ? otherCampusState : campusState,
        institutionPhone: campusPhone,
        institutionWebsite: institutionWebsite,
        applicantName: fullName,
        workEmail: workEmail,
        jobTitle: jobTitle,
        studentPopulation: studentPopulation,
        additionalNotes: additionalNotes,
      };

      const response = await axiosInstance.post(
        "/InstitutionRequest/sign-up",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          // withCredentials: true,
          validateStatus: (status) => status === 200 || status === 409,
        },
      );

      // Success
      if (response.status == 200) {
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: response.data?.message,
              status: "success",
            },
          }),
        );

        setIsSuccess(true);

        setMsgSignIn({
          msg: "Signed up successfully",
          status: response.status,
        });
      }

      if (response.status == 409) {
        window.dispatchEvent(
          new CustomEvent("app-error", {
            detail: {
              message: response.data?.message,
              status: "error",
            },
          }),
        );

        setMsgSignIn({
          msg: response.data?.message,
          status: response.status,
        });
      }
    } catch (error) {
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

  // Reduce spam call API
  const debouncedFetch = debounce(handleGetUniversities, 300);

  // UseEffects
  useEffect(() => {
    debouncedFetch(query);
    return debouncedFetch.cancel; // Cleanup
  }, [query]);

  useEffect(() => {
    validateRequestPartnership();
  }, [
    fullName,
    jobTitle,
    workEmail,
    phone,
    institutionName,
    institutionWebsite,
    campusAddress,
    campusCity,
    campusState,
    isConfirmed,
    selectedInstitution,
    isOtherCampus,
    otherCampusAddress,
    otherCampusCity,
    otherCampusState,
  ]);

  return (
    <>
      {/* Helmet for setting the page title */}
      <Helmet>
        <title>Partnership | Back2Me </title>
      </Helmet>

      {isSuccess ? (
        <ApplicationSuccess />
      ) : (
        <main className="partner-request-page">
          <section className="partner-request-hero">
            <h1>
              Bring <span>Back2Me</span> to Your Campus
            </h1>
            <p>
              Partner with us to create a more connected and reliable campus
              environment. Join dozens of institutions already simplifying lost
              and found for their students.
            </p>
          </section>

          <section className="partner-request-card">
            <form onSubmit={handleSubmitRequestInstitution}>
              <div className="partner-request-section">
                <h2>
                  <span>
                    <i className="fa-solid fa-graduation-cap"></i>
                  </span>{" "}
                  Institution Information
                </h2>

                <div className="partner-request-row">
                  <div className="form-control-authentication search-universities">
                    <div>
                      <input
                        type="text"
                        name=""
                        id="institution-name"
                        placeholder="Ex: Georgia State"
                        className="form-control-input"
                        autoFocus
                        required
                        value={institutionName}
                        required
                        onChange={(e) => {
                          setIsSearchInstitution(true);
                          setQuery(e.target.value);
                          setInstitutionName(e.target.value);
                          setSelectedInstitution(false);
                        }}
                        onBlur={() => {
                          if (!selectedInstitution) {
                            setInstitutionName("");
                          }
                        }}
                      />
                      <label htmlFor="institution-name">
                        Institution Name*
                      </label>
                    </div>

                    {isSearchInstitution &&
                      (!isSearchingInstitution ? (
                        getUniversitiesResults.length > 0 ? (
                          <ul className="drop-search">
                            {getUniversitiesResults.map((item, index) => (
                              <li
                                key={index}
                                className="p-2 cursor-pointer nav-item"
                                onClick={() => {
                                  setInstitutionName(item.name);
                                  setIsSearchInstitution(false);
                                  setSelectedInstitution(true);
                                  setInstitutionWebsite(item.website);
                                  setCampusAddress(item.address);
                                  setCampusCity(item.city);
                                  setCampusState(item.state);
                                  setIsShowOtherCampus(true);
                                }}
                              >
                                {item.name}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <ul className="drop-search">
                            <li>
                              <i className="fa-brands fa-sistrix"></i> No
                              results found
                            </li>
                          </ul>
                        )
                      ) : (
                        <ul className="drop-search">
                          <li>
                            <span>
                              <i className="fas fa-spinner fa-spin"></i>{" "}
                              Searching...
                            </span>
                          </li>
                        </ul>
                      ))}
                  </div>

                  <div className="form-control-authentication">
                    <input
                      type="text"
                      name=""
                      id="institution-website"
                      placeholder="Ex: university.edu"
                      className="form-control-input"
                      required
                      value={institutionWebsite}
                      readOnly
                      onChange={(e) => {
                        setInstitutionWebsite(e.target.value);
                      }}
                    />
                    <label
                      htmlFor="institution-website"
                      className="readonly-institution-field"
                    >
                      Institution Website*
                    </label>
                  </div>
                </div>

                <div className="partner-request-row">
                  <div className="form-control-authentication search-universities">
                    <div>
                      <input
                        type="text"
                        name=""
                        id="institution-address"
                        placeholder="Ex: 123 University Avenue"
                        className="form-control-input"
                        value={campusAddress}
                        required
                        readOnly
                        onChange={(e) => {
                          setCampusAddress(e.target.value);
                        }}
                      />
                      <label
                        htmlFor="institution-address"
                        className="readonly-institution-field"
                      >
                        Institution Address*
                      </label>
                    </div>
                  </div>

                  <div className="form-control-authentication">
                    <input
                      type="tel"
                      pattern="\d{10}"
                      name=""
                      id="applicant-phone"
                      placeholder="Ex: 123-456-7890"
                      className="form-control-input"
                      required
                      value={campusPhone}
                      onChange={(e) => {
                        setCampusPhone(e.target.value);
                      }}
                    />
                    <label htmlFor="applicant-phone">Institution Phone*</label>
                  </div>

                  <button
                    type="button"
                    className="additional-info-button"
                    aria-label="Department examples"
                  >
                    <i className="fa-solid fa-circle-info"></i>
                    <span className="additional-info-popup">
                      <strong>Phone format</strong>
                      <span>1234567890</span>
                    </span>
                  </button>
                </div>

                <div className="form-control-authentication">
                  <input
                    type="text"
                    name=""
                    id="institution-name"
                    placeholder="Ex: Georgia State"
                    className="form-control-input"
                    required
                    value={campusCity}
                    required
                    readOnly
                    onChange={(e) => {
                      setIsSearchInstitution(true);
                      setQuery(e.target.value);
                      setCampusCity(e.target.value);
                      setSelectedInstitution(false);
                    }}
                    onBlur={() => {
                      if (!selectedInstitution) {
                        setCampusCity("");
                      }
                    }}
                  />
                  <label
                    htmlFor="institution-name"
                    className="readonly-institution-field"
                  >
                    Institution City*
                  </label>
                </div>

                <div className="form-control-authentication">
                  <input
                    type="text"
                    name=""
                    id="institution-name"
                    placeholder="Ex: Georgia State"
                    className="form-control-input"
                    required
                    value={campusState}
                    required
                    readOnly
                    onChange={(e) => {
                      setIsSearchInstitution(true);
                      setQuery(e.target.value);
                      setCampusState(e.target.value);
                      setSelectedInstitution(false);
                    }}
                    onBlur={() => {
                      if (!selectedInstitution) {
                        setCampusState("");
                      }
                    }}
                  />
                  <label
                    htmlFor="institution-name"
                    className="readonly-institution-field"
                  >
                    Institution State*
                  </label>
                </div>

                {isShowOtherCampus && (
                  <div className="form-control-authentication">
                    <div className="other-campus-container">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={isOtherCampus}
                          onChange={(e) => setIsOtherCampus(e.target.checked)}
                        />
                        Other Campus?
                      </label>

                      {isOtherCampus && (
                        <div className="other-campus-form">
                          <p className="other-campus-note">
                            Your institution information above refers to the
                            main campus. If you belong to another campus,
                            provide its details below.
                          </p>

                          <div className="form-control-authentication">
                            <input
                              type="text"
                              id="other-campus-address"
                              className="form-control-input"
                              placeholder="Ex: 980 South Cobb Dr"
                              onChange={(e) => {
                                setOtherCampusAddress(e.target.value);
                              }}
                            />
                            <label htmlFor="other-campus-address">
                              Campus Address
                            </label>
                          </div>

                          <div
                            style={{ display: "flex", gap: "20px" }}
                            className="form-sign-up-last-first"
                          >
                            <div className="form-control-authentication">
                              <input
                                type="text"
                                id="other-campus-city"
                                className="form-control-input"
                                placeholder="Ex: Marietta"
                                onChange={(e) => {
                                  setOtherCampusCity(e.target.value);
                                }}
                              />
                              <label htmlFor="other-campus-city">City</label>
                            </div>

                            <div className="form-control-authentication">
                              <input
                                type="text"
                                id="other-campus-state"
                                className="form-control-input"
                                placeholder="Ex: Georgia"
                                onChange={(e) => {
                                  setOtherCampusState(e.target.value);
                                }}
                              />
                              <label htmlFor="other-campus-state">State</label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="partner-request-section">
                <h2>
                  <span>
                    <i className="fa-solid fa-user"></i>
                  </span>{" "}
                  Applicant Information
                </h2>

                <div className="partner-request-row">
                  <div className="form-control-authentication">
                    <input
                      type="text"
                      name=""
                      id="full-name"
                      placeholder="Ex: John Doe"
                      className="form-control-input"
                      required
                      onChange={(e) => {
                        setFullName(e.target.value);
                      }}
                    />
                    <label htmlFor="full-name">Full Name*</label>
                  </div>

                  <div className="form-control-authentication">
                    <input
                      type="email"
                      name=""
                      id="work-email"
                      placeholder="ex: name@university.edu"
                      className="form-control-input"
                      required
                      onChange={(e) => {
                        setWorkEmail(e.target.value);
                      }}
                    />
                    <label htmlFor="work-email">Work Email*</label>
                  </div>
                </div>

                <div className="partner-request-row">
                  <div className="form-control-authentication">
                    <input
                      type="text"
                      name=""
                      id="job-title"
                      placeholder="Ex: Computer Science Professor"
                      className="form-control-input"
                      required
                      onChange={(e) => {
                        setJobTitle(e.target.value);
                      }}
                    />
                    <label htmlFor="job-title">Job Title*</label>
                  </div>

                  <div className="form-control-authentication">
                    <input
                      type="tel"
                      pattern="\d{10}"
                      name=""
                      id="applicant-phone"
                      placeholder="Ex: 123-456-7890"
                      className="form-control-input"
                      onChange={(e) => {
                        setPhone(e.target.value);
                      }}
                      required
                    />
                    <label htmlFor="applicant-phone">Phone Number*</label>
                  </div>

                  <button
                    type="button"
                    className="additional-info-button"
                    aria-label="Department examples"
                  >
                    <i className="fa-solid fa-circle-info"></i>
                    <span className="additional-info-popup">
                      <strong>Phone format</strong>
                      <span>1234567890</span>
                    </span>
                  </button>
                </div>
              </div>

              <div className="partner-request-section partner-request-section-last">
                <h2>
                  <span>
                    <i className="fa-solid fa-info-circle"></i>
                  </span>{" "}
                  Additional Information
                </h2>

                <div className="form-control-authentication">
                  <textarea
                    placeholder="Full mailing address of the central administration"
                    className="form-control-textarea"
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  />
                  <label>Why do you want to use Back2Me?</label>
                </div>

                <div className="form-control-authentication">
                  <select
                    className="form-control-select"
                    onChange={(e) => setStudentPopulation(e.target.value)}
                  >
                    <option>Estimated Student Population</option>
                    <option value="under-5k">Under 5,000</option>
                    <option value="5k-15k">5,000 - 15,000</option>
                    <option value="15k-30k">15,000 - 30,000</option>
                    <option value="30k-plus">30,000+</option>
                  </select>
                </div>

                <div className="form-control-authentication">
                  <textarea
                    placeholder="Full mailing address of the central administration"
                    className="form-control-textarea"
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    onInput={(e) => {
                      // Adjust the height of the textarea based on its content
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                  />
                  <label>Additional Notes</label>
                </div>
              </div>

              <label className="partner-request-check">
                <input
                  type="checkbox"
                  required
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                />
                <span>
                  I confirm that I am authorized to submit this request on
                  behalf of my institution.
                </span>
              </label>

              <button
                className="partner-request-submit btn"
                type="submit"
                disabled={!validateRequestPartnership() || isInProcessing}
              >
                {isInProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                  </>
                ) : (
                  <>
                    Submit Institution Request{" "}
                    <i className="fa-solid fa-paper-plane"></i>
                  </>
                )}
              </button>
            </form>
          </section>

          <section className="partner-request-next">
            <h2>What happens next?</h2>

            <div className="partner-request-next-step">
              <span>1</span>
              <p>Verify your work email.</p>
            </div>

            <div className="partner-request-next-step">
              <span>2</span>
              <p>Our team reviews your request.</p>
            </div>

            <div className="partner-request-next-step">
              <span>3</span>
              <p>
                Once approved, you’ll receive an activation email for your
                institution Administrator account.
              </p>
            </div>
          </section>
        </main>
      )}
    </>
  );
}
