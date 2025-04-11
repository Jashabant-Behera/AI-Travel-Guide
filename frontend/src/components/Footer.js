"use client";
import React from "react";
import Link from "next/link";
import { FaFacebookF, FaGithub, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <div className="logo-box">
            <Link href="/">
              <img src="/logo.png" alt="Logo" className="footerlogo" />
            </Link>
            <p className="tagline">Your AI Travel Guide</p>
          </div>
          <h3 className="footer-title">About Us</h3>
          <p className="footer-text">
            We want to help bring talented students and unique startups together.
          </p>
          <h3 className="footer-title">Contact Us</h3>
          <p className="footer-text">
            <FaPhone className="icon" /> +91 9999 999 999
          </p>
          <p className="footer-text">
            <FaEnvelope className="icon" /> travelguide@ai.com
          </p>
        </div>
        <div className="footer-column">
          <h3 className="footer-title">Information</h3>
          <ul className="footer-links">
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/features">Features</a>
            </li>
            <li>
              <a href="/details">Details</a>
            </li>
            <li>
              <a href="/testimonials">Testimonials</a>
            </li>
            <li>
              <a href="/docs">Docs</a>
            </li>
            <li>
              <a href="/faqs">FAQs</a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="footer-title">Helpful Links</h3>
          <ul className="footer-links">
            <li>
              <a href="/services">Services</a>
            </li>
            <li>
              <a href="/support">Support</a>
            </li>
            <li>
              <a href="/terms">Terms & Conditions</a>
            </li>
            <li>
              <a href="/privacy">Privacy Policy</a>
            </li>
          </ul>
          <h3 className="footer-title">Subscribe More Info</h3>
          <div className="subscribe-box">
            <input type="email" placeholder="Enter your Email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} company.Ltd. All Rights Reserved</p>
        <div className="social-icons">
          <FaFacebookF className="social-icon" />
          <FaGithub className="social-icon" />
          <FaTwitter className="social-icon" />
          <FaInstagram className="social-icon" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
