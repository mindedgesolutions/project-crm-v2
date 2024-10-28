import {
  AdContentWrapper,
  AdDeletePlan,
  AdPopover,
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
import { updateCounter } from "@/features/commonSlice";
import customFetch from "@/utils/customFetch";
import {
  activeBadge,
  currencyFormat,
  serialNo,
  tenureBadge,
} from "@/utils/functions";
import showSuccess from "@/utils/showSuccess";
import { splitErrors } from "@/utils/splitErrors";
import dayjs from "dayjs";
import { Eye, Pencil, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdListPlans = () => {
  document.title = `List of Available Plans | ${
    import.meta.env.VITE_APP_TITLE
  }`;
  const [plans, setPlans] = useState([]);
  const [meta, setMeta] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { search } = useLocation();
  const queryString = new URLSearchParams(search);
  const page = queryString.get("page");
  const { counter } = useSelector((store) => store.common);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(`/admin/plans`, {
        params: {
          page: page || "",
        },
      });
      setPlans(response.data.data.rows);
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

  const activate = async (id) => {
    setIsLoading(true);
    try {
      await customFetch.put(`/admin/plan/activate/${id}`);
      showSuccess(`Plan activated`);
      dispatch(updateCounter());
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, queryString.get("type"), queryString.get("search"), counter]);

  return (
    <AdContentWrapper>
      <div className="flex flex-row justify-between items-center bg-muted my-4 p-2">
        <h3 className="font-bold text-xl tracking-widest text-muted-foreground">
          List of Available Plans
        </h3>
        <Link to={`/admin/masters/plan`}>
          <Button className="capitalize tracking-wider">add new</Button>
        </Link>
      </div>
      <div className="my-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Sl. No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Tenure</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Status</TableHead>
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
            ) : plans.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-xs uppercase text-center"
                >
                  NO DATA FOUND
                </TableCell>
              </TableRow>
            ) : (
              plans?.map((plan, index) => {
                const { name, tenure, price, updated_at } = plan;
                return (
                  <TableRow key={plan.id} className="text-xs uppercase group">
                    <TableCell className="font-medium">
                      {serialNo(page) + index}.
                    </TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell>{tenureBadge(tenure)}</TableCell>
                    <TableCell>{currencyFormat().format(price)}</TableCell>
                    <TableCell>
                      <AdPopover values={plan.details} />
                    </TableCell>
                    <TableCell>
                      {dayjs(new Date(updated_at)).format("MMM D, YYYY h:mm A")}
                    </TableCell>
                    <TableCell>{activeBadge(plan.is_active)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col justify-end items-center md:flex-row space-y-1 md:gap-4">
                        {plan.is_active ? (
                          <>
                            <button type="button">
                              <Eye
                                size={18}
                                className="text-muted-foreground transition duration-200 group-hover:text-blue-500"
                              />
                            </button>
                            <Link to={`/admin/masters/plan/${plan.id}`}>
                              <button type="button">
                                <Pencil
                                  size={18}
                                  className="text-muted-foreground transition duration-200 group-hover:text-yellow-500"
                                />
                              </button>
                            </Link>
                            <AdDeletePlan deleteId={plan.id} />
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => activate(plan.id)}
                          >
                            <ThumbsUp
                              size={18}
                              className="text-muted-foreground transition duration-200 group-hover:text-green-500"
                            />
                          </button>
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
      {meta.totalPages > 1 && (
        <PaginationContainer
          totalPages={meta.totalPages}
          currentPage={meta.currentPage}
        />
      )}
    </AdContentWrapper>
  );
};
export default AdListPlans;

// Loader function starts ------
export const loader = async () => {
  try {
    const response = await customFetch.get(`/admin/plan-attributes/all`);
    const attributes = response.data.data.rows;
    return { attributes };
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    return error;
  }
};
