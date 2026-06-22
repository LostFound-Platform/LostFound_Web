export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h3 style={{ fontFamily: "Mochiy Pop One, sans-serif" }}>
              Back2Me
            </h3>
            <p>
              © {new Date().getFullYear()} Campus Lost & Found. A Student-Led
              Technical Initiative.
            </p>
          </div>

          <div className="footer-links">
            <a href="#policyModal2">Terms & Guide</a>
            <a href="/about">About Us</a>
            <a href="/join-us">Join Us</a>
          </div>
        </div>
      </footer>
    </>
  );
}
