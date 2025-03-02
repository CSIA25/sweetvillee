import React from "react";
import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="cta">
      <h2>Bake Your Day Better!</h2>
      <p>Treat yourself to our artisanal goodies—freshly baked and ready for you.</p>
      <Link to="/shop">
        <button className="cta-button">Order Now</button>
      </Link>
    </section>
  );
}

export default CTA;