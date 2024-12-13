import {
  AdContentWrapper,
  CLeadsUserFilters,
  PaginationContainer,
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
import { encParam, leadStatusBadge, serialNo } from "@/utils/functions";
import { splitErrors } from "@/utils/splitErrors";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import defaultNetworkImg from "@/assets/company/defaults/network_default.png";
import { CSingleLeadModal } from "@/pages";
import { Eye } from "lucide-react";
import { setAllStates, setAllStatus, setLeadList } from "@/features/leadSlice";
import { setCurrentUser } from "@/features/currentUserSlice";
import {
  addLeadToSelection,
  removeLeadFromSelection,
} from "@/features/leadActionSlice";

const CListLeadsUser = () => {
  const { currentUser } = useSelector((store) => store.currentUser);
  document.title = `${currentUser.name}'s Leads | ${
    import.meta.env.VITE_APP_TITLE
  }`;
  const [leads, setLeads] = useState([]);
  const [meta, setMeta] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const { search } = useLocation();
  const queryString = new URLSearchParams(search);
  const page = queryString.get("page");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { counter } = useSelector((store) => store.common);
  const { checkedLeads } = useSelector((store) => store.leadActions);

  const handleLeadCheckbox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedLeads([...selectedLeads, value]);
      dispatch(addLeadToSelection(value));
    } else {
      setSelectedLeads(selectedLeads.filter((val) => val !== value));
      dispatch(removeLeadFromSelection(value));
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(
        `/company/leads/${currentUser.company_id}/${currentUser.id}`,
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
      <div className="flex flex-row justify-between items-center bg-muted my-4 mb-2 p-2">
        <h3 className="font-semibold text-sm tracking-widest text-muted-foreground">
          {currentUser.name}'s Leads
        </h3>
      </div>
      <CLeadsUserFilters />
      <div className="flex flex-row justify-between items-center bg-muted my-2 p-2">
        <h3 className="text-sm font-medium tracking-wide text-muted-foreground">
          {meta?.totalRecords} leads found
        </h3>
      </div>
      <div className="my-4 mt-2">
        <Table>
          <TableHeader>
            <TableRow className="text-muted-foreground">
              <TableHead></TableHead>
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
                <TableCell colSpan={11}>
                  <SkeletonTableRow />
                </TableCell>
              </TableRow>
            ) : leads.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
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
                    <TableCell>
                      <input
                        type="checkbox"
                        className="peer h-4 w-4 shrink-0 border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        value={lead.id}
                        checked={selectedLeads.includes(lead.id)}
                        onChange={handleLeadCheckbox}
                      />
                    </TableCell>
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
export default CListLeadsUser;

// ------
export const loader = (store) => async () => {
  const { currentUser } = store.getState().currentUser;
  const { allStatus, allStates } = store.getState().leads;

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
      if (allStates.length === 0) {
        const statelist = await customFetch.get(
          `/company/all-states/${user.company_id}`
        );
        store.dispatch(setAllStates(statelist.data.data.rows));
      }
    }
    return null;
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    return error;
  }
};
