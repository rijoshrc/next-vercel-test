"use client";

import { format } from "date-fns";
import { de } from "date-fns/locale";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReceiptProps } from "../../_types/receipt";
import dynamic from "next/dynamic";

const AddressBar = dynamic(() => import("../shared/AddressBar"));
const ImageSlider = dynamic(() => import("../shared/ImageSlider"));

type Props = {
  data: ReceiptProps;
};

const ReceiptPage = ({ data }: Props) => {
  const { booking, bookingAgencyName } = data;
  const router = useRouter();

  const petsMaxText =
    booking.lodgingName && booking.maxPets > 0
      ? `, ${booking.maxPets} Tiere`
      : "";
  const hasCoupon = booking.couponMessages && booking.couponMessages.length > 0;

  //   TODO: update this to a 404 page
  if (!booking) {
    return (
      <section className="section__booking mt-5">
        <div className="booking_widget">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2>Invalid Booking Id</h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const onAddressBarClose = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(booking.lodgingPageUrl);
  };

  return (
    <section className="section__booking" id="receipt-details">
      <AddressBar
        address={`${booking.lodgingName} ${booking.address1}`}
        onClick={onAddressBarClose}
      />

      <div className="booking__widget">
        <div className="container">
          <div className="row">
            <div className="col-5">
              <div className="widget__item widget__item--result">
                <div className="title">Reisedaten</div>

                <div className="item__row">
                  <div className="label">Anreise:</div>
                  <div className="value">
                    {booking.bookingOption?.arrival
                      ? format(booking.bookingOption.arrival, "dd. MMMM yyyy", {
                          locale: de,
                        })
                      : ""}
                  </div>
                </div>

                <div className="item__row">
                  <div className="label">Abreise:</div>
                  <div className="value">
                    {booking.bookingOption?.departure
                      ? format(
                          booking.bookingOption.departure,
                          "dd. MMMM yyyy",
                          {
                            locale: de,
                          }
                        )
                      : ""}
                  </div>
                </div>

                <div className="item__row">
                  <div className="label">Das Büro:</div>
                  <div className="value">{bookingAgencyName}</div>
                </div>
              </div>

              <div className="widget__item widget__item--result">
                <div className="title">
                  Anzahl (max. {booking.maxPerson} Personen{petsMaxText})
                </div>

                <div className="item__row">
                  <div className="label">Erwachsene:</div>
                  <div className="value value__sm">
                    <strong>{booking.entity.adults}</strong>
                  </div>
                </div>

                <div className="item__row">
                  <div className="label">Kinder:</div>
                  <div className="value value__sm">
                    <strong>{booking.entity.children}</strong>
                  </div>
                </div>

                <div className="item__row">
                  <div className="label">Anzahl Haustiere:</div>
                  <div className="value value__sm">
                    <strong>{booking.entity.pets}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-7">
              <ImageSlider images={booking.images} />
            </div>
          </div>
        </div>
      </div>

      <div className="booking__widget">
        <div className="container">
          <div className="row">
            <div className={`col-${hasCoupon ? "6" : "12"}`}>
              <div className="widget__item widget__item--lg widget__item--result widget__item--information">
                <div className="title">Kundeninformation</div>
                <div className="item__row">
                  <div className="label">Vorname:</div>
                  <div className="value">
                    <strong>{booking.entity.firstName}</strong>
                  </div>
                </div>
                <div className="item__row">
                  <div className="label">Nachname:</div>
                  <div className="value">
                    <strong>{booking.entity.lastName}</strong>
                  </div>
                </div>
                <div className="item__row">
                  <div className="label">Straße:</div>
                  <div className="value">
                    <strong>{booking.entity.street}</strong>
                  </div>
                </div>
                <div className="item__row">
                  <div className="label">PLZ / Stadt:</div>
                  <div className="value">
                    <strong>
                      {booking.entity.postCode} {booking.entity.city}
                    </strong>
                  </div>
                </div>
                <div className="item__row">
                  <div className="label">Land:</div>
                  <div className="value">
                    <strong>{booking.entity.isoCountry}</strong>
                  </div>
                </div>
                <div className="item__row">
                  <div className="label">Tel./Mobil:</div>
                  <div className="value">
                    <strong>{booking.entity.phone}</strong>
                  </div>
                </div>
                <div className="item__row">
                  <div className="label">Email:</div>
                  <div className="value">
                    <strong>{booking.entity.email}</strong>
                  </div>
                </div>
                <div className="item__row">
                  <div className="label">Newsletter:</div>
                  <div className="value">
                    <strong>
                      {booking.entity.subscribedToNewsletter ? "Ja" : "Nein"}
                    </strong>
                  </div>
                </div>
                <div className="item__row">
                  <div className="label">Notizen/Kommentare:</div>
                  <div className="value">
                    <strong>{booking.entity.customerNotes}</strong>
                  </div>
                </div>
              </div>
            </div>

            {hasCoupon && (
              <div className="col-6">
                <div className="widget__item minheight-250">
                  <div className="form__wrapper">
                    <div className="title">Rabattkode</div>
                    <div className="item__row item__row--couponslists">
                      {booking.couponMessages.map((coupon, index) => (
                        <div key={index}>
                          <div className="coupon-item">
                            <span>{coupon}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Extras */}
      {booking.extras && booking.extras.length > 0 && (
        <div className="booking__widget">
          <div className="container">
            <div className="widget__item widget__item--lg widget__item--result">
              <div className="title">Bestellen Sie Extras</div>
              {booking.extras.map((extra, index) => (
                <div key={index} className="item__row flex">
                  <div className="label label__lg">
                    {extra.name}
                    <span className="highlight">
                      (
                      {extra.price.toLocaleString("de-DE", {
                        style: "currency",
                        currency: "EUR",
                      })}
                      )
                    </span>
                  </div>
                  <div className="value value__sm">
                    <strong>{extra.quantity}</strong>
                  </div>
                  <div className="value value__sm">
                    <strong>
                      {extra.totalPrice.toLocaleString("de-DE", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insurance */}
      {booking.insurance && (
        <div className="booking__widget">
          <div className="container">
            <div className="row">
              <div className="col-6">
                <div className="widget__item widget__item--result">
                  <div className="title">Versicherung</div>
                  <div className="item__row flex">
                    <div className="label">
                      {booking.insurance.name}
                      <span className="highlight">
                        (
                        {booking.insurance.price.toLocaleString("de-DE", {
                          style: "currency",
                          currency: "EUR",
                        })}
                        )
                      </span>
                    </div>
                    <div className="value">
                      <strong>
                        {booking.insurance.totalPrice.toLocaleString("de-DE", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Items */}
              <div className="col-6">
                <div className="widget__item widget__item--result">
                  <div className="title">Vorgeschrieben</div>
                  {booking.requiredItems.map((item, index) => (
                    <div key={index} className="item__row">
                      <div className="label">{item.name}</div>
                      <div className="value">
                        <strong>{item.totalPriceFormatted}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Total Price */}
      <div className="booking__widget">
        <div className="container">
          <div className="widget__item widget__item--lg widget__item--result">
            <div className="item__row flex">
              <div className="total">
                Gesamtpreis: <strong>{booking.totalPrice}</strong>
              </div>
              <button
                type="button"
                className="button__icon no-print"
                id="printReceipt"
                data-target="#receipt-details"
                onClick={() => window.print()}
              >
                <span>Drucken</span>
                <span>
                  <Image
                    className="icon"
                    src="/images/svg/print-icon.svg"
                    alt="Print"
                    width={19}
                    height={19}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReceiptPage;
