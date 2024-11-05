import {
  AdContentWrapper,
  CAddEditLeadStatus,
  PaginationContainer,
  SkeletonTableRow,
} from "@/components";
import customFetch from "@/utils/customFetch";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { serialNo } from "@/utils/functions";
import dayjs from "dayjs";
import { Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import { splitErrors } from "@/utils/splitErrors";

const CListLeadStatus = () => {
  document.title = `List of Lead Status (Regular & Custom) | ${
    import.meta.env.VITE_APP_TITLE
  }`;
  const { currentUser } = useSelector((store) => store.currentUser);
  const { counter } = useSelector((store) => store.common);
  const [status, setStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [meta, setMeta] = useState({});
  const [editId, setEditId] = useState("");
  const { search } = useLocation();
  const queryString = new URLSearchParams(search);
  const page = queryString.get("page");
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(
        `/company/lead-status/${currentUser.company_id}`,
        { params: { page: page || "" } }
      );
      setStatus(response.data.data.rows);
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
  }, [counter, page]);

  return (
    <AdContentWrapper>
      <div className="flex flex-row justify-between items-center bg-muted my-4 p-2">
        <h3 className="font-bold text-xl tracking-widest text-muted-foreground">
          List of Lead Status (Regular & Custom)
        </h3>
      </div>
      <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-4">
        <div className="basis-2/3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Sl. No.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <SkeletonTableRow />
                  </TableCell>
                </TableRow>
              ) : status.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-xs uppercase text-center"
                  >
                    NO DATA FOUND
                  </TableCell>
                </TableRow>
              ) : (
                status?.map((st, index) => {
                  const { status, updated_at } = st;
                  return (
                    <TableRow key={st.id} className="text-xs uppercase group">
                      <TableCell className="font-medium">
                        {serialNo(page) + index}.
                      </TableCell>
                      <TableCell>{status}</TableCell>
                      <TableCell>
                        {dayjs(new Date(updated_at)).format(
                          "MMM D, YYYY h:mm A"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col justify-end items-center md:flex-row space-y-1 md:gap-4">
                          {st.company_id && (
                            <>
                              {st.is_active && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setEditId(st.id)}
                                  >
                                    <Pencil
                                      size={18}
                                      className="text-muted-foreground transition duration-200 group-hover:text-yellow-500"
                                    />
                                  </button>
                                  {/* <AdDeletePlanAttribute deleteId={st.id} /> */}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <CAddEditLeadStatus
          status={status}
          editId={editId}
          setEditId={setEditId}
        />
      </div>
      {meta.totalPages > 1 && (
        <PaginationContainer
          totalPages={meta.totalPages}
          currentPage={meta.currentPage}
          addClass={`w-2/3`}
        />
      )}
    </AdContentWrapper>
  );
};
export default CListLeadStatus;
