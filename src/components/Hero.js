import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Freshly Baked Bliss</h1>
        <p>Indulge in the finest artisan breads and pastries.</p>
        <Link to="/shop">
          <button className="hero-button">Shop Now</button>
        </Link>
      </div>
    </section>
  );
}

export default Hero;