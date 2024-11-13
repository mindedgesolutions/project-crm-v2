import {
  AdContentWrapper,
  PaginationContainer,
  SkeletonTableRow,
} from "@/components";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import customFetch from "@/utils/customFetch";
import { adUserBadge, serialNo } from "@/utils/functions";
import { splitErrors } from "@/utils/splitErrors";
import dayjs from "dayjs";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

const CListLeads = () => {
  document.title = `Leads | ${import.meta.env.VITE_APP_TITLE}`;
  const [leads, setLeads] = useState([]);
  const [meta, setMeta] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { search } = useLocation();
  const queryString = new URLSearchParams(search);
  const page = queryString.get("page");
  const navigate = useNavigate();
  const { currentUser } = useSelector((store) => store.currentUser);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(`/company/leads`);
      setLeads(response.data.data.rows);
      setMeta(response.data.meta);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(true);
      console.log(error);
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
  }, [page, queryString.get("type"), queryString.get("search")]);

  return (
    <AdContentWrapper>
      <div className="flex flex-row justify-between items-center bg-muted my-4 p-2">
        <h3 className="font-semibold text-sm tracking-widest text-muted-foreground">
          List of CSV Uploads
        </h3>
        <div className="flex justify-end items-center gap-4">
          <Link to={`/app/${currentUser.cslug}/leads/upload-csv`}>
            <Button className="capitalize tracking-wider h-8 w-auto px-3 text-xs">
              add lead
            </Button>
          </Link>
          <Link to={`/app/${currentUser.cslug}/leads/upload-csv`}>
            <Button className="capitalize tracking-wider h-8 w-auto px-3 text-xs">
              upload CSV
            </Button>
          </Link>
        </div>
      </div>
      <div className="my-4">
        <Table>
          <TableHeader>
            <TableRow className="text-muted-foreground">
              <TableHead className="w-[100px]">Sl. No.</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>CSV Date</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Uploaded At</TableHead>
              <TableHead>Records</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <SkeletonTableRow />
                </TableCell>
              </TableRow>
            ) : leads.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-xs uppercase text-muted-foreground"
                >
                  NO DATA FOUND
                </TableCell>
              </TableRow>
            ) : (
              leads?.map((user, index) => {
                const { name, email, mobile, created_at, role } = user;
                return (
                  <TableRow
                    key={user.id}
                    className="group text-xs uppercase text-muted-foreground"
                  >
                    <TableCell className="font-medium">
                      {serialNo(page) + index}.
                    </TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>{mobile}</TableCell>
                    <TableCell>{adUserBadge(role)}</TableCell>
                    <TableCell>
                      {dayjs(new Date(created_at)).format("MMM D, YYYY h:mm A")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col justify-end items-center md:flex-row space-y-1 md:gap-8">
                        <button type="button">
                          <Eye
                            size={16}
                            className="text-muted-foreground transition duration-200 group-hover:text-blue-500"
                          />
                        </button>
                        <button type="button">
                          <Pencil
                            size={16}
                            className="text-muted-foreground transition duration-200 group-hover:text-yellow-500"
                          />
                        </button>
                        <button type="button">
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {meta.totalPages > 1 && (
        <PaginationContainer
          totalPages={meta.totalPages}
          currentPage={meta.currentPage}
        />
      )}
    </AdContentWrapper>
  );
};
export default CListLeads;
