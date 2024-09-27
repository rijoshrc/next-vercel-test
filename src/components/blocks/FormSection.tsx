"use client";

import contentApi from "@/constants/contentApi";
import httpClient from "@/services/api/httpClient";
import { BlockSettings } from "@/type/content";
import { generateBlockClassNames } from "@/utils/fns";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const FormRenderer = dynamic(() => import("../compound/form/FormRenderer"));

// import "../../styles/scss/utilities/style.css";

type FormPageProps = {
  contentBlock: {
    content: {
      contentType: string;
      id: string;
      properties: {
        backgroundColor: any[];
        fontColor: string;
        form: {
          form: any;
          id: string;
        };
        heading: string | null;
        headingFont: string | null;
        headingTag: string | null;
      };
    };
    settings: BlockSettings;
  };
};

const FormSection: React.FC<FormPageProps> = ({ contentBlock }) => {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const formId = contentBlock.content.properties.form.id as string;

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get(contentApi.form + formId);
      setFormData(response);
    } catch (error) {
      console.error("Failed to fetch form data", error);
    } finally {
      setLoading(false);
    }
  };

  if (!formData) {
    return null;
  }

  // Extract necessary data for the form renderer
  const formFields = formData.pages[0].fieldsets[0].columns[0].fields;

  const { settings } = contentBlock;

  return (
    <section
      id={settings.properties.anchorName}
      className={`section section__form ${generateBlockClassNames(
        settings.properties
      )} ${settings.properties.customCssClass} ${loading && "loading"}`}
    >
      <div className="container">
        <div className="umbraco-forms-form">
          <h1>{formData.name}</h1>
          <FormRenderer
            formFields={formFields}
            indicator={formData.indicator}
            messageOnSubmit={formData.messageOnSubmit}
            formId={formId}
          />
        </div>
      </div>
    </section>
  );
};

export default FormSection;
