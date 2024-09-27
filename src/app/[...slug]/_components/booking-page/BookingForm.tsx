import { format } from "date-fns";
import { de } from "date-fns/locale";
import React, { useRef, useState } from "react";
import useBookingForm from "../../_hooks/useBookingForm";
import ImageSlider from "../shared/ImageSlider";
import Extras from "./Extas";
import AddressBar from "../shared/AddressBar";
import { useRouter } from "next/navigation";

interface Image {
  url: string;
  altText: string;
}

interface LodgingPage {
  id: number;
  lodgingName: string;
  address1: string;
  maxPerson: number;
  maxPets: number;
  images: Image[];
}

interface BookingFormProps {
  setError: (error: boolean) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ setError }) => {
  const {
    loading,
    bookingForm,
    bookingItems,
    formState,
    setFormState,
    arrivalDate,
    dipartureDate,
    extrasState,
    setExtrasState,
    totalPrice,
    validateCoupon,
    couponCodeError,
    couponCodes,
    deleteCoupon,
    validateForm,
    validationState,
    restValidationState,
    submitForm,
  } = useBookingForm();

  const router = useRouter();

  const couponCodeRef = useRef<HTMLInputElement>(null);

  const maxPersonText = bookingForm?.maxPerson
    ? `Max. ${bookingForm?.maxPerson} Personen`
    : "";
  const maxPetsText = bookingForm?.maxPets
    ? `, ${bookingForm?.maxPets} Tiere`
    : "";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
    restValidationState(name, value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
    restValidationState(name, value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormState({
      ...formState,
      [name]: checked,
    });
    restValidationState(name, value);
  };

  const handleInsuranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCodeRef.current && couponCodeRef.current?.value.trim() !== "") {
      const isValid = await validateCoupon(couponCodeRef.current.value);
      if (!isValid) return;

      couponCodeRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the entire form
    const isFormValid = validateForm();

    if (isFormValid) {
      submitForm();
    } else {
      setError(true);
      document.body.classList.add("modal-open");
    }
  };

  const onAddressBarClose = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.back();
  };

  return (
    <>
      <AddressBar
        address={bookingForm?.address1 || ""}
        onClick={onAddressBarClose}
      />
      <form id="bookingForm" onSubmit={handleSubmit}>
        <div className="booking__widget">
          <div className="container">
            <div className="row">
              <div className="col-5">
                <div className={`widget__item ${loading && "loading"}`}>
                  <div className="title">Reisedaten</div>
                  <div className="item__row">
                    <div className="label">Anreise:</div>
                    <div className="value">
                      {arrivalDate
                        ? format(arrivalDate, "dd. MMMM yyyy", { locale: de })
                        : ""}
                    </div>
                  </div>
                  <div className="item__row">
                    <div className="label">Abreise:</div>
                    <div className="value">
                      {dipartureDate
                        ? format(dipartureDate, "dd. MMMM yyyy", { locale: de })
                        : ""}
                    </div>
                  </div>
                  <div className="item__row">
                    <div className="label">Das Büro:</div>
                    <div className="value">
                      {bookingForm?.bookingAgencyName}
                    </div>
                  </div>
                </div>

                <div className={`widget__item ${loading && "loading"}`}>
                  <div className="title">
                    Anzahl ({maxPersonText}
                    {maxPetsText})
                  </div>

                  <div className="item__row">
                    <div className="label">Erwachsene:</div>
                    <div className="value">
                      <input
                        type="number"
                        name="Adults"
                        className="form-control"
                        value={formState?.Adults || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="item__row">
                    <div className="label">Kinder:</div>
                    <div className="value">
                      <input
                        type="number"
                        name="Children"
                        className="form-control"
                        value={formState?.Children || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {bookingForm?.maxPets ||
                    (0 > parseInt(formState.Pets) && (
                      <div className="item__row">
                        <div className="label">Anzahl Haustiere:</div>
                        <div className="value">
                          <input
                            type="number"
                            name="Pets"
                            className="form-control"
                            value={formState.Pets || ""}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="col-7">
                <ImageSlider images={bookingForm?.images || []} />
              </div>
            </div>
          </div>
        </div>

        <div className="booking__widget">
          <div className="container">
            <div className="row">
              <div className="col-6">
                <div className="widget__item widget__item--lg widget__item--narrow">
                  <div className="form__wrapper">
                    <div className="title">Kundeninformation</div>
                    <div className="item__row">
                      <div className="label">Vorname: *</div>
                      <div className="value">
                        <input
                          type="text"
                          name="FirstName"
                          className={`form-control ${
                            validationState.FirstName
                              ? "input-validation-error"
                              : ""
                          }`}
                          value={formState.FirstName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="item__row">
                      <div className="label">Nachname: *</div>
                      <div className="value">
                        <input
                          type="text"
                          name="LastName"
                          className={`form-control ${
                            validationState.LastName
                              ? "input-validation-error"
                              : ""
                          }`}
                          value={formState.LastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="item__row">
                      <div className="label">Straße: *</div>
                      <div className="value">
                        <input
                          type="text"
                          name="Street"
                          className={`form-control ${
                            validationState.Street
                              ? "input-validation-error"
                              : ""
                          }`}
                          value={formState.Street}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="item__row">
                      <div className="label">PLZ / Stadt: *</div>
                      <div className="value flex">
                        <div className="field__sm">
                          <input
                            type="text"
                            name="PostCode"
                            className={`form-control ${
                              validationState.PostCode
                                ? "input-validation-error"
                                : ""
                            }`}
                            value={formState.PostCode}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="field__md">
                          <input
                            type="text"
                            name="City"
                            className={`form-control ${
                              validationState.City
                                ? "input-validation-error"
                                : ""
                            }`}
                            value={formState.City}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="item__row">
                      <div className="label">Land: *</div>
                      <div className="value">
                        <select
                          name="Country"
                          className={`form-control ${
                            validationState.Country
                              ? "input-validation-error"
                              : ""
                          }`}
                          value={formState.Country || ""}
                          onChange={handleSelectChange}
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          {bookingForm?.countryList
                            .filter((country) => !country.disabled)
                            .map((country) => (
                              <option key={country.value} value={country.value}>
                                {country.text}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="item__row">
                      <div className="label">Tel./Mobil: *</div>
                      <div className="value">
                        <input
                          type="text"
                          name="Phone"
                          className={`form-control ${
                            validationState.Phone
                              ? "input-validation-error"
                              : ""
                          }`}
                          value={formState.Phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="item__row">
                      <div className="label">Email: *</div>
                      <div className="value">
                        <input
                          type="email"
                          name="Email"
                          className={`form-control ${
                            validationState.Email
                              ? "input-validation-error"
                              : ""
                          }`}
                          value={formState.Email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="item__row">
                      <div className="label">
                        Wie wurden Sie auf uns aufmerksam?
                      </div>
                      <div className="value">
                        <select
                          name="WhereDidYouHearAboutUs"
                          className="form-control"
                          value={formState.WhereDidYouHearAboutUs}
                          onChange={handleSelectChange}
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          {bookingForm?.whereDidYouHearAboutUsList.map(
                            (option) => (
                              <option key={option.value} value={option.value}>
                                {option.text}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="widget__item minheight-250">
                  <div className="form__wrapper">
                    <div className="title">Newsletter</div>
                    <div className="item__row item__row--checkbox">
                      <div className="label">
                        Ich möchte gerne den Newsletter von meer und hus mit
                        Angeboten über Ferienhäuser und Reisetipps erhalten
                      </div>
                      <div className="value">
                        <input
                          type="checkbox"
                          name="SubscribedToNewsletter"
                          id="SubscribedToNewsletter"
                          className="form-control"
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor="SubscribedToNewsletter">Ja</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="widget__item minheight-250">
                  <div className="form__wrapper">
                    <div className="title">Rabatt-Code</div>
                    <div className="item__row item__row--coupon">
                      <input
                        type="text"
                        className="form-control"
                        name="rabattcode"
                        placeholder="Rabatt-Code / Coupon Code"
                        ref={couponCodeRef}
                      />
                      <input
                        type="button"
                        className="button"
                        value="Einlösen"
                        onClick={handleCouponSubmit}
                      />
                      {/* <input
                      type="hidden"
                      name="couponIds"
                      value={formState.couponIds?.join(",")}
                    /> */}
                    </div>

                    <div className="item__row item__row--couponslists">
                      {couponCodes.map((code, index) => (
                        <div className="coupon-item" key={index}>
                          <span
                            className="delete"
                            onClick={() => deleteCoupon()}
                          ></span>
                          <span>{code}</span>
                        </div>
                      ))}
                    </div>

                    <div className="item__row">
                      <div className="help-text error">{couponCodeError}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="booking__widget">
          <div className="container">
            <div className="widget__item widget__item--lg">
              <div className="form__wrapper">
                <div className="title">Notizen/Kommentare</div>
                <div className="item__row">
                  <textarea
                    name="Notes"
                    className="form-control"
                    placeholder="Hier können Sie uns gerne etwas mitteilen"
                    rows={4}
                    value={formState.Notes}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>
            {/* Extras */}
            {bookingItems?.extras?.length && bookingItems.extras.length > 0 && (
              <div
                className={`widget__item widget__item--lg ${
                  loading && "loading"
                }`}
              >
                <div className="form__wrapper">
                  <div className="title">Bestellen Sie Extras</div>

                  <div className="row">
                    <div className="col-6">
                      <Extras
                        items={bookingItems.extras.slice(
                          0,
                          Math.floor(bookingItems.extras.length / 2)
                        )}
                        setExtrasState={setExtrasState}
                        extrasState={extrasState}
                      />
                    </div>

                    <div className="col-6">
                      <Extras
                        items={bookingItems.extras.slice(
                          Math.floor(bookingItems.extras.length / 2)
                        )}
                        setExtrasState={setExtrasState}
                        extrasState={extrasState}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {bookingItems?.insuranceOptions?.length &&
          bookingItems.insuranceOptions.length > 0 && (
            <div className="booking__widget">
              <div className="container">
                <div className="row">
                  <div className="col-6">
                    <div
                      className={`widget__item widget__item--lg ${
                        loading && "loading"
                      }`}
                    >
                      <div className="form__wrapper">
                        <div className="title">Versicherung</div>
                        <div className="item__row item__row--radio">
                          {bookingItems?.insuranceOptions.map((item) => (
                            <div className="align-left" key={item.apiId}>
                              <div className="custom-radio rdio-primary">
                                <input
                                  type="radio"
                                  className="form-control"
                                  name="insurance"
                                  id={`i-${item.apiId}`}
                                  value={item.apiId}
                                  onChange={handleInsuranceChange}
                                />
                                <label htmlFor={`i-${item.apiId}`}>
                                  {item.name}{" "}
                                  <span className="highlight">
                                    ({item.price})
                                  </span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className={`widget__item ${loading && "loading"}`}>
                      <div className="title">Vorgeschrieben</div>
                      {bookingItems?.requiredItems.map((item, index) => (
                        <div className="item__row" key={index}>
                          <div className="label">{item.key}</div>
                          <div className="value">
                            <strong>{item.value}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        <div className="booking__widget">
          <div className="container">
            <div
              className={`widget__item widget__item--lg ${
                loading && "loading"
              }`}
            >
              <div className="form__wrapper">
                <div className="title">Buchung bestätigen</div>
                <div className="row">
                  <div className="col-6">
                    <div className="item__row item__row--radio">
                      <div className="align-left mb-3">
                        <input
                          type="checkbox"
                          name="AcceptTerms"
                          id="AcceptTerms"
                          className={`form-control ${
                            validationState.AcceptTerms
                              ? "input-validation-error"
                              : ""
                          }`}
                          checked={formState.AcceptTerms}
                          onChange={handleCheckboxChange}
                          required
                        />
                        <label htmlFor="AcceptTerms"></label>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: bookingForm?.acceptTermsText || "",
                          }}
                        />
                      </div>
                      <div className="align-left">
                        <input
                          type="checkbox"
                          name="AcceptPolicy"
                          id="AcceptPolicy"
                          className={`form-control ${
                            validationState.AcceptPolicy
                              ? "input-validation-error"
                              : ""
                          }`}
                          checked={formState.AcceptPolicy}
                          onChange={handleCheckboxChange}
                          required
                        />
                        <label htmlFor="AcceptPolicy"></label>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: bookingForm?.acceptTermsText || "",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="total">
                      Gesamtpreis: <strong>{totalPrice}</strong>
                    </div>
                    <input
                      type="submit"
                      className="button"
                      value="Buchung senden"
                      onClick={handleSubmit}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default BookingForm;

// receipt url
// https://www.meerundhus.de/booking/receipt/?id=d61a9996-9086-4b61-b8cb-6d474a185aa5
