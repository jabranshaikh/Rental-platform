import { Link } from "react-router-dom";
import "./About.css";

function About() {
  return (
    <div className="about-page">

      {/* NAVBAR */}
      <header className="about-navbar">
        <Link to="/" className="about-logo">
          Stay<span>Nest</span>
        </Link>

        <nav className="about-nav">
          <Link to="/properties">Properties</Link>
          <Link to="/about" className="active">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/login" className="nav-login">Sign In</Link>
          <Link to="/register" className="nav-signup">Sign Up</Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="about-badge">
            <span>●</span>
            ABOUT STAYNEST
          </div>

          <h1>
            Making it easier to
            <br />
            <span>find your place.</span>
          </h1>

          <p>
            StayNest is a modern property platform designed to
            make finding, exploring and connecting with property
            owners simple and convenient.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="about-story">
        <div className="about-story-grid">

          <div className="about-story-card">
            <div className="story-icon">🏠</div>
            <span className="story-label">OUR STORY</span>

            <h2>
              A simpler way to
              <br />
              find a home.
            </h2>

            <p>
              Finding the right property can often be complicated.
              There are countless listings, different locations and
              many details to consider.
            </p>

            <p>
              StayNest brings these experiences together in one
              easy-to-use platform. Users can browse properties,
              explore details, save their favorites and connect
              directly with property owners.
            </p>
          </div>

          <div className="about-story-info">
            <div className="info-item">
              <strong>01</strong>
              <div>
                <h3>Discover</h3>
                <p>
                  Explore properties based on your needs,
                  preferred location and lifestyle.
                </p>
              </div>
            </div>

            <div className="info-item">
              <strong>02</strong>
              <div>
                <h3>Connect</h3>
                <p>
                  Connect with property owners and send
                  inquiries or viewing requests.
                </p>
              </div>
            </div>

            <div className="info-item">
              <strong>03</strong>
              <div>
                <h3>Find your place</h3>
                <p>
                  Make your property search simpler and
                  move one step closer to your next home.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="about-features">
        <div className="section-heading">
          <span>WHY STAYNEST</span>

          <h2>
            Everything you need
            <br />
            in one place.
          </h2>

          <p>
            StayNest is built around a simple idea:
            property searching should feel easy.
          </p>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-number">01</div>
            <div className="feature-icon">🔎</div>
            <h3>Easy Property Search</h3>
            <p>
              Browse different types of properties and
              discover places that match what you're looking for.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">02</div>
            <div className="feature-icon">💬</div>
            <h3>Connect With Owners</h3>
            <p>
              Send inquiries and property viewing requests
              directly through the platform.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">03</div>
            <div className="feature-icon">❤️</div>
            <h3>Save Your Favorites</h3>
            <p>
              Keep track of properties you like so you can
              easily return to them later.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-number">04</div>
            <div className="feature-icon">🏢</div>
            <h3>For Property Owners</h3>
            <p>
              Owners can add and manage their property
              listings from their own dashboard.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div>
          <span>READY TO START?</span>

          <h2>
            Your next place
            <br />
            could be here.
          </h2>

          <p>
            Explore available properties and start your
            search with StayNest.
          </p>

          <Link to="/properties">
            Explore Properties
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="about-footer">
        <span>© 2026 StayNest. All rights reserved.</span>

        <div>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/properties">Properties</Link>
        </div>
      </footer>

    </div>
  );
}

export default About;