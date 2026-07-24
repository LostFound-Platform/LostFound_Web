export default function Home2() {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-badge">
              ★ Now serving 50+ Campus Communities
            </span>

            <h1>
              We help find your <em>LOST</em> belongings.
            </h1>

            <p>
              The unified network for campus lost and found. Whether you're at
              Gwinnett Tech or any partner institution, we bridge the gap
              between lost and found.
            </p>

            <div className="search-pill">
              <div className="search-item">
                <span>YOUR CURRENT CAMPUS</span>
                <b>Gwinnett Technical College</b>
              </div>

              <div className="search-item">
                <span>WHAT HAVE YOU LOST?</span>
                <b>Search by name, ID...</b>
              </div>

              <button>Search Items</button>
            </div>

            <div className="stats">
              <div>
                <b>12k+</b>
                <span>Items Found</span>
              </div>
              <div>
                <b>95%</b>
                <span>Return Rate</span>
              </div>
              <div>
                <b>50+</b>
                <span>Partner Schools</span>
              </div>
            </div>
          </div>

          <img className="hero-img" src="/campus-students.png" alt="students" />
        </div>
      </section>

      <section className="schools">
        <div className="container">
          <div className="section-top">
            <div>
              <h2>Schools on Our Platform</h2>
              <p>
                We've partnered with leading institutions to ensure students
                always have a central place to recover their belongings.
              </p>
            </div>
            <a href="#">See all participating schools →</a>
          </div>

          <div className="school-grid">
            {[
              "Gwinnett Technical College",
              "North Georgia Tech",
              "Statewide Polytechnic",
              "Metro University",
            ].map((s) => (
              <div className="school-card" key={s}>
                <div className="school-icon">⌂</div>
                <p>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-wrap">
        <div className="admin-card">
          <div>
            <h2>Empower your campus administrators.</h2>
            <p>
              Streamline the lost and found process at your institution. Our
              platform provides the dashboard, security, and verification tools
              your staff needs.
            </p>
            <div className="admin-buttons">
              <button>Partner with Us</button>
              <button className="outline">Request a Demo</button>
            </div>
          </div>

          <div className="admin-mini">
            <div>
              <span>▣</span>
              <h4>Detailed Analytics</h4>
              <p>Track volumes and reveal recovered item trends.</p>
            </div>
            <div>
              <span>◉</span>
              <h4>Secure Verification</h4>
              <p>Built-in claim verification keeps recoveries safe.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how">
        <h2>
          Learn <em>how it works</em>
        </h2>
        <p>
          Connecting lost items with their owners is simpler than ever with our
          optimized community workflow.
        </p>

        <div className="how-grid">
          <div className="how-card">
            <span>☷</span>
            <small>1. Register</small>
            <h3>
              Create your account using your school email to join your local
              campus community instantly.
            </h3>
            <a>Get Started →</a>
          </div>

          <div className="how-card middle">
            <span>▣</span>
            <small>2. Report an Item</small>
            <h3>
              Snap a photo of the found item or describe what you’ve lost. Our
              AI helps tag and categorize it for better matching.
            </h3>
            <a>List Now →</a>
          </div>

          <div className="how-card">
            <span>✦</span>
            <small>3. Reunite</small>
            <h3>
              Once a match is verified, we facilitate a safe campus pickup or
              return. Smile, you’ve helped your community!
            </h3>
            <a>Success Stories →</a>
          </div>
        </div>
      </section>

      <section className="posts">
        <h2>Newest Posts</h2>
        <p>Stay updated on the latest items reported across all campuses.</p>

        <div className="empty-box">
          <div className="empty-icon">⊘</div>
          <p>No recent posts to show yet.</p>
          <button>View all listings ↗</button>
        </div>
      </section>
    </main>
  );
}
