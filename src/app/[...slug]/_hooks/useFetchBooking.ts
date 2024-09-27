import lodginApi from "@/constants/lodgingApi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BookingFilter } from "../_components/lodging/types";
import { formatDate } from "@/utils/dateHelper";
import { URLEncode } from "@/utils/fns";

export interface PriceBreakdown {
  name: string;
  price: string;
  id: number;
  priceValue: number;
}

export interface AdditionalCost {
  name: string;
  price: string;
  id: number;
  priceValue: number;
}

export type Upgrade = {
  duration: number;
  durationText: string;
  id: string;
  price: string;
};

export interface Booking {
  id?: string;
  price?: string;
  arrival?: string;
  departure?: string;
  priceBreakdown?: PriceBreakdown[];
  additionalCosts?: AdditionalCost[];
  upgrades?: Upgrade[];
  status?: "Available" | "NotAvailable" | "CannotBookToday";
}

const useFetchBooking = (nodeId: number) => {
  const [booking, setBooking] = useState<Booking>();
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState<boolean>();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const bookingFilter: BookingFilter = useMemo(() => {
    const startdate = searchParams.get("startdate") || "";
    const duration = searchParams.get("duration") || "7";
    const person = searchParams.has("persons")
      ? searchParams.get("persons")
      : searchParams.get("person") || "2";
    const pets = searchParams.get("pets") || "0";
    return {
      startdate,
      duration,
      person: person || "2",
      pets,
    };
  }, [searchParams]);

  useEffect(() => {
    async function call() {
      const dates = await fetchAvailableDates();
      validateParams(dates);
    }
    call();
  }, [bookingFilter.duration]);

  const setBookingFilter = (key: keyof BookingFilter, value: any) => {
    const filter = { ...bookingFilter, [key]: value };
    updateQuery(filter);
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingFilter]);

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const resp = await fetch(
        `${lodginApi.getBooking}?${new URLSearchParams(
          bookingFilter
        )}&nodeId=${nodeId}`
      );
      const data = await resp.json();
      setBooking(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDates = async () => {
    const response = await fetch(
      `${lodginApi.availableDates}?duration=${bookingFilter.duration}&umbracoNodeId=${nodeId}`
    );
    const data = await response.json();
    const dates = data.map((date: string) => new Date(date));
    if (dates.length > 0) {
      setAvailableDates(dates);
      return dates;
    } else {
      setAvailableDates([]);
      return [];
    }
  };

  const validateParams = (dates: Date[]) => {
    let params = {} as any;
    if (
      !searchParams.has("startdate") ||
      searchParams.get("startdate")?.trim() === ""
    ) {
      params["startdate"] = formatDate(dates[0]);
    }

    if (
      !searchParams.has("duration") ||
      searchParams.get("duration")?.trim() === ""
    ) {
      params["duration"] = "7";
    }

    if (
      !searchParams.has("person") ||
      searchParams.get("person")?.trim() === ""
    ) {
      params["person"] = searchParams.get("persons") || "2";
    }

    if (!searchParams.has("pets") || searchParams.get("pets")?.trim() === "") {
      params["pets"] = "0";
    }

    updateQuery({
      ...bookingFilter,
      ...params,
    });
  };

  const setDuration = (duration: string) => {
    updateQuery({
      ...bookingFilter,
      duration,
    });
  };

  const updateQuery = (params: any) => {
    const newUrlParams = URLEncode(params).toString();
    const newUrl = `${pathname}?${newUrlParams}`;
    router.replace(newUrl, { scroll: false });
  };

  return {
    booking,
    bookingFilter,
    availableDates,
    setBookingFilter,
    setDuration,
    loading,
  };
};

export default useFetchBooking;
