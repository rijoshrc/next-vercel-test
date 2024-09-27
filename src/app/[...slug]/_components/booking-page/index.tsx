"use client";

import React, { useState } from "react";
import AddressBar from "../shared/AddressBar";
import BookingForm from "./BookingForm";
import Modal from "./Modal";

interface BookingPageProps {
  data: {
    contentType: string;
    nodeId: number;
    bookingAgencyName: string;
    bookingAgencyPhone: string;
    serviceInformationText: string | null;
    name: string;
    createDate: string;
    updateDate: string;
    route: {
      path: string;
      startItem: { id: string; path: string };
    };
    id: string;
    properties: {
      metaTitle: string | null;
      metaDescription: string | null;
      metaOgImage: string | null;
      metaNoIndex: boolean;
      hideFromSitemap: boolean;
      customBodyClass: string | null;
      redirectToPage: string | null;
      headerScripts: string | null;
      footerScripts: string | null;
      errorMessage: {
        markup: string;
        blocks: any[];
      };
    };
    facilitiesFromFilter: any;
    facilities: any;
    cultures: Record<string, any>;
  };
}

const BookingPage: React.FC<BookingPageProps> = ({ data }) => {
  const [show, setShow] = useState<boolean>(false);

  const { bookingAgencyName } = data;

  return (
    <section className="section__booking">
      <BookingForm setError={setShow} />
      <Modal
        message={data.properties.errorMessage.markup}
        show={show}
        setShow={setShow}
      />
    </section>
  );
};

export default BookingPage;
