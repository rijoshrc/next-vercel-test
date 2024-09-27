import { ImageType } from "@/type/media";
import Image from "next/image";
import Link from "next/link";

type FooterRIghtColProps = {
  logos: ImageType[];
  heading: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;
  linkedInUrl?: string;
  instagramUrl?: string;
};

const FooterRIghtCol: React.FC<FooterRIghtColProps> = ({
  logos,
  heading,
  description,
  address,
  email,
  phone,
  youtubeUrl,
  twitterUrl,
  facebookUrl,
  instagramUrl,
}) => {
  return (
    <div className="col-sm">
      <div className="footer__textgroup">
        <div className="footer__top-heading">{heading}</div>

        <ul className="footer__links">
          <li>{description}</li>
        </ul>

        <span>{address}</span>

        <span>
          <strong>{email}</strong>
          <strong>Tel.: {phone}</strong>
        </span>

        <ul className="footer__links social__icons">
          {facebookUrl ? (
            <li>
              <Link href={facebookUrl} title="Facebook" target="_blank">
                <FBIcon />
              </Link>
            </li>
          ) : null}

          {instagramUrl ? (
            <li>
              <Link href={instagramUrl} title="Instagram" target="_blank">
                <InstaIcon />
              </Link>
            </li>
          ) : null}

          {youtubeUrl ? (
            <li>
              <Link href={youtubeUrl} title="Youtube" target="_blank">
                <YoutubeIcon />
              </Link>
            </li>
          ) : null}

          {twitterUrl ? (
            <li>
              <Link href={twitterUrl} title="Twitter" target="_blank">
                <TwitterIcon />
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
      <div className="pe-richsnippets"></div>
      <figure className="expert-seal">
        <a
          href="https://www.provenexpert.com/meer-und-hus/?utm_source=Widget&amp;utm_medium=Widget&amp;utm_campaign=Widget"
          target="_blank"
          title="Erfahrungen &amp; Bewertungen zu meer und hus anzeigen"
        >
          {/* @PropertyHelper.OptimizeStaticImage("https://images.provenexpert.com/c3/89/1e17cca182e6b743511d321d62ce/widget_landscape_160_de_1.png",
      true, "Bewertungssiegel von ProvenExpert", width: 160, height:
      133) */}
        </a>
      </figure>

      <figure className="happy__icon">
        {logos.length
          ? logos.map((logo) => (
              <Image
                src={logo.url}
                alt={logo.name}
                width={195}
                height={82}
                key={logo.id}
                priority
                fetchPriority="high"
              />
            ))
          : null}
      </figure>
    </div>
  );
};

export default FooterRIghtCol;

const FBIcon = () => (
  <svg
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    width="60.734px"
    height="60.733px"
    viewBox="0 0 60.734 60.733"
    xmlSpace="preserve"
  >
    <g>
      <path
        d="M57.378,0.001H3.352C1.502,0.001,0,1.5,0,3.353v54.026c0,1.853,1.502,3.354,3.352,3.354h29.086V37.214h-7.914v-9.167h7.914
v-6.76c0-7.843,4.789-12.116,11.787-12.116c3.355,0,6.232,0.251,7.071,0.36v8.198l-4.854,0.002c-3.805,0-4.539,1.809-4.539,4.462
v5.851h9.078l-1.187,9.166h-7.892v23.52h15.475c1.852,0,3.355-1.503,3.355-3.351V3.351C60.731,1.5,59.23,0.001,57.378,0.001z"
      />
    </g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
  </svg>
);

const InstaIcon = () => (
  <svg
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 512 512"
    xmlSpace="preserve"
  >
    <g>
      <g>
        <path
          d="M363.273,0H148.728C66.719,0,0,66.719,0,148.728v214.544C0,445.281,66.719,512,148.728,512h214.544
C445.281,512,512,445.281,512,363.273V148.728C512,66.719,445.281,0,363.273,0z M472,363.272C472,423.225,423.225,472,363.273,472
H148.728C88.775,472,40,423.225,40,363.273V148.728C40,88.775,88.775,40,148.728,40h214.544C423.225,40,472,88.775,472,148.728
V363.272z"
        />
      </g>
    </g>
    <g>
      <g>
        <path
          d="M256,118c-76.094,0-138,61.906-138,138s61.906,138,138,138s138-61.906,138-138S332.094,118,256,118z M256,354
c-54.037,0-98-43.963-98-98s43.963-98,98-98s98,43.963,98,98S310.037,354,256,354z"
        />
      </g>
    </g>
    <g>
      <g>
        <circle cx="396" cy="116" r="20" />
      </g>
    </g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
  </svg>
);

const YoutubeIcon = () => (
  <svg
    className="youtube"
    fill="#000000"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 50"
    width="100px"
    height="100px"
  >
    <path d="M 24.402344 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.402344 16.898438 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.902344 40.5 17.898438 41 24.5 41 C 31.101563 41 37.097656 40.5 40.597656 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.097656 35.5 C 45.5 33 46 29.402344 46.097656 24.902344 C 46.097656 20.402344 45.597656 16.800781 45.097656 14.300781 C 44.699219 12.101563 42.800781 10.5 40.597656 10 C 37.097656 9.5 31 9 24.402344 9 Z M 24.402344 11 C 31.601563 11 37.398438 11.597656 40.199219 12.097656 C 41.699219 12.5 42.898438 13.5 43.097656 14.800781 C 43.699219 18 44.097656 21.402344 44.097656 24.902344 C 44 29.199219 43.5 32.699219 43.097656 35.199219 C 42.800781 37.097656 40.800781 37.699219 40.199219 37.902344 C 36.597656 38.601563 30.597656 39.097656 24.597656 39.097656 C 18.597656 39.097656 12.5 38.699219 9 37.902344 C 7.5 37.5 6.300781 36.5 6.101563 35.199219 C 5.300781 32.398438 5 28.699219 5 25 C 5 20.398438 5.402344 17 5.800781 14.902344 C 6.101563 13 8.199219 12.398438 8.699219 12.199219 C 12 11.5 18.101563 11 24.402344 11 Z M 19 17 L 19 33 L 33 25 Z M 21 20.402344 L 29 25 L 21 29.597656 Z" />
  </svg>
);

const TwitterIcon = () => (
  <svg
    className="twitter"
    fill="#000000"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 50"
    width="100px"
    height="100px"
  >
    <path d="M 50.0625 10.4375 C 48.214844 11.257813 46.234375 11.808594 44.152344 12.058594 C 46.277344 10.785156 47.910156 8.769531 48.675781 6.371094 C 46.691406 7.546875 44.484375 8.402344 42.144531 8.863281 C 40.269531 6.863281 37.597656 5.617188 34.640625 5.617188 C 28.960938 5.617188 24.355469 10.21875 24.355469 15.898438 C 24.355469 16.703125 24.449219 17.488281 24.625 18.242188 C 16.078125 17.8125 8.503906 13.71875 3.429688 7.496094 C 2.542969 9.019531 2.039063 10.785156 2.039063 12.667969 C 2.039063 16.234375 3.851563 19.382813 6.613281 21.230469 C 4.925781 21.175781 3.339844 20.710938 1.953125 19.941406 C 1.953125 19.984375 1.953125 20.027344 1.953125 20.070313 C 1.953125 25.054688 5.5 29.207031 10.199219 30.15625 C 9.339844 30.390625 8.429688 30.515625 7.492188 30.515625 C 6.828125 30.515625 6.183594 30.453125 5.554688 30.328125 C 6.867188 34.410156 10.664063 37.390625 15.160156 37.472656 C 11.644531 40.230469 7.210938 41.871094 2.390625 41.871094 C 1.558594 41.871094 0.742188 41.824219 -0.0585938 41.726563 C 4.488281 44.648438 9.894531 46.347656 15.703125 46.347656 C 34.617188 46.347656 44.960938 30.679688 44.960938 17.09375 C 44.960938 16.648438 44.949219 16.199219 44.933594 15.761719 C 46.941406 14.3125 48.683594 12.5 50.0625 10.4375 Z" />
  </svg>
);
