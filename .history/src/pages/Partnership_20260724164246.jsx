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
      return false;
    } else {
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

      <ApplicationSuccess></ApplicationSuccess>
    </>
  );
}
