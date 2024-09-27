import lodginApi from "@/constants/lodgingApi";
import { useEffect, useState } from "react";
import {
  BookingFormType,
  BookingItems,
  Extra,
  FormState,
} from "../_types/booking";
import { useRouter, useSearchParams } from "next/navigation";

interface ValidationState {
  [key: string]: boolean;
}

const useBookingForm = () => {
  const [bookingForm, setBookingForm] = useState<BookingFormType>();
  const [bookingItems, setBookingItems] = useState<BookingItems>();
  const [loading, setLoading] = useState(false);
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [dipartureDate, setDepartureDate] = useState<Date>();
  const [totalPrice, setTotalPrice] = useState<string>("");
  const [couponCodeError, setCouponCodeError] = useState<string>("");
  const [couponCodes, setCouponCodes] = useState<string[]>([]);
  const [validationState, setValidationState] = useState<ValidationState>({});

  const router = useRouter();

  // form state
  const [formState, setFormState] = useState<FormState>({
    Adults: "0",
    Pets: "0",
    Children: "0",
    AcceptPolicy: false,
    AcceptTerms: false,
    SubscribedToNewsletter: false,
    Notes: "",
    FirstName: "",
    LastName: "",
    Street: "",
    PostCode: "",
    City: "",
    Country: "",
    Phone: "",
    Email: "",
    WhereDidYouHearAboutUs: "",
    insurance: "0",
  });
  const [extrasState, setExtrasState] = useState<{
    [key: string]: number | boolean;
  }>({});

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchBookingForm();
    fetchBookingItems();
  }, []);

  useEffect(() => {
    if (Object.keys(extrasState).length > 0) {
      fetchCalculatePrice();
    }
  }, [
    extrasState,
    formState.insurance,
    formState.Adults,
    formState.Children,
    formState.Pets,
  ]);

  useEffect(() => {
    const adults = searchParams.get("person") || "1";
    const startdate = searchParams.get("startdate");
    const pets = searchParams.get("pets") || "0";
    const duration = searchParams.get("duration") || "7";

    // set arrival date
    if (startdate) {
      // parse date
      const dateString = startdate.split(".");
      const date = new Date(
        `${dateString[2]}.${dateString[1]}.${dateString[0]}`
      );
      setArrivalDate(date);
      setDepartureDate(
        new Date(date.getTime() + parseInt(duration) * 24 * 60 * 60 * 1000)
      );
    }

    setFormState({
      ...formState,
      Adults: adults,
      Pets: pets,
    });
  }, [searchParams]);

  const fetchBookingForm = async () => {
    try {
      setLoading(true);
      const resp = await fetch(
        `${lodginApi.getBookingForm}?${searchParams.toString()}`
      );
      const data = (await resp.json()) as BookingFormType;
      setBookingForm(data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingItems = async () => {
    try {
      setLoading(true);

      const adults = searchParams.get("person") || "2";
      const pets = searchParams.get("pets") || "0";
      const houseid = searchParams.get("houseid");
      const startdate = searchParams.get("startdate");
      const duration = searchParams.get("duration") || "7";

      const resp = await fetch(
        `${lodginApi.getBookingItems}?adults=${adults}&arrivalDate=${startdate}&children=${formState.Children}&duration=${duration}&lodgingId=${houseid}&pets=${pets}`
      );
      const data = (await resp.json()) as BookingItems;

      setBookingItems(data);
      setTotalPrice(data.totalPrice);
      const extras = generateExtrasState(data.extras);
      setExtrasState(extras);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const fetchCalculatePrice = async () => {
    try {
      setLoading(true);
      const startdate = searchParams.get("startdate");
      const duration = searchParams.get("duration") || "0";
      const houseid = searchParams.get("houseid");

      const resp = await fetch(
        `${lodginApi.getCalculatedPrice}?adults=${
          formState.Adults
        }&arrivalDate=${startdate}&children=${
          formState.Children
        }&duration=${duration}&lodgingId=${houseid}&pets=${
          formState.Pets
        }&insurance=${formState.insurance}&items=${JSON.stringify(extrasState)}`
      );

      const data = await resp.text();
      setTotalPrice(data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const validateCoupon = async (code: string) => {
    try {
      setCouponCodeError("");

      // validate multiple coupons
      if (couponCodes.length > 0) {
        setCouponCodeError("Cannot apply multiple coupons.");
        return false;
      }

      const resp = await fetch(lodginApi.validateCoupon + `?code=${code}`);
      if (resp.ok) {
        const data = await resp.json();
        setCouponCodes((codes) => [...codes, code]);
        return true;
      } else {
        const data = await resp.text();
        setCouponCodeError(data);
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  const deleteCoupon = () => {
    setCouponCodes([]);
    setCouponCodeError("");
  };

  const validateField = (name: string, value: string): boolean => {
    let isValid = true;

    switch (name) {
      case "FirstName":
      case "LastName":
      case "Street":
      case "City":
      case "PostCode":
        // General required field validation
        isValid = value.trim() !== "";
        break;

      case "Country":
        // Required and should not be the default value
        isValid = value.trim() !== "";
        break;

      case "Phone":
        // Required and must match the phone number pattern
        isValid = value.trim() !== "" && /^[\d\s\-+]+$/.test(value);
        break;

      case "Email":
        // Required and must be a valid email format
        isValid =
          value.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;

      case "AcceptTerms":
        // @ts-ignore
        isValid = value === true;
        break;
      case "AcceptPolicy":
        // @ts-ignore
        isValid = value === true;
        break;

      default:
        // No validation required for optional fields like WhereDidYouHearAboutUs
        break;
    }

    // Update validation state
    setValidationState((prevState) => ({ ...prevState, [name]: !isValid }));

    return isValid;
  };

  const validateForm = (): boolean => {
    let isFormValid = true;
    Object.keys(formState).forEach((field) => {
      // @ts-ignore
      const isValid = validateField(field, formState[field as keyof FormState]);
      if (!isValid) {
        isFormValid = false;
      }
    });
    return isFormValid;
  };

  const restValidationState = (name: string, value: string) => {
    setValidationState((prevState) => ({
      ...prevState,
      [name]: false,
    }));
  };

  const submitForm = async () => {
    const Duration = searchParams.get("duration");
    const LodgingId = searchParams.get("houseid");
    const StartDate = formattedDate(searchParams.get("startdate"));
    const AvailableDate = bookingForm?.availableDate || null;
    const CouponIds = couponCodes.join(",");
    const ProfileName = bookingForm?.profileName || null;
    const ProfileUrl = bookingForm?.profileUrl || null;
    const ProfilePhone = bookingForm?.profilePhone || null;
    const BookingAgencyName = bookingForm?.bookingAgencyName || null;

    let extras: any = {};
    Object.keys(extrasState).map((key) => {
      const extra = { [`e-${key}`]: extrasState[key] };
      extras = { ...extras, ...extra };
    });

    const formData = {
      ...formState,
      Duration,
      LodgingId,
      StartDate,
      AvailableDate,
      CouponIds,
      ProfileName,
      ProfileUrl,
      ProfilePhone,
      BookingAgencyName,
      ...extras,
    };

    const data = convertToFormData(formData);

    try {
      setLoading(true);
      const resp = await fetch(lodginApi.postBooking, {
        method: "POST",
        body: data,
      });
      const respData = await resp.text();
      // redirect to recepit page
      router.push(respData);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return {
    bookingForm,
    bookingItems,
    loading,
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
  };
};

export default useBookingForm;

const generateExtrasState = (extras: Extra[]) => {
  const extraForm: { [key: string]: number | boolean } = {};
  extras.forEach((extra) => {
    extraForm[`${extra.apiId}`] = 0;
  });
  return extraForm;
};

const convertToFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    // Handle arrays separately (e.g., CouponIds)
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(key, item);
      });
    } else {
      formData.append(key, value);
    }
  });

  return formData;
};

const formattedDate = (date: string | null) => {
  if (!date) {
    return null;
  }
  const dateString = date.split(".");
  return `${dateString[2]}.${dateString[1]}.${dateString[0]}T00:00:00`;
};
