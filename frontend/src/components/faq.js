"use client";
import React from "react";
import "../styles/faq.css";

const FAQ = () => {
  return (
    <section className="faq">
      <div>
        <h2 className="faq-heading">Have Questions? Here Are Quice Answers To Some Of The Most Common Queries </h2>
      </div>
      <div className="faq-section">
        <div className="faq-item">
          <input type="radio" name="faq" id="faq1" className="faq-toggle" />
          <label htmlFor="faq1" className="faq-question">
            Is this platform free to use?
          </label>
          <div className="faq-answer">
            Yes! All core features are <strong>free</strong>. Some premium AI-powered features may be added in future updates.
          </div>
        </div>
        <div className="faq-item">
          <input type="radio" name="faq" id="faq2" className="faq-toggle" />
          <label htmlFor="faq2" className="faq-question">
            Can I use this on mobile?
          </label>
          <div className="faq-answer">
            Yes! The site is <strong>mobile-friendly</strong>, and works on all modern browsers.
          </div>
        </div>
        <div className="faq-item">
          <input type="radio" name="faq" id="faq3" className="faq-toggle" />
          <label htmlFor="faq3" className="faq-question">
            How accurate are the AI recommendations?
          </label>
          <div className="faq-answer">
            The AI suggests places based on <strong>user preferences, trends, and verified sources</strong>. However, travelers should always <strong>cross-check important details</strong>.
          </div>
        </div>
        <div className="faq-item">
          <input type="radio" name="faq" id="faq4" className="faq-toggle" />
          <label htmlFor="faq4" className="faq-question">
            Can I share my itinerary with friends?
          </label>
          <div className="faq-answer">
            Absolutely! You can <strong>generate shareable links</strong> or <strong>export them as PDFs</strong>.
          </div>
        </div>
        <div className="faq-item">
          <input type="radio" name="faq" id="faq5" className="faq-toggle" />
          <label htmlFor="faq5" className="faq-question">
            Will the AI chatbot replace human travel experts?
          </label>
          <div className="faq-answer">
            Not entirely. The chatbot helps with <strong>general travel advice</strong>, but local guides and personal research are still valuable.
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
