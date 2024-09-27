"use client";

import React, { useState, useEffect } from "react";

const BackToTop = () => {
  // State to control visibility of the back-to-top button
  const [isVisible, setIsVisible] = useState(false);
  // State to control the 'moveTop' class
  const [hasMoveTopClass, setHasMoveTopClass] = useState(false);

  useEffect(() => {
    const $vh = document.documentElement.clientHeight / 2;
    const $ww = window.innerWidth;

    // Function to handle scroll events
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > $vh);
    };

    // Initial check for the 'moveTop' class
    if ($ww < 992) {
      if (document.getElementById("mbMask")) {
        setHasMoveTopClass(true);
      } else {
        setHasMoveTopClass(false);
      }
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    // Perform initial check
    handleScroll();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Function to scroll back to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Determine the class name based on the state
  const className = hasMoveTopClass ? "moveTop" : "";

  return (
    <div
      id="backToTop"
      style={{ display: isVisible ? "block" : "none" }}
      className={className}
      onClick={scrollToTop}
    ></div>
  );
};

export default BackToTop;
