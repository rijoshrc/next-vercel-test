import lodginApi from "@/constants/lodgingApi";
import useOutsideClick from "@/lib/hooks/useOutsideClick";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface SearchResult {
  name: string;
  url: string;
}

const SearchBar = () => {
  // keep the flag for the search bar
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
    <div
      className={`search__bar ${isSearchBarOpen && "active"}`}
      ref={searchBarRef}
    >
      <div className="input__wrapper">
        <input
          className="form-control"
          type="text"
          name="search"
          onChange={(e) => setSearchText(e.target.value)}
          ref={searchInputRef}
          value={searchText}
        />

        <button
          type="button"
          className="searchbar-btn"
          aria-label="Search"
          title="Search"
          onClick={() => setIsSearchBarOpen((open) => !open)}
        >
          <i className="icon-search"></i>
        </button>
      </div>

      <div
        className={`autocomplete__results ${
          !isSearchBarOpen || results.length <= 0 ? "d-none" : ""
        }`}
      >
        <div className="placeholder">
          <span>Results</span>
          <div className="placeholder__link">
            <Link href={`/ferienhaeuser/?searchText=${searchText}`}>
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
              <i className="icon-chevron-right"></i>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchBar;
