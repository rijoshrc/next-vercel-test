import Link from "next/link";

type PhoneBtnProps = {
  phone: string;
};

const PhoneBtn: React.FC<PhoneBtnProps> = ({ phone }) => {
  return (
    <Link href={"tel:" + phone} className="phone-btn" aria-label="Call Us">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12.009"
        height="12"
        viewBox="0 0 12.009 12"
      >
        <path
          d="M9.22 12.033a2.779 2.779 0 0 0 2.694-3.45c-.076-.257-.145-.626-.46-.675l-3.905-.615a.4.4 0 0 0-.358.126 2.72 2.72 0 0 0-.479.734 5.9 5.9 0 0 1-2.828-2.828c.319-.182.89-.389.86-.838L4.129.582C4.082.27 3.709.2 3.46.124A2.76 2.76 0 0 0 0 2.8a9.255 9.255 0 0 0 9.22 9.233zM1.377 1.408a1.957 1.957 0 0 1 2-.478l.544 3.456c-.3.3-1.12.241-.942.839a6.659 6.659 0 0 0 3.833 3.836.4.4 0 0 0 .529-.28 1.847 1.847 0 0 1 .31-.663l3.456.545a1.974 1.974 0 0 1-1.885 2.57 8.361 8.361 0 0 1-5.954-2.464A8.362 8.362 0 0 1 .8 2.8a1.945 1.945 0 0 1 .573-1.389z"
          transform="translate(-0.002 -0.034)"
        />
      </svg>
    </Link>
  );
};

export default PhoneBtn;
