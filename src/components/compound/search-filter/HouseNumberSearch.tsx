import lodginApi from "@/constants/lodgingApi";
import { URLEncode } from "@/utils/fns";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type HouseNumberSearchProps = {
  show: boolean;
  setShow: (show: boolean | ((prev: boolean) => boolean)) => void;
};

const placeholderParams: Record<string, string> = {
  area: "alle-gebiete",
  startdate: "Kein Datum",
  duration: "7",
  person: "2",
  page: "1",
  itemsperpage: "10",
  aproxy: "true",
  bedrooms: "1",
  bathrooms: "1",
};

const HouseNumberSearch: React.FC<HouseNumberSearchProps> = ({
  show,
  setShow,
}) => {
  const searchParams = useSearchParams();

  const [searchText, setSearchText] = useState<string>(
    searchParams.has("searchText")
      ? (searchParams.get("searchText") as string)
      : ""
  );
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchText && searchText.trim() !== "") {
        fetchData(searchText);
      } else {
        setResults([]);
      }
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const fetchData = async (query: string) => {
    try {
      const resp = await fetch(`${lodginApi.searchHouseNumber}?query=${query}`);
      const data = await resp.json();
      setResults(data.items);
    } catch (e) {
      setResults([]);
    }
  };

  const searchResults = (
    <div className="autocomplete__results">
      <div className="placeholder">
        <span>Summer House Results:</span>

        <div className="placeholder__link">
          <Link
            href={`/ferienhaeuser?${URLEncode(
              placeholderParams
            )}&searchText=${searchText}`}
            onClick={() => setShow(false)}
          >
            Zeige verfügbare Häuser
          </Link>
          <i className="icon-chevron-right"></i>
        </div>
      </div>
      <ul>
        {results.map((result: any) => (
          <li key={result.id}>
            <Link
              href={result.url}
              dangerouslySetInnerHTML={{ __html: result.name }}
            />
            <i className="icon-chevron-right"></i>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className={`search__housenumber--component ${show && "extended"}`}>
      <div className="container">
        <span>Hausnummer-Suche:</span>
        <div className="input__wrapper--container">
          {results.length > 0 ? searchResults : null}
          <div className="input__wrapper">
            <input
              placeholder="Search"
              type="search"
              className="search-field form-control"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
          </div>
        </div>

        <div
          className="close-searcher"
          title="Close Search Field"
          onClick={() => setShow(false)}
        >
          <Image
            src="/images/svg/close-btn.svg"
            alt="close"
            height={17}
            width={17}
          />
        </div>
      </div>
    </div>
  );
};

export default HouseNumberSearch;
