"use client";
import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaPaperPlane,
  FaMapMarker,
  FaLinkedin,
  FaCode,
} from "react-icons/fa";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link href="/" className="footer-logo-link">
            <img src="/icons/logo.png" alt="AI Travel Buddy" className="footer-logo" />
          </Link>
          <p className="footer-tagline">Your AI-Powered Travel Companion</p>

          <div className="footer-newsletter">
            <h3 className="newsletter-title">Get Travel Insights</h3>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Your email address"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button">
                <FaPaperPlane className="icon" /> Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-links-group">
            <h3 className="links-group-title">Explore</h3>
            <ul className="footer-links-list">
              <li>
                <Link href="#features">Features</Link>
              </li>
              <li>
                <Link href="#testimonials">Testimonials</Link>
              </li>
              <li>
                <Link href="#docs">How It Works</Link>
              </li>
              <li>
                <Link href="#faqs">FAQs</Link>
              </li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h3 className="links-group-title">Company</h3>
            <ul className="footer-links-list">
              <li>
                <Link href="#about">About Us</Link>
              </li>
              <li>
                <Link href="#contact">Contact</Link>
              </li>
              <li>
                <Link href="#careers">Careers</Link>
              </li>
              <li>
                <Link href="#blog">Blog</Link>
              </li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h3 className="links-group-title">Legal</h3>
            <ul className="footer-links-list">
              <li>
                <Link href="#privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#terms">Terms of Service</Link>
              </li>
              <li>
                <Link href="#cookies">Cookie Policy</Link>
              </li>
              <li>
                <Link href="#gdpr">GDPR</Link>
              </li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h3 className="links-group-title">Contact Us</h3>
            <address className="footer-contact">
              <p className="contact-item">
                <FaPhone /> +91 999 999 9999
              </p>
              <p className="contact-item">
                <FaEnvelope /> hello@aitravelbuddy.com
              </p>
              <p className="contact-item">
                <FaMapMarker /> India
              </p>
            </address>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          &copy; {new Date().getFullYear()} AI Travel Buddy. All rights reserved.
        </p>

        <div className="footer-social">
          <Link href="#" aria-label="Facebook">
            <FaFacebookF />
          </Link>
          <Link href="#" aria-label="Twitter">
            <FaTwitter />
          </Link>
          <Link href="#" aria-label="Instagram">
            <FaInstagram />
          </Link>
          <Link href="#" aria-label="LinkedIn">
            <FaLinkedin />
          </Link>
          <Link href="#" aria-label="GitHub">
            <FaGithub />
          </Link>
        </div>

        <div className="source-code-section">
          <Link
            href="https://github.com/Jashabant-Behera/AI-Travel-Guide"
            target="_blank"
            rel="noopener noreferrer"
            className="source-code-button"
          >
            <FaCode /> View Source Code
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
