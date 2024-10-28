import { CFooter, CSidebar, CTopnav } from "@/components";
import { setCurrentUser } from "@/features/currentUserSlice";
import customFetch from "@/utils/customFetch";
import { splitErrors } from "@/utils/splitErrors";
import { Outlet, redirect } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { setCoGroups } from "@/features/coUsersSlice";

const CLayout = () => {
  return (
    <div className="flex gap-0 md:gap-1">
      <CSidebar />
      <ScrollArea className="h-screen w-full">
        <CTopnav />
        <Outlet />
        <CFooter />
      </ScrollArea>
    </div>
  );
};
export default CLayout;

// Loader function starts ------
export const loader = (store) => async () => {
  const { currentUser } = store.getState().currentUser;
  const { coGroups } = store.getState().coUsers;

  try {
    if (!currentUser.name) {
      const response = await customFetch.get(`/auth/company/current-user`);
      store.dispatch(setCurrentUser(response.data.data.rows[0]));
    }
    if (coGroups.length === 0) {
      const cogroups = await customFetch.get(`/company/groups`);
      store.dispatch(setCoGroups(cogroups.data.data.rows));
    }
    return null;
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    return redirect(`/sign-in`);
  }
};
