"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";

interface LazyLoadWrapperProps {
  children: ReactNode;
  placeholder?: ReactNode; // Optional placeholder while content loads
}

const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({
  children,
  placeholder = null,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once it's visible
        }
      },
      {
        threshold: 0.1, // Adjust the threshold as needed
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <div ref={sectionRef} style={{ minHeight: "200px" }}>
      {isVisible ? children : placeholder}
    </div>
  );
};

export default LazyLoadWrapper;
