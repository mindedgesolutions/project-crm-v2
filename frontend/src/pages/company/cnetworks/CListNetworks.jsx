import {
  AdContentWrapper,
  CAddEditNetwork,
  SkeletonTableRow,
} from "@/components";
import customFetch from "@/utils/customFetch";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import { splitErrors } from "@/utils/splitErrors";
import { nanoid } from "nanoid";
import networkImg from "@/assets/company/defaults/network_default.png";

const CListNetworks = () => {
  document.title = `List of Networks | ${import.meta.env.VITE_APP_TITLE}`;
  const { counter } = useSelector((store) => store.common);
  const [networks, setNetworks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await customFetch.get(`/company/co-networks`);
      setNetworks(response.data.data.rows);
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
  }, [counter]);

  return (
    <AdContentWrapper>
      <div className="flex flex-row justify-between items-center bg-muted my-4 p-2">
        <h3 className="font-semibold text-sm tracking-widest text-muted-foreground">
          Networks
        </h3>
      </div>
      <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-4">
        <div className="basis-2/3">
          <Table>
            <TableHeader>
              <TableRow className="text-muted-foreground">
                <TableHead className="w-[100px]">Sl. No.</TableHead>
                <TableHead>Name</TableHead>
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
              ) : networks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-xs uppercase text-center"
                  >
                    NO DATA FOUND
                  </TableCell>
                </TableRow>
              ) : (
                networks?.map((ntwrk, index) => {
                  const { id, network, updated_at, network_img } = ntwrk;
                  return (
                    <TableRow
                      key={nanoid()}
                      className="text-xs uppercase group text-muted-foreground"
                    >
                      <TableCell className="font-medium">
                        {index + 1}.
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-row justify-start items-center gap-3">
                          {network_img ? (
                            <img
                              src={network_img}
                              alt={network}
                              className="h-6"
                            />
                          ) : (
                            <img
                              src={networkImg}
                              alt={network}
                              className="h-6"
                            />
                          )}
                          <span>{network}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {dayjs(new Date(updated_at)).format(
                          "MMM D, YYYY h:mm A"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col justify-end items-center md:flex-row space-y-1 md:gap-4">
                          {ntwrk.company_id && (
                            <>
                              <>
                                <button
                                  type="button"
                                  onClick={() => setEditId(ntwrk.id)}
                                >
                                  <Pencil
                                    size={16}
                                    className="text-muted-foreground transition duration-200 group-hover:text-yellow-500"
                                  />
                                </button>
                              </>
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
        <CAddEditNetwork
          networks={networks}
          editId={editId}
          setEditId={setEditId}
        />
      </div>
    </AdContentWrapper>
  );
};
export default CListNetworks;
