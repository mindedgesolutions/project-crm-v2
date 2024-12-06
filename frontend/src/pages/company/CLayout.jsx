import {
  CFooter,
  CSidebarAdmin,
  CSidebarManager,
  CSidebarUser,
  CTopnav,
} from "@/components";
import { setCurrentUser, unsetCurrentUser } from "@/features/currentUserSlice";
import customFetch from "@/utils/customFetch";
import { splitErrors } from "@/utils/splitErrors";
import { Outlet, redirect, useLocation, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { setCoGroups, setCoUsers } from "@/features/coUsersSlice";
import { setNetworks } from "@/features/networkSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import showError from "@/utils/showError";

const CLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { currentUser } = useSelector((store) => store.currentUser);
  const arr = pathname.split(`/`);
  const company = arr[2];
  const dispatch = useDispatch();

  const logout = async () => {
    await customFetch.post(`/auth/logout`);
    dispatch(unsetCurrentUser());
    navigate(`/`);
  };

  const checkLogin = async () => {
    if (currentUser.cslug === company) {
      const response = await customFetch.get(
        `/auth/company/check-login/${currentUser.company_id}`
      );
      if (!response.data.status) {
        showError(`Invalid token! Login required`);
        logout();
      }
    } else {
      showError(`Invalid URL! Please re-login to continue`);
      logout();
    }
  };

  useEffect(() => {
    checkLogin();
  }, [pathname]);

  return (
    <div className="flex gap-0 md:gap-1">
      {currentUser.role === 2 && <CSidebarAdmin />}
      {currentUser.role === 3 && <CSidebarManager />}
      {currentUser.role === 4 && <CSidebarUser />}

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
  const { coGroups, coUsers } = store.getState().coUsers;
  const { networks } = store.getState().networks;

  try {
    if (!currentUser.name) {
      const response = await customFetch.get(`/auth/company/current-user`);
      store.dispatch(setCurrentUser(response.data.data.rows[0]));
    }
    if (coGroups.length === 0) {
      const cogroups = await customFetch.get(`/company/groups`);
      store.dispatch(setCoGroups(cogroups.data.data.rows));
    }
    if (networks.length === 0) {
      const conetworks = await customFetch.get(`/company/co-networks`);
      store.dispatch(setNetworks(conetworks.data.data.rows));
    }
    if (coUsers.length === 0) {
      const couserlist = await customFetch.get(`/company/all-users`);
      store.dispatch(setCoUsers(couserlist.data.data.rows));
    }
    return null;
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    return redirect(`/sign-in`);
  }
};
