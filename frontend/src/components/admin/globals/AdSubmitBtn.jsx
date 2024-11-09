import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

const AdSubmitBtn = ({ addClass, isLoading, text }) => {
  return (
    <Button
      type="submit"
      className={`${
        addClass || `w-full my-8`
      } uppercase tracking-widest disabled:opacity-60`}
      disabled={isLoading}
    >
      <span className="flex flex-row justify-center items-center gap-3">
        {isLoading && <LoaderCircle size={16} className="animate-spin" />}
        {text}
      </span>
    </Button>
  );
};
export default AdSubmitBtn;
