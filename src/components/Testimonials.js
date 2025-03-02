import React from "react";
import Testimonial from "./Testimonial";
import './Testimonials.css';

function Testimonials() {
  const testimonials = [
    {
      quote: "The best bakery in town—every bite is a delight!",
      author: "Happy Customer",
    },
    {
      quote: "Their pastries are pure perfection, fresh and flavorful every time.",
      author: "Sarah M.",
    },
    {
      quote: "I can’t get enough of their bread—worth every penny!",
      author: "James T.",
    },
  ];

  return (
    <section className="testimonials-section">
      <h2>What Our Customers Say</h2>
      <div className="testimonials-container">
        {testimonials.map((testimonial, index) => (
          <Testimonial
            key={index}
            quote={testimonial.quote}
            author={testimonial.author}
          />
        ))}
      </div>
    </section>
  );
}

export default Testimonials;