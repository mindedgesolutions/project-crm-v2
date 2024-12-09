import customFetch from "@/utils/customFetch";
import { splitErrors } from "@/utils/splitErrors";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SkeletonTableRow from "@/components/SkeletonTableRow";
import dayjs from "dayjs";

const CLeadAssignHistory = () => {
  const { lead } = useLoaderData();
  const [reassigns, setReassigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(
        `/company/single-lead-reassigns/${lead.id}`
      );
      setIsLoading(false);
      setReassigns(response?.data?.data?.rows || []);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-1 border border-muted">
      <div className="bg-muted p-2 flex flex-row justify-start items-start gap-2">
        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          re-assign history
        </span>
      </div>
      <div className="p-2">
        <Table>
          <TableHeader>
            <TableRow className="text-muted-foreground text-xs font-light">
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <SkeletonTableRow />
                </TableCell>
              </TableRow>
            ) : reassigns.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-xs uppercase text-muted-foreground"
                >
                  NO DATA FOUND
                </TableCell>
              </TableRow>
            ) : (
              reassigns?.map((value, index) => {
                return (
                  <TableRow key={index} className="group text-muted-foreground">
                    <TableCell className="text-xs">{value.from_name}</TableCell>
                    <TableCell className="text-xs">{value.to_name}</TableCell>
                    <TableCell>
                      {dayjs(value.created_at).format(
                        "dddd, MMMM D, YYYY h:mm A"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default CLeadAssignHistory;
