import React, { useState } from "react";
import team1 from "../assets/team1.avif"; 
import team2 from "../assets/team2.webp";
import team3 from "../assets/team3.png";
import "./About.css";

const teamMembers = [
  { name: "Emma Baker", role: "Head Baker", bio: "Emma crafts every pastry with love and precision.", image: team1 },
  { name: "Liam Frost", role: "Pastry Chef", bio: "Liam’s frosting skills are the talk of Sweetville.", image: team2 },
  { name: "Olivia Dough", role: "Manager", bio: "Olivia keeps our bakery running smoothly.", image: team3 },
];

function About() {
  const [activeMember, setActiveMember] = useState(null);

  const handleMouseEnter = (index) => setActiveMember(index);
  const handleMouseLeave = () => setActiveMember(null);

  return (
    <div className="about">
      <header className="about-header">
        <h1>About Our Bakery</h1>
        <p>Sweet dreams baked fresh daily.</p>
      </header>

      <section className="about-story">
        <h2>Our Story</h2>
        <p>
          Founded in 2015, our bakery started as a humble dream in a small kitchen. With a passion for quality ingredients and artisanal techniques, we’ve grown into Sweetville’s favorite spot for cakes, pastries, and breads. Every bite tells a story of dedication and delight.
        </p>
      </section>

      <section className="about-team">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`team-card ${activeMember === index ? "active" : ""}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <img src={member.image} alt={member.name} className="team-image" />
              <div className="team-info">
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
                <p className="bio">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-values">
        <h2>Our Values</h2>
        <ul className="values-list">
          <li><strong>Quality:</strong> Only the finest ingredients make it into our ovens.</li>
          <li><strong>Community:</strong> We’re proud to be part of Sweetville’s heart.</li>
          <li><strong>Creativity:</strong> Every treat is a work of art.</li>
        </ul>
      </section>
    </div>
  );
}

export default About;
