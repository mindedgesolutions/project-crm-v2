import {
  AdContentWrapper,
  CLeadAssignHistory,
  CLeadDetails,
  CLeadUpdates,
} from "@/components";
import { setCurrentUser } from "@/features/currentUserSlice";
import { setAllStatus } from "@/features/leadSlice";
import customFetch from "@/utils/customFetch";
import { decParam } from "@/utils/functions";
import { splitErrors } from "@/utils/splitErrors";
import dayjs from "dayjs";
import { useLoaderData } from "react-router-dom";

const CLeadInfo = () => {
  const { lead } = useLoaderData();
  document.title = `${lead.name} : Lead Details | ${
    import.meta.env.VITE_APP_TITLE
  }`;

  return (
    <AdContentWrapper>
      <div className="flex flex-row justify-between items-center bg-muted my-4 p-2">
        <h3 className="font-semibold text-sm tracking-widest text-muted-foreground">
          <span className="uppercase">{lead.name}</span> : Lead details
        </h3>
        <h3 className="font-semibold text-sm tracking-widest text-muted-foreground">
          <span className="text-muted-foreground text-xs capitalize tracking-wider">
            added by{" "}
            <span className="uppercase font-semibold">{lead.addedby}</span> on
            <span className="mx-2 font-semibold">
              {dayjs(lead.created_at).format("dddd, MMMM D, YYYY h:mm A")}
            </span>{" "}
          </span>
        </h3>
      </div>
      <div className="my-0">
        <div className="flex flex-row justify-start items-start gap-4">
          <div className="basis-1/2 flex flex-col space-y-4">
            <CLeadDetails />
            <CLeadAssignHistory />
          </div>
          <div className="basis-1/2">
            <CLeadUpdates />
          </div>
        </div>
      </div>
    </AdContentWrapper>
  );
};
export default CLeadInfo;

// ------
export const loader = (store) => async (req) => {
  const { uuid: uuidDec } = req.params;
  const uuid = decParam(uuidDec);
  const { currentUser } = store.getState().currentUser;
  const { allStatus } = store.getState().leads;

  try {
    const response = await customFetch.get(`/company/single-lead-info/${uuid}`);
    const lead = response.data.data.rows[0];

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
    return { lead };
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    return error;
  }
};
