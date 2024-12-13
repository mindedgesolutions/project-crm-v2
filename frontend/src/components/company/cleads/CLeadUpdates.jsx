import { CUpdateCard } from "@/components";
import { CSingleLeadModal } from "@/pages";
import customFetch from "@/utils/customFetch";
import { splitErrors } from "@/utils/splitErrors";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

const CLeadUpdates = () => {
  const { lead } = useLoaderData();
  const [isLoading, setIsLoading] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [allUpdates, setAllUpdates] = useState(false);
  const [showUpdates, setShowUpdates] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(
        `/company/single-lead-updates/${lead.id}`
      );
      setUpdates(response.data.data.rows);
      setShowUpdates(response.data.data.rows.slice(0, 3));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  const setShowResults = () => {
    const showAll = !allUpdates;
    setAllUpdates(showAll);
    const results = showAll ? updates : updates.slice(0, 3);
    setShowUpdates(results);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-1 border border-muted">
      <div className="bg-muted p-2 flex flex-row justify-between items-center gap-2">
        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          lead updates ({allUpdates ? `all updates` : `last 3 updates`}){" "}
          <button
            className="text-red-500 ml-1 hover:underline"
            onClick={setShowResults}
          >
            {allUpdates ? `Show last 3 updates` : `Show all updates`}
          </button>
        </span>
        <CSingleLeadModal leadInfo={lead} editId={lead.id} page={"details"} />
      </div>
      <div className="p-2">
        {updates.length === 0 ? (
          <div className="text-muted-foreground text-sm uppercase p-2 bg-muted/50">
            no update available
          </div>
        ) : (
          showUpdates.map((update, index) => {
            const bgColor =
              index % 2 === 0 ? `bg-muted/40` : `bg-muted-foreground/10`;

            return (
              <CUpdateCard key={nanoid()} update={update} bgColor={bgColor} />
            );
          })
        )}
      </div>
    </div>
  );
};
export default CLeadUpdates;
