import Link from "next/link";

type PhoneLabelProps = {
  phone: string;
};

const PhoneLabel: React.FC<PhoneLabelProps> = ({ phone }) => {
  return (
    <label>
      Persönlich für Sie da!
      <Link href={"tel:" + phone}>
        <strong>{phone}</strong>
      </Link>
    </label>
  );
};

export default PhoneLabel;
