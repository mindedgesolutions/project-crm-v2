import { Badge } from "@/components/ui/badge";
import customFetch from "./customFetch";
import { splitErrors } from "./splitErrors";
import CryptoJS from "crypto-js";

// ------
export const adUserBadge = (type) => {
  switch (type) {
    case "Super Admin":
      return <Badge className="text-[10px] bg-primary/80">{type}</Badge>;

    default:
      return (
        <Badge className="text-[10px] bg-muted-foreground/90">{type}</Badge>
      );
  }
};

// ------
export const activeBadge = (status) => {
  switch (status) {
    case true:
      return <Badge className="text-[10px] bg-primary/80">Active</Badge>;

    case false:
      return (
        <Badge className="text-[10px] bg-muted-foreground/90">Inactive</Badge>
      );
  }
};

// ------
export const tenureBadge = (tenure) => {
  switch (tenure) {
    case 1:
      return <Badge className="text-[10px] bg-primary/80">monthly</Badge>;
    case 3:
      return <Badge className="text-[10px] bg-primary/80">quarterly</Badge>;
    case 12:
      return (
        <Badge className="text-[10px] bg-muted-foreground/90">yearly</Badge>
      );
  }
};

// ------
export const serialNo = (page) => {
  const srno = !page || page <= 1 ? 1 : (page - 1) * 10 + 1;
  return srno;
};

// Re: Pagination starts ------
export const constructUrl = ({ pageNumber, search, pathname }) => {
  const searchParams = new URLSearchParams(search);
  searchParams.set("page", pageNumber.toString());
  return `${pathname}?${searchParams.toString()}`;
};

export const constructPrevOrNext = ({
  curretPage,
  pageCount,
  search,
  pathname,
}) => {
  let prevPage = curretPage - 1;
  if (prevPage < 1) prevPage = 1;
  const prevUrl = constructUrl({ pageNumber: prevPage, search, pathname });

  let nextPage = curretPage + 1;
  if (nextPage > pageCount) nextPage = pageCount;
  const nextUrl = constructUrl({ pageNumber: nextPage, search, pathname });

  return { prevUrl, nextUrl };
};
// Re: Pagination ends ------

export const currencyFormat = () => {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    // minimumFractionDigits: 2, // Ensures two decimal places
    minimumFractionDigits: 0, // Ensures two decimal places
  });
  return formatter;
};

// ------
export const namePrefix = (name) => {
  const arr = name.split(" ");
  const pref =
    arr[0].substring(0, 1).toUpperCase() + arr[1].substring(0, 1).toUpperCase();

  return pref;
};

// ------
export const checkLoginStatus = async () => {
  try {
    const status = await customFetch.get(`/auth/login-status`);
    return status.data.status;
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    return error;
  }
};

// ------
export const encParam = (value) => {
  return encodeURIComponent(
    CryptoJS.AES.encrypt(value, import.meta.env.VITE_ENC_KEY).toString()
  );
};

export const decParam = (value) => {
  const data = CryptoJS.AES.decrypt(value, import.meta.env.VITE_ENC_KEY);

  return data.toString(CryptoJS.enc.Utf8);
};
