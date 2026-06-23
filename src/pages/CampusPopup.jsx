import { useState } from "react";

export default function CampusPopup() {
  const [selectedCampus, setSelectedCampus] = useState("");
  const [showPopup, setShowPopup] = useState(() => {
    return !localStorage.getItem("selectedCampus");
  });

  if (!showPopup) return null;

  const handleContinue = () => {
    if (!selectedCampus) return;

    localStorage.setItem("selectedCampus", selectedCampus);
    console.log("Selected campus:", selectedCampus);
    setShowPopup(false);
  };

  return (
    <div className="campus-overlay" id="campusPopup">
      <div className="campus-modal">
        <button className="close-btn" onClick={() => setShowPopup(false)}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="modal-icon">
          <i className="fa-solid fa-map-marker-alt"></i>
        </div>

        <h2>Select Your Campus</h2>

        <p className="modal-subtitle">
          Welcome back! Please choose the campus you'd like to browse for lost
          and found items today.
        </p>

        <div className="campus-options">
          <button
            className={`campus-card ${
              selectedCampus === "Lawrenceville" ? "active" : ""
            }`}
            onClick={() => setSelectedCampus("Lawrenceville")}
          >
            <div className="campus-circle">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <h3>Lawrenceville</h3>
            <p>MAIN CAMPUS</p>
          </button>

          <button
            className={`campus-card ${
              selectedCampus === "Alpharetta" ? "active" : ""
            }`}
            onClick={() => setSelectedCampus("Alpharetta")}
          >
            <div className="campus-circle">
              <i className="fa-solid fa-building"></i>
            </div>
            <h3>Alpharetta</h3>
            <p>SATELLITE CAMPUS</p>
          </button>
        </div>

        <button
          className="btn"
          disabled={!selectedCampus}
          onClick={handleContinue}
        >
          Continue to Dashboard
        </button>

        <button className="maybe-btn" onClick={() => setShowPopup(false)}>
          Maybe later
        </button>
      </div>
    </div>
  );
}
