"use client";

import { LodgeListingProvider } from "@/lib/context/LodgeListingContext";
import dynamic from "next/dynamic";
import React from "react";

const SearchResults = dynamic(() => import("./SearchResults"));
const SearchFilter = dynamic(
  () => import("@/components/compound/search-filter")
);

const lodgingListPage: React.FC = () => {
  return (
    <LodgeListingProvider>
      <SearchFilter withFilter />
      <SearchResults />
    </LodgeListingProvider>
  );
};

export default lodgingListPage;
