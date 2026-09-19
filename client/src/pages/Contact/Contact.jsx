import { useState } from "react";
import { Link } from "react-router-dom";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">

      {/* NAVBAR */}

      <header className="contact-navbar">
        <Link to="/" className="contact-logo">
          Stay<span>Nest</span>
        </Link>

        <nav className="contact-nav">
          <Link to="/properties">Properties</Link>
          <Link to="/about">About</Link>
          <Link to="/contact" className="active">
            Contact
          </Link>
          <Link to="/dashboard">Dashboard</Link>

          <Link to="/login" className="nav-login">
            Sign In
          </Link>

          <Link to="/register" className="nav-signup">
            Sign Up
          </Link>
        </nav>
      </header>

      {/* HERO */}

      <section className="contact-hero">
        <div className="contact-hero-content">

          <div className="contact-badge">
            <span>●</span>
            GET IN TOUCH
          </div>

          <h1>
            We're here to
            <br />
            <span>help you.</span>
          </h1>

          <p>
            Have a question about a property, your account,
            or StayNest? Send us a message and we'll be happy
            to hear from you.
          </p>

        </div>
      </section>

      {/* CONTACT CONTENT */}

      <section className="contact-section">

        <div className="contact-grid">

          {/* LEFT SIDE */}

          <div className="contact-info">

            <span className="contact-label">
              CONTACT INFORMATION
            </span>

            <h2>
              Let's talk about
              <br />
              your next move.
            </h2>

            <p className="contact-description">
              Whether you're looking for a property, managing
              a listing or simply have a question, our team
              is here to help.
            </p>

            <div className="contact-details">

              <div className="contact-detail">
                <div className="detail-icon">
                  ✉
                </div>

                <div>
                  <span>Email</span>
                  <strong>
                    support@staynest.com
                  </strong>
                </div>
              </div>

              <div className="contact-detail">
                <div className="detail-icon">
                  ☎
                </div>

                <div>
                  <span>Phone</span>
                  <strong>
                    +92 300 0000000
                  </strong>
                </div>
              </div>

              <div className="contact-detail">
                <div className="detail-icon">
                  📍
                </div>

                <div>
                  <span>Location</span>
                  <strong>
                    Pakistan
                  </strong>
                </div>
              </div>

            </div>

            <div className="contact-note">
              <strong>Need property assistance?</strong>

              <p>
                You can also browse our property listings
                and contact owners directly from the
                property details page.
              </p>

              <Link to="/properties">
                Browse Properties →
              </Link>
            </div>

          </div>

          {/* FORM */}

          <div className="contact-form-card">

            <div className="form-header">
              <div className="form-icon">
                💬
              </div>

              <div>
                <h3>Send us a message</h3>

                <p>
                  Fill out the form below and
                  we'll get back to you.
                </p>
              </div>
            </div>

            {submitted && (
              <div className="success-message">
                <strong>Message sent successfully!</strong>

                <span>
                  Thank you for contacting StayNest.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="form-row">

                <div className="form-group">
                  <label htmlFor="name">
                    Your Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="form-group">
                <label htmlFor="subject">
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What can we help you with?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit">
                Send Message
                <span>→</span>
              </button>

            </form>

          </div>

        </div>

      </section>

      {/* FAQ STYLE SECTION */}

      <section className="contact-help">

        <div className="contact-help-inner">

          <div>
            <span>QUICK HELP</span>

            <h2>
              Looking for something?
            </h2>
          </div>

          <div className="help-links">

            <Link to="/properties">
              <strong>Find a property</strong>
              <span>Explore available listings →</span>
            </Link>

            <Link to="/register">
              <strong>Create an account</strong>
              <span>Join StayNest today →</span>
            </Link>

            <Link to="/dashboard">
              <strong>Open your dashboard</strong>
              <span>Manage your StayNest account →</span>
            </Link>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="contact-footer">

        <span>
          © 2026 StayNest. All rights reserved.
        </span>

        <div>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/properties">
            Properties
          </Link>
        </div>

      </footer>

    </div>
  );
}

export default Contact;