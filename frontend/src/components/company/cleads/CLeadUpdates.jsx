import { CSingleLeadModal } from "@/pages";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

const CLeadUpdates = () => {
  const { lead } = useLoaderData();
  const [isLoading, setIsLoading] = useState(false);
  const [updates, setUpdates] = useState([]);

  const fetchData = async () => {};

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-1 border border-muted">
      <div className="bg-muted p-2 flex flex-row justify-between items-center gap-2">
        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          lead updates
        </span>
        <CSingleLeadModal editId={lead.id} page={"details"} />
      </div>
      <div className="p-2"></div>
    </div>
  );
};
export default CLeadUpdates;
