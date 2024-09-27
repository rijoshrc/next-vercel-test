import { useFavorite } from "@/lib/context/FavoriteContext";
import { Link as LinkType } from "@/type/link";
import Link from "next/link";

type FavoriteBtnProps = {
  link: LinkType;
};

const FavoriteBtn: React.FC<FavoriteBtnProps> = ({ link }) => {
  const { favoriteList } = useFavorite();
  return (
    <Link href={link.route.path} aria-label={link.title} id="topfav-btn-mobile">
      <span
        className={`saved-btn ${
          favoriteList.length > 0 ? "saved-btn-hover" : ""
        }`}
        id="topfav-btn-mobile"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12.93"
          height="11.688"
          viewBox="0 0 12.93 11.688"
        >
          <path
            fill="#fff"
            stroke="#212529"
            strokeWidth="1.5px"
            d="M10.319-15.568a3.052 3.052 0 0 0-4.165.3l-.44.453-.44-.453a3.052 3.052 0 0 0-4.165-.3 3.205 3.205 0 0 0-.221 4.641l4.319 4.46a.7.7 0 0 0 1.011 0l4.319-4.46a3.2 3.2 0 0 0-.218-4.641z"
            transform="translate(0.751 17.189)"
          />
        </svg>
      </span>
    </Link>
  );
};

export default FavoriteBtn;
