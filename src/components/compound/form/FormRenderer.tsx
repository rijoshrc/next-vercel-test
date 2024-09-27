import contentApi from "@/constants/contentApi";
import httpClient from "@/services/api/httpClient";
import { parseISO } from "date-fns";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import {
  GoogleReCaptcha,
  GoogleReCaptchaProvider,
} from "react-google-recaptcha-v3";

type FormField = {
  alias: string;
  caption: string;
  required: boolean;
  requiredErrorMessage: string;
  pattern?: string;
  patternInvalidErrorMessage?: string;
  type: {
    name: string;
    renderInputType: string;
  };
  preValues?: Array<{ value: string }>;
  settings?: any;
  cssClass?: string;
};

type FormProps = {
  formFields: FormField[];
  submitLabel?: string;
  indicator: string;
  messageOnSubmit: string;
  formId: string;
};

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const FormRenderer: React.FC<FormProps> = ({
  formFields,
  submitLabel,
  indicator,
  messageOnSubmit,
  formId,
}) => {
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSubmitMessage, setShowSubmitMessage] = useState(false);
  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
  const [token, setToken] = useState("");

  const handleChange = (alias: string, value: string) => {
    setFormValues({ ...formValues, [alias]: value });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    formFields.forEach((field) => {
      const value = formValues[field.alias] || "";
      if (field.required && !value) {
        newErrors[field.alias] = field.requiredErrorMessage;
      }
      if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
        newErrors[field.alias] =
          field.patternInvalidErrorMessage || "Invalid format";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderField = (field: FormField) => {
    switch (field.type.name) {
      case "Short answer":
        return renderTextField(field);
      case "Long answer":
        return renderTextAreaField(field);
      case "Date":
        return renderDatePicker(field);
      case "Checkbox":
        return renderCheckBox(field);
      // case "File upload":
      //   return renderFileUpload(field);
      case "Password":
        return renderPasswordField(field);
      case "Multiple choice":
        return renderCheckBoxList(field);
      case "Data Consent":
        return renderDataConsent(field);
      case "Dropdown":
        return renderDropdown(field);
      case "Single choice":
        return renderRadioButtonList(field);
      case "Title and description":
        return renderTitleAndDescription(field);
      // case "Rich text":
      //   return renderRichText(field);
      case "Hidden":
        return renderHiddenField(field);
      case "reCAPTCHA v2":
        return renderRecaptcha2(field);
      case "reCAPTCHA v3 with score":
        return renderRecaptcha3(field);
      default:
        return null;
    }
  };

  // Text Field (Short answer)
  const renderTextField = (field: FormField) => (
    <div key={field.alias} className="form-group">
      <label htmlFor={field.alias}>{field.caption}</label>
      {renderIndicator(field.required)}
      <input
        type="text"
        name={field.alias}
        id={field.alias}
        className="form-control"
        value={formValues[field.alias] || ""}
        onChange={(e) => handleChange(field.alias, e.target.value)}
      />
      {errors[field.alias] && (
        <p style={{ color: "red" }}>{errors[field.alias]}</p>
      )}
    </div>
  );

  // Text Area (Long answer)
  const renderTextAreaField = (field: FormField) => (
    <div key={field.alias} className="form-group">
      <label htmlFor={field.alias}>{field.caption}</label>
      {renderIndicator(field.required)}
      <textarea
        className="form-control"
        name={field.alias}
        id={field.alias}
        rows={field.settings?.numberOfRows || 5}
        value={formValues[field.alias] || ""}
        onChange={(e) => handleChange(field.alias, e.target.value)}
      />
      {errors[field.alias] && (
        <p style={{ color: "red" }}>{errors[field.alias]}</p>
      )}
    </div>
  );

  // Date Picker
  const renderDatePicker = (field: FormField) => (
    <div key={field.alias} className="form-group">
      <label htmlFor={field.alias}>{field.caption}</label>
      {renderIndicator(field.required)}
      <DatePicker
        selected={
          formValues[field.alias] ? parseISO(formValues[field.alias]) : null
        }
        onChange={(date) =>
          handleChange(field.alias, date ? date.toISOString() : "")
        }
        className="form-control"
        placeholderText={field.settings?.placeholder || ""}
        dateFormat={field.settings?.dateFormat || "yyyy-MM-dd"} // You can customize the date format
      />
      {errors[field.alias] && (
        <p style={{ color: "red" }}>{errors[field.alias]}</p>
      )}
    </div>
  );

  // Checkbox
  const renderCheckBox = (field: FormField) => (
    <div key={field.alias} className="form-group">
      <input
        type="checkbox"
        name={field.alias}
        id={field.alias}
        value="true"
        checked={formValues[field.alias] === "true"}
        onChange={(e) =>
          handleChange(field.alias, e.target.checked ? "true" : "false")
        }
        className={`form-control ${
          errors[field.alias] && "input-validation-error"
        }`}
      />
      <input type="hidden" name={field.alias} value="false" />
      {field.caption && <label htmlFor={field.alias}>{field.caption}</label>}
    </div>
  );

  // File Upload
  const renderFileUpload = (field: FormField) => (
    <div key={field.alias} className="form-group">
      <label htmlFor={field.alias}>{field.caption}</label>
      {renderIndicator(field.required)}
      <input
        type="file"
        name={field.alias}
        id={field.alias}
        className="form-control"
        // onChange={(e) => handleChange(field.alias, e.target.files)}
      />
      {errors[field.alias] && (
        <p style={{ color: "red" }}>{errors[field.alias]}</p>
      )}
    </div>
  );

  // Password Field
  const renderPasswordField = (field: FormField) => (
    <div key={field.alias} className="form-group">
      <label htmlFor={field.alias}>{field.caption}</label>
      {renderIndicator(field.required)}
      <input
        type="password"
        name={field.alias}
        id={field.alias}
        className="form-control"
        value={formValues[field.alias] || ""}
        onChange={(e) => handleChange(field.alias, e.target.value)}
      />
      {errors[field.alias] && (
        <p style={{ color: "red" }}>{errors[field.alias]}</p>
      )}
    </div>
  );

  // CheckBoxList (Multiple choice)
  const renderCheckBoxList = (field: FormField) => (
    <div key={field.alias} className="form-group">
      {field.preValues?.map((preValue, idx) => (
        <span key={idx} className="checkboxlist">
          <input
            type="checkbox"
            name={field.alias}
            value={preValue.value}
            checked={formValues[field.alias]?.includes(preValue.value)}
            onChange={(e) => {
              const currentValues = formValues[field.alias] || [];
              const updatedValues = e.target.checked
                ? // @ts-ignore
                  [...currentValues, preValue.value]
                : // @ts-ignore
                  currentValues.filter((v: string) => v !== preValue.value);
              handleChange(field.alias, updatedValues);
            }}
          />
          <label>{preValue.value}</label>
        </span>
      ))}
    </div>
  );

  // Data Consent
  const renderDataConsent = (field: FormField) => (
    <div key={field.alias} className="form-group">
      <label htmlFor={field.alias}>{field.caption}</label>
      {renderIndicator(field.required)}
      <div>
        <input
          type="checkbox"
          name={field.alias}
          id={field.alias}
          value="on"
          checked={formValues[field.alias] === "on"}
          onChange={(e) =>
            handleChange(field.alias, e.target.checked ? "on" : "false")
          }
          className={`${errors[field.alias] && "input-validation-error"}`}
        />
        <input type="hidden" name={field.alias} value="false" />
        <label
          htmlFor={field.alias}
          dangerouslySetInnerHTML={{
            __html: field.settings?.acceptCopy || field.caption,
          }}
        />
      </div>
    </div>
  );

  // Dropdown Field
  const renderDropdown = (field: FormField) => (
    <div key={field.alias} className="form-group">
      <label htmlFor={field.alias}>{field.caption}</label>
      {renderIndicator(field.required)}
      <select
        name={field.alias}
        id={field.alias}
        className="form-control"
        value={formValues[field.alias] || ""}
        onChange={(e) => handleChange(field.alias, e.target.value)}
      >
        <option value="">Select an option</option>
        {field.preValues?.map((preValue, idx) => (
          <option key={idx} value={preValue.value}>
            {preValue.value}
          </option>
        ))}
      </select>
      {errors[field.alias] && (
        <p style={{ color: "red" }}>{errors[field.alias]}</p>
      )}
    </div>
  );

  // RadioButton List (Single choice)
  const renderRadioButtonList = (field: FormField) => (
    <div key={field.alias} className="form-group radiobuttonlist">
      {field.preValues?.map((preValue, idx) => (
        <div key={idx}>
          <input
            type="radio"
            name={field.alias}
            id={`${field.alias}_${idx}`}
            value={preValue.value}
            checked={formValues[field.alias] === preValue.value}
            onChange={(e) => handleChange(field.alias, e.target.value)}
          />
          <label htmlFor={`${field.alias}_${idx}`}>{preValue.value}</label>
        </div>
      ))}
    </div>
  );

  // Title and Description
  const renderTitleAndDescription = (field: FormField) => (
    <div key={field.alias} className="form-group">
      <h2>{field.caption}</h2>
      {field.settings?.description && <p>{field.settings.description}</p>}
    </div>
  );

  // Rich Text
  const renderRichText = (field: FormField) => (
    <div key={field.alias} className="form-group">
      <div
        dangerouslySetInnerHTML={{ __html: field.settings?.richText || "" }}
      />
    </div>
  );

  // Hidden Field
  const renderHiddenField = (field: FormField) => (
    <input
      type="hidden"
      name={field.alias}
      id={field.alias}
      value={formValues[field.alias] || ""}
    />
  );

  // reCAPTCHA v2
  const renderRecaptcha2 = (field: FormField) => (
    <div key={field.alias} className="form-group">
      <script
        src="https://www.google.com/recaptcha/api.js"
        async
        defer
      ></script>
      <div className="g-recaptcha" data-sitekey={recaptchaSiteKey}></div>
    </div>
  );

  // reCAPTCHA v3 with score
  const renderRecaptcha3 = (field: FormField) => (
    <div key={field.alias} className="form-group">
      <input type="hidden" id={field.alias} name="g-recaptcha-response" />
      {/* Add custom Recaptcha v3 logic here */}
      <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey || ""}>
        <GoogleReCaptcha
          onVerify={setToken}
          refreshReCaptcha={refreshReCaptcha}
        />
      </GoogleReCaptchaProvider>
    </div>
  );

  const renderIndicator = (showIndicator?: boolean) =>
    showIndicator ? (
      <span className="umbracoForms-Indicator">{indicator}</span>
    ) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = {
      values: { ...formValues, "g-recaptcha-response": token },
    };

    try {
      const resp = httpClient.post(contentApi.postForm + formId, {
        body: formData,
      });
      setShowSubmitMessage(true);
    } catch (e) {
      setRefreshReCaptcha(!refreshReCaptcha);
    }
  };

  if (showSubmitMessage) {
    return <p className="success-message">{messageOnSubmit}</p>;
  }

  return (
    <form
      className="umbraco-forms-page form-horizontal"
      onSubmit={handleSubmit}
    >
      <fieldset className="umbraco-forms-fieldset">
        {formFields.map((field) => renderField(field))}
      </fieldset>
      <div className="umbraco-forms-navigation row-fluid">
        <div className="col-sm-10 col-sm-offset-2">
          <input
            type="submit"
            className="btn btn-primary"
            value={submitLabel || "Submit"}
          />
        </div>
      </div>
    </form>
  );
};

export default FormRenderer;
