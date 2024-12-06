import { useRouteError } from "react-router-dom";
import { CFooter } from "@/components";
import { ScrollArea } from "@/components/ui/scroll-area";

const CError = () => {
  const error = useRouteError();
  document.title = `${error.statusText} | ${import.meta.env.VITE_APP_TITLE}`;

  return (
    <div className="flex gap-0 md:gap-1">
      <ScrollArea className="h-screen w-full">
        {error.status === 404 && <p>Page not found</p>}
        {error.status === 403 && <p>Forbidden</p>}
        <CFooter />
      </ScrollArea>
    </div>
  );
};
export default CError;
