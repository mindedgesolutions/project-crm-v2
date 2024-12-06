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
import { encParam, leadStatusBadge, serialNo } from "@/utils/functions";
import { splitErrors } from "@/utils/splitErrors";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import defaultNetworkImg from "@/assets/company/defaults/network_default.png";
import { CSingleLeadModal } from "@/pages";
import { Eye } from "lucide-react";
import { setAllStatus, setLeadList } from "@/features/leadSlice";
import { setCurrentUser } from "@/features/currentUserSlice";

const CListLeads = () => {
  document.title = `Leads | ${import.meta.env.VITE_APP_TITLE}`;
  const [leads, setLeads] = useState([]);
  const [meta, setMeta] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { search } = useLocation();
  const queryString = new URLSearchParams(search);
  const page = queryString.get("page");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((store) => store.currentUser);
  const { counter } = useSelector((store) => store.common);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(
        `/company/leads/${currentUser.company_id}`,
        {
          params: {
            page: page || "",
          },
        }
      );
      dispatch(setLeadList(response.data.data.rows));
      setLeads(response.data.data.rows);
      setMeta(response.data.meta);
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
  }, [page, queryString.get("type"), queryString.get("search"), counter]);

  return (
    <AdContentWrapper>
      <div className="flex flex-row justify-between items-center bg-muted my-4 p-2">
        <h3 className="font-semibold text-sm tracking-widest text-muted-foreground">
          List of CSV Uploads
        </h3>
        <div className="flex justify-end items-center gap-4">
          <Link to={`/app/${currentUser.cslug}/leads/lead`}>
            <Button className="capitalize tracking-wider">add lead</Button>
          </Link>
          <Link to={`/app/${currentUser.cslug}/leads/upload-csv`}>
            <Button className="capitalize tracking-wider">upload CSV</Button>
          </Link>
        </div>
      </div>
      <div className="my-4">
        <Table>
          <TableHeader>
            <TableRow className="text-muted-foreground">
              <TableHead className="w-[100px]">Sl. No.</TableHead>
              <TableHead className="w-[20px] flex justify-start items-start"></TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Lead Date</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10}>
                  <SkeletonTableRow />
                </TableCell>
              </TableRow>
            ) : leads.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center text-xs uppercase text-muted-foreground"
                >
                  NO DATA FOUND
                </TableCell>
              </TableRow>
            ) : (
              leads?.map((lead, index) => {
                const {
                  network_img,
                  name,
                  mobile,
                  whatsapp,
                  created_at,
                  assigned,
                  status,
                  updated_at,
                } = lead;

                const labelName =
                  name.length > 20 ? name.substring(0, 20) + `...` : name;

                return (
                  <TableRow
                    key={lead.id}
                    className="group text-xs uppercase text-muted-foreground"
                  >
                    <TableCell className="font-medium">
                      {serialNo(page) + index}.
                    </TableCell>
                    <TableCell>
                      {network_img ? (
                        <img src={network_img} alt={name} className="h-6" />
                      ) : (
                        <img
                          src={defaultNetworkImg}
                          alt={name}
                          className="h-6"
                        />
                      )}
                    </TableCell>
                    <TableCell>{labelName}</TableCell>
                    <TableCell>{leadStatusBadge(status)}</TableCell>
                    <TableCell>{mobile}</TableCell>
                    <TableCell>{whatsapp}</TableCell>
                    <TableCell>
                      {dayjs(new Date(created_at)).format("MMM D, YYYY h:mm A")}
                    </TableCell>
                    <TableCell>{assigned}</TableCell>
                    <TableCell>
                      {dayjs(new Date(updated_at)).format("MMM D, YYYY h:mm A")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col justify-end items-center md:flex-row space-y-1 md:gap-6">
                        <CSingleLeadModal editId={lead.id} />
                        <Link
                          to={`/app/${currentUser.cslug}/leads/lead/${encParam(
                            lead.uuid
                          )}`}
                        >
                          <Eye
                            size={16}
                            className="text-muted-foreground transition duration-200 group-hover:text-blue-500"
                          />
                        </Link>
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

// Loader function starts ------
export const loader = (store) => async () => {
  const { currentUser } = store.getState().currentUser;
  const { allStatus } = store.getState().leads;

  try {
    if (!currentUser.name) {
      const response = await customFetch.get(`/auth/company/current-user`);
      store.dispatch(setCurrentUser(response.data.data.rows[0]));
      const user = response.data.data.rows[0];

      if (allStatus.length === 0) {
        const statuslist = await customFetch.get(
          `/company/all-lead-status/${user.company_id}`
        );
        store.dispatch(setAllStatus(statuslist.data.data.rows));
      }
    }
    return null;
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    return error;
  }
};
