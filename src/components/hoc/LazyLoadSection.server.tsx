import dynamic from "next/dynamic";
import React, { ReactNode } from "react";

// Dynamically import the client-side LazyLoadWrapper component
const LazyLoadWrapper = dynamic(() => import("./LazyLoadWrapper.client"), {
  ssr: false, // Prevent server-side rendering for this component
});

interface LazyLoadSectionProps {
  children: ReactNode;
  placeholder?: ReactNode; // Optional placeholder while content loads
}

const LazyLoadSection: React.FC<LazyLoadSectionProps> = ({
  children,
  placeholder = null,
}) => {
  return (
    <LazyLoadWrapper placeholder={placeholder}>{children}</LazyLoadWrapper>
  );
};

export default LazyLoadSection;
