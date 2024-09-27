import lodginApi from "@/constants/lodgingApi";
import useOutsideClick from "@/lib/hooks/useOutsideClick";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface SearchResult {
  name: string;
  url: string;
}

const MobileSearchBar = () => {
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);

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
      const resp = await fetch(`${lodginApi.pageSearch}?query=${query}`);
      const data = (await resp.json()) as {
        contentPages: SearchResult[];
        housePages: SearchResult[];
      };
      setResults([...data.contentPages, ...data.housePages]);
    } catch (e) {
      setResults([]);
    }
  };

  // use the ref to handle the outside click event for the search bar
  const searchBarRef = useRef<HTMLDivElement>(null);
  // reference to the search input
  const searchInputRef = useRef<HTMLInputElement>(null);

  // on opening the search bar, focus the cursor in the input
  useEffect(() => {
    isSearchBarOpen && searchInputRef.current?.focus();
  }, [isSearchBarOpen]);

  // on clicking the outside of the search section, close it
  useOutsideClick(searchBarRef, () => {
    setIsSearchBarOpen(false);
    setResults([]);
    setSearchText("");
  });

  return (
    <div className="input__wrapper" ref={searchBarRef}>
      <input
        className="form-control"
        type="text"
        name="search"
        onChange={(e) => setSearchText(e.target.value)}
        ref={searchInputRef}
        value={searchText}
      />

      <div
        className={`autocomplete__results ${
          results.length <= 0 ? "d-none" : ""
        }`}
      >
        <div className="">
          <div className="placeholder">
            <span>Results</span>

            <div className="placeholder__link">
              <Link href={`/ferienhaeuser?search=${searchText}`}>
                Zeige verfügbare Häuser
              </Link>
              <i className="icon-chevron-right"></i>
            </div>
          </div>
          <ul>
            {results.map((result) => (
              <li key={result.url}>
                <Link
                  href={result.url}
                  dangerouslySetInnerHTML={{ __html: result.name }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MobileSearchBar;
