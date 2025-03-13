import React from "react";
import Navbar from "../components/LandingPage/Navbar";
import Hero from "../components/LandingPage/Hero";
import Features from "../components/LandingPage/Features";
import Working from "../components/LandingPage/Working";
import Footer from "../components/LandingPage/Footer";

/**
 * LandingPage Component
 * 
 * The main landing page of the application. It includes a navbar, hero section,
 * features section, working section, and footer.
 * 
 * @returns {JSX.Element} - Rendered LandingPage component
 */
const LandingPage = () => {
  // Navigation links for the navbar
  const navLinks = [
    { path: "#home", label: "Home" },
    { path: "#features", label: "Features" },
    { path: "#working", label: "Working" },
    { path: "#contact", label: "Contact" },
  ];

  return (
    <div className="overflow-hidden antialiased selection:bg-gray-400 selection:text-gray-800">
      {/* Background Gradient */}
      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,0,0,0.2),rgba(0,0,0,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto lg:px-5">
        {/* Navbar */}
        <Navbar navLinks={navLinks} />

        {/* Hero Section */}
        <section id="home">
          <Hero />
        </section>

        {/* Features Section */}
        <section id="features">
          <Features />
        </section>

        {/* Working Section */}
        <section id="working">
          <Working />
        </section>

        {/* Footer Section */}
        <section id="contact">
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default LandingPage;