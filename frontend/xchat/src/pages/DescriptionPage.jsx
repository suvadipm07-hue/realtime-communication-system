import React from "react";
import { useNavigate } from "react-router-dom";
import "./DescriptionPage.css";

function DescriptionPage() {
  const navigate = useNavigate();

  return (
    <div className="description-page">

      {/* Header */}
      <header className="description-header">
        <div className="description-logo">
          <span className="logo-icon">💬</span>
          <span>ChatApp</span>
        </div>

        <button
          className="back-chat-btn"
          onClick={() => navigate("/chat")}
        >
          ← Back to Chat
        </button>
      </header>

      {/* Main Content */}
      <main className="description-container">

        {/* Hero Section */}
        <section className="description-hero">
          <div className="hero-text">
            <span className="hero-badge">✨ Simple. Private. Connected.</span>

            <h1>
              Stay connected with
              <span> the people who matter.</span>
            </h1>

            <p>
              ChatApp is a real-time communication platform designed
              to make messaging simple, fast, and convenient.
              Connect with friends, send messages, and keep your
              conversations organized in one place.
            </p>

            <button
              className="hero-chat-btn"
              onClick={() => navigate("/chat")}
            >
              Start Chatting →
            </button>
          </div>

          <div className="hero-illustration">
            <div className="illustration-circle">
              💬
            </div>

            <div className="floating-message message-one">
              <span>👋</span>
              <div>
                <strong>Welcome!</strong>
                <small>Start a conversation</small>
              </div>
            </div>

            <div className="floating-message message-two">
              <span>💙</span>
              <div>
                <strong>Stay connected</strong>
                <small>Anytime, anywhere</small>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-heading">
            <span>WHAT WE OFFER</span>
            <h2>Everything you need to stay connected</h2>
            <p>
              A simple and reliable messaging experience built
              for everyday communication.
            </p>
          </div>

          <div className="features-grid">

            <div className="feature-card">
              <div className="feature-icon blue">💬</div>
              <h3>Real-Time Messaging</h3>
              <p>
                Send and receive messages instantly and
                enjoy smooth conversations with other users.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon purple">🔒</div>
              <h3>Secure Communication</h3>
              <p>
                Your account and conversations are protected
                through secure authentication.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon green">👥</div>
              <h3>Connect with People</h3>
              <p>
                Find users, start new conversations, and
                keep your important chats organized.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon orange">⚡</div>
              <h3>Simple & Fast</h3>
              <p>
                Enjoy a clean interface that makes chatting
                easy without unnecessary complexity.
              </p>
            </div>

          </div>
        </section>

        {/* How It Works */}
        <section className="how-section">
          <div className="section-heading">
            <span>HOW IT WORKS</span>
            <h2>Start chatting in three simple steps</h2>
          </div>

          <div className="steps-container">

            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Create Your Account</h3>
              <p>
                Register with your name, user ID, and password
                to create your account.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Find a User</h3>
              <p>
                Search for another user and add them to
                your chat list.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Start Chatting</h3>
              <p>
                Open a conversation and exchange messages
                in real time.
              </p>
            </div>

          </div>
        </section>

        {/* CTA Section */}
        <section className="description-cta">
          <div>
            <h2>Ready to start a conversation?</h2>
            <p>
              Connect with your friends and enjoy a better
              messaging experience.
            </p>
          </div>

          <button
            className="cta-button"
            onClick={() => navigate("/chat")}
          >
            Go to Chat →
          </button>
        </section>

      </main>

      {/* Footer */}
      <footer className="description-footer">
        <p>© 2026 ChatApp. All rights reserved.</p>
        <p>Built for simple and meaningful communication.</p>
      </footer>

    </div>
  );
}

export default DescriptionPage;