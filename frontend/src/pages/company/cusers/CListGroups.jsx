import {
  AdContentWrapper,
  CAddEditGroupModal,
  CDeleteGroup,
  CGroupPopover,
  SkeletonTableRow,
} from "@/components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import customFetch from "@/utils/customFetch";
import { splitErrors } from "@/utils/splitErrors";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CListGroups = () => {
  document.title = `List of Groups | ${import.meta.env.VITE_APP_TITLE}`;
  const { coGroups } = useSelector((store) => store.coUsers);
  const [groups, setGroups] = useState(coGroups || []);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { counter } = useSelector((store) => store.common);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(`/company/groups`);
      setGroups(response.data.data.rows);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(true);
      if (error?.response?.status === 401) {
        splitErrors(error?.response?.data?.msg);
        navigate(`/`);
      } else {
        splitErrors(error?.response?.data?.msg);
      }
      return null;
    }
  };

  useEffect(() => {
    fetchData();
  }, [coGroups, counter]);

  return (
    <AdContentWrapper>
      <div className="flex flex-row justify-between items-center bg-muted my-4 p-2">
        <h3 className="font-bold text-xl tracking-widest text-muted-foreground">
          List of Groups
        </h3>
        <CAddEditGroupModal btnClass={`capitalize tracking-wider`} />
      </div>
      <div className="my-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Sl. No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Members</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <SkeletonTableRow />
                </TableCell>
              </TableRow>
            ) : groups.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-xs uppercase"
                >
                  NO DATA FOUND
                </TableCell>
              </TableRow>
            ) : (
              groups?.map((group, index) => {
                const descLabel =
                  group.short_desc.length > 30
                    ? group.short_desc.substring(0, 30) + ` ...`
                    : group.short_desc;

                return (
                  <TableRow key={group.id} className="group text-xs uppercase">
                    <TableCell className="font-medium">{index + 1}.</TableCell>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p>{descLabel}</p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{group.short_desc}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row justify-start items-center gap-2">
                        <span>{group.details.total_users}</span>
                        <span>
                          <CGroupPopover users={group.details.users} />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col justify-end items-center md:flex-row space-y-1 md:gap-8">
                        <CAddEditGroupModal editId={group.id} />
                        <CDeleteGroup id={group.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </AdContentWrapper>
  );
};
export default CListGroups;
