import { Lock, LogOut, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import avatar from "@/assets/admin/000m.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import customFetch from "@/utils/customFetch";
import { unsetCurrentUser } from "@/features/currentUserSlice";
import showSuccess from "@/utils/showSuccess";

const CProfileContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    await customFetch.post(`/auth/logout`);
    dispatch(unsetCurrentUser());
    showSuccess(`Thank you for visiting`);
    navigate(`/`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="ml-2">
        <button type="button" variant="ghost" className="focus:outline-none">
          <img src={avatar} alt="user" className="w-8 h-8 rounded-full" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-1 w-48">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to={`#`}>
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link to={`#`}>
            <DropdownMenuItem className="cursor-pointer">
              <Lock className="mr-2 h-4 w-4" />
              <span>Change password</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default CProfileContainer;
