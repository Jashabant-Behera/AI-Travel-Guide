"use client";
import React from "react";
import "../styles/testimonial.css";

const Testimonial = () => {
  return (
    <section id="testimonials" className="test">
      <div className="testimonials-heading">
        <h2>What Our Travelers Say</h2>
        <div className="testimonials-section">
          <div className="testimonial">
            <img src="/aditi.png" alt="Traveler 1" className="testimonial-img" />
            <div className="testimonial-content">
              <h3 className="user-name">Aditi Sharma</h3>
              <p className="user-feedback">
                "Planning my trip to Thailand was effortless with Travel Buddy! The AI suggestions
                helped me discover hidden gems, and the itinerary manager kept everything organized.
                Highly recommend!"
              </p>
              <p className="user-rating">⭐⭐⭐⭐⭐</p>
            </div>
          </div>

          <div className="testimonial">
            <img src="/james.png" alt="Traveler 2" className="testimonial-img" />
            <div className="testimonial-content">
              <h3 className="user-name">James Anderson</h3>
              <p className="user-feedback">
                "I loved how the AI recommended food places based on my preferences. I explored the
                best street food in Vietnam, thanks to this app!"
              </p>
              <p className="user-rating">⭐⭐⭐⭐⭐</p>
            </div>
          </div>

          <div className="testimonial">
            <img src="/priya.png" alt="Traveler 3" className="testimonial-img" />
            <div className="testimonial-content">
              <h3 className="user-name">Priya Patel</h3>
              <p className="user-feedback">
                "As a solo traveler, I always struggled with finding safe and fun places. Travel
                Buddy gave me the confidence to explore new destinations!"
              </p>
              <p className="user-rating">⭐⭐⭐⭐⭐</p>
            </div>
          </div>

          <div className="testimonial">
            <img src="/rahul.png" alt="Traveler 4" className="testimonial-img" />
            <div className="testimonial-content">
              <h3 className="user-name">Rahul Mehta</h3>
              <p className="user-feedback">
                "I planned a 7-day Europe tour using the AI-powered itinerary feature. Everything
                was so well-optimized that I saved time and money!"
              </p>
              <p className="user-rating">⭐⭐⭐⭐⭐</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
