import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

export default function Contact() {
  // Ensure the page wrapper is full width when this page is loaded
  useEffect(() => {
    if (window.location.href.includes("contact")) {
      document.getElementById("wrapper").style.width = "100%";
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Contact Us | Back2Me</title>
      </Helmet>

      <main className="contact-page">
        <section className="hero">
          <div className="corner corner-top" />
          <div className="corner corner-left" />

          <span className="pill">CONTACT US</span>
          <h1>We're here to help</h1>
          <p>
            Whether you've lost your keys or found a student ID, our team is
            dedicated to reuniting the CampusFound community with their
            belongings.
          </p>
        </section>

        <section className="contact-section">
          <div className="contact-form-card">
            <h2>Send us a message</h2>

            <form>
              <div className="form-row">
                <div>
                  <label>Full Name</label>
                  <input type="text" placeholder="John Doe" required />
                </div>

                <div>
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="john@student.gtc.edu"
                    required
                  />
                </div>
              </div>

              <label>Subject</label>
              <select required>
                <option value="">Select a subject</option>
                <option value="claiming">Claiming a Found Item</option>
                <option value="reporting">Reporting a Lost Item</option>
                <option value="general">General Question</option>
              </select>

              <label>Your Message</label>
              <textarea placeholder="How can we assist you today?" required />

              <button type="submit" className="btn">
                <i className="fa-solid fa-paper-plane"></i> Send Message
              </button>
            </form>
          </div>

          <aside className="contact-info">
            <div className="office-card">
              <div className="office-title">
                <div className="round-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h3>Our Office</h3>
                  <strong>Gwinnett Technical College</strong>
                </div>
              </div>

              <div className="info-line">
                <span>
                  <i className="fas fa-building"></i>
                </span>
                <p>
                  Building 100, Room 402 <br />
                  Lawrenceville Campus
                </p>
              </div>

              <div className="info-line">
                <span>
                  <i className="fas fa-clock"></i>
                </span>
                <p>
                  Office Hours <br />
                  Mon - Thu: 8:00 AM - 6:00 PM <br />
                  Fri: 8:00 AM - 12:00 PM
                </p>
              </div>

              <div className="socials">
                <a
                  href="https://www.instagram.com/campuslostfound/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>

            <div className="help-card">
              <h3>Need a quick answer?</h3>
              <p>
                Our FAQ section covers everything from how to claim items to
                managing your profile notifications.
              </p>
              <a href="/support">Visit Help Center →</a>
              <div className="question-mark">?</div>
            </div>

            <div className="campus-card">
              <img
                src="https://herainc.com/wp-content/uploads/2021/03/Gwinnett-Tech_Exterior.png"
                alt="Campus building"
              />
              <div>Pilot Campus: Lawrenceville</div>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
