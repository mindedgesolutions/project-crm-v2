import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CModalStatus = ({ lead }) => {
  let title = "";

  if (!lead.lstatus[0].uid) {
    title = "no update yet";
  } else if (lead.lstatus.length <= 5) {
    title = `last ${lead.lstatus.length} updates`;
  } else {
    title = `total ${lead.lstatus.length} updates`;
  }

  return (
    <div className="p-2">
      <div className="bg-muted p-1 pl-2 flex flex-row justify-between items-center">
        <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium">
          {title}
        </span>
        <Link to={`#`}>
          <Button
            type="button"
            variant={`outline`}
            className="h-auto p-2 px-3 uppercase text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            view all
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default CModalStatus;
