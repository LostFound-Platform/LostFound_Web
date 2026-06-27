export default function AuthenticationSignIn() {
  return (
    <>
      {/* Sign In */}
      <form
        onSubmit={handleSubmitSignIn}
        style={{ width: "100%", paddingLeft: "10px" }}
      >
        <div className="sign-in">
          <h1 style={{ marginBottom: "20px", fontSize: "40px" }}>Sign In</h1>
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
              type={/\D/.test(studentIdOrEmailForSignIn) ? "email" : "text"}
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
                  setIsClickShowPasswordSignIn(!isClickShowPasswordSignIn);
                }}
              ></i>
            ) : (
              <i
                className="fa-solid fa-eye"
                onClick={() => {
                  setIsClickShowPasswordSignIn(!isClickShowPasswordSignIn);
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
                <i className="fa-solid fa-arrow-right-to-bracket"></i> Sign In
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
    </>
  );
}
