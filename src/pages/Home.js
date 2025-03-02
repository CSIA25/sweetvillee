import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer"; // Add Footer import
import "./Home.css";

function Home() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div className="home">
      <section className="welcome">
        <h1>{greeting}, Bakery Lovers!</h1>
        <p>Indulge in our freshly baked delights, crafted just for you.</p>
      </section>
      <Hero />
      <FeaturedProducts />
      <Testimonials />
      <CTA />
      <Footer /> {/* Footer only on Home page */}
    </div>
  );
}

export default Home;