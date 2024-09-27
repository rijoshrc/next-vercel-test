import { Lodging, LodgingApiResponse } from "@/app/[...slug]/_components/types";
import lodginApi from "@/constants/lodgingApi";
import { createContext, useContext, useState } from "react";

type LodgeListingContextProps = {
  items: Lodging[];
  loading: boolean;
  hasMore: boolean;
  fetchData: (queryParams: string, append?: boolean) => Promise<void>;
  totalItems: number | undefined;
};

const LodgeListingContext = createContext<LodgeListingContextProps | undefined>(
  undefined
);

export const LodgeListingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<Lodging[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>();

  const fetchData = async (queryParams: string, append: boolean = false) => {
    setLoading(true);
    try {
      const url = `${
        lodginApi.lodgeList
      }?${queryParams}&initialSearch=${!append}`;
      const res = await fetch(url);
      const data: LodgingApiResponse = await res.json();
      if (append) {
        setItems((items) => [...items, ...data.items]);
      } else {
        setItems(data.items);
        setTotalItems(data.totalItems);
      }

      data.items.length > 0 ? setHasMore(true) : setHasMore(false);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <LodgeListingContext.Provider
      value={{ items, loading, fetchData, hasMore, totalItems }}
    >
      {children}
    </LodgeListingContext.Provider>
  );
};

export const useLodging = () => {
  const context = useContext(LodgeListingContext);
  if (context === undefined) {
    return {
      loading: false,
      fetchData: async () => {},
      items: [],
      totalItems: undefined,
    };
  }
  const { loading, fetchData, items, hasMore, totalItems } = context;
  return { loading, fetchData, items, hasMore, totalItems };
};
