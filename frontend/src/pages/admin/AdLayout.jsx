import { AdFooter, AdPageWrapper, AdSidebar, AdTopnav } from "@/components";
import { setCurrentUser, unsetCurrentUser } from "@/features/currentUserSlice";
import customFetch from "@/utils/customFetch";
import showError from "@/utils/showError";
import { Outlet, redirect, useLocation, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const AdLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const logout = async () => {
    await customFetch.post(`/auth/logout`);
    dispatch(unsetCurrentUser());
    navigate(`/`);
  };

  const checkLogin = async () => {
    const response = await customFetch.get(`/auth/check-login`);
    if (!response.data.status) {
      showError(`Invalid token! Login required`);
      logout();
    }
  };

  useEffect(() => {
    checkLogin();
  }, [pathname]);

  return (
    <div className="flex gap-0 md:gap-1">
      <AdSidebar />
      <ScrollArea className="h-screen w-full">
        <AdPageWrapper>
          <AdTopnav />
          <Outlet />
          <AdFooter />
        </AdPageWrapper>
      </ScrollArea>
    </div>
  );
};
export default AdLayout;

// Loader function starts ------
export const loader = (store) => async () => {
  const { currentUser } = store.getState().currentUser;

  try {
    if (!currentUser.name) {
      const response = await customFetch.get(`/auth/current-user`);
      store.dispatch(setCurrentUser(response.data.data.rows[0]));
    }
    return null;
  } catch (error) {
    showError(`Something went wrong! Login required`);
    return redirect(`/sign-in`);
  }
};
