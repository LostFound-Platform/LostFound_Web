export default function AuthenticationSignUp() {
  return (
    <>
      {/* Sign Up */}
      <form onSubmit={handleChangeToSelectImage} style={{ width: "100%" }}>
        <div className="sign-up">
          <h1 style={{ marginBottom: "20px", fontSize: "40px" }}>Sign Up</h1>
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
                  setIsClickShowPasswordSignUp(!isClickShowPasswordSignUp);
                }}
              ></i>
            ) : (
              <i
                className="fa-solid fa-eye"
                onClick={() => {
                  setIsClickShowPasswordSignUp(!isClickShowPasswordSignUp);
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
                  setIsClickShowConfirmPassword(!isClickShowConfirmPassword);
                }}
              ></i>
            ) : (
              <i
                className="fa-solid fa-eye"
                onClick={() => {
                  setIsClickShowConfirmPassword(!isClickShowConfirmPassword);
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
    </>
  );
}
