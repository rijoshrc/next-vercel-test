import Image from "next/image";

type AdvancedFilterControllProps = {
  showAdvancedFilter: boolean;
  setShowAdvancedFilter: (show: boolean | ((prev: boolean) => boolean)) => void;
  showHouseNumberSearch: boolean;
  setShowHouseNumberSearch: (
    show: boolean | ((prev: boolean) => boolean)
  ) => void;
};

const AdvancedFilterControll: React.FC<AdvancedFilterControllProps> = ({
  showAdvancedFilter,
  setShowAdvancedFilter,
  showHouseNumberSearch,
  setShowHouseNumberSearch,
}) => {
  return (
    <div className="search-toolbar">
      <div className="toolbar-left">
        <div id="search-advanced" className="search-expander">
          <Image
            className="add-icon"
            src="/images/_global/add.webp"
            alt=""
            onClick={() => setShowAdvancedFilter((show) => !show)}
            height={14}
            width={14}
          />
          <Image
            className="minus-icon"
            src="/images/_global/minus.svg"
            alt=""
            onClick={() => setShowAdvancedFilter((show) => !show)}
            height={14}
            width={14}
          />
          <span onClick={() => setShowAdvancedFilter((show) => !show)}>
            {showAdvancedFilter
              ? "Suchoptonen schließen"
              : "Suchoptionen anzeigen"}
          </span>
        </div>
        <div
          id="search-housenumber"
          className={`search-expander ${showHouseNumberSearch && "d-none"}`}
        >
          <Image
            className="add-icon"
            src="/images/_global/add.webp"
            alt=""
            onClick={() => setShowHouseNumberSearch((show) => !show)}
            height={14}
            width={14}
          />
          <span onClick={() => setShowHouseNumberSearch((show) => !show)}>
            Hausnummer-Suche
          </span>
        </div>
      </div>

      <div className="toolbar-right">
        <span className="sortby">
          <select name="sort" className="form-control">
            <option value="default">Sortieren nach</option>
            <option value="price">Preis</option>
            <option value="address">Adresse</option>
            <option value="area">Gebiete</option>
            <option value="m2">m²</option>
            <option value="rating">Bewertung</option>
          </select>
        </span>
      </div>
    </div>
  );
};

export default AdvancedFilterControll;
