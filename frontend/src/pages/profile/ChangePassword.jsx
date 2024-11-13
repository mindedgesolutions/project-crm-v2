import { AdContentWrapper, AdSubmitBtn } from "@/components";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { unsetCurrentUser } from "@/features/currentUserSlice";
import customFetch from "@/utils/customFetch";
import showSuccess from "@/utils/showSuccess";
import { splitErrors } from "@/utils/splitErrors";
import { Eye } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  document.title = `Change Password | ${import.meta.env.VITE_APP_TITLE}`;
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("password");
  const [form, setForm] = useState({ newPassword: "", cPassword: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    try {
      await customFetch.post(`/profile/change-password`, data);
      showSuccess(`Password updated. Login with the new password`);
      setIsLoading(false);

      await customFetch.post(`/auth/logout`);
      dispatch(unsetCurrentUser());
      navigate(`/`);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return null;
    }
  };

  return (
    <AdContentWrapper>
      <div className="flex flex-row justify-between items-center bg-muted my-4 p-2">
        <h3 className="font-semibold text-sm tracking-widest text-muted-foreground">
          Change Password
        </h3>
      </div>
      <div className="my-4">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row justify-between items-center gap-4 mb-4">
            <div className="basis-1/3 flex flex-col space-y-2">
              <Label
                className="text-muted-foreground text-xs uppercase"
                htmlFor="newPassword"
              >
                new password
              </Label>
              <div className="flex flex-row justify-center items-center relative">
                <Input
                  type={type}
                  name="newPassword"
                  id="newPassword"
                  placeholder="Enter new password"
                  className="text-muted-foreground"
                  autoFocus={true}
                  value={form.newPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute h-full right-0 px-2 bg-transparent hover:bg-transparent"
                  onClick={() =>
                    setType(type === "password" ? "text" : "password")
                  }
                >
                  <Eye
                    size={20}
                    className="font-normal text-muted-foreground"
                  />
                </button>
              </div>
            </div>
            <div className="basis-1/3 flex flex-col space-y-2"></div>
            <div className="basis-1/3 flex flex-col space-y-2"></div>
          </div>
          <div className="flex flex-row justify-between items-center gap-4 mb-4">
            <div className="basis-1/3 flex flex-col space-y-2">
              <Label
                className="text-muted-foreground text-xs uppercase"
                htmlFor="cPassword"
              >
                confirm password
              </Label>
              <Input
                type="password"
                name="cPassword"
                id="cPassword"
                placeholder="Confirm password"
                className="text-muted-foreground"
                value={form.cPassword}
                onChange={handleChange}
              />
            </div>
            <div className="basis-1/3 flex flex-col space-y-2"></div>
            <div className="basis-1/3 flex flex-col space-y-2"></div>
          </div>
          <Separator />
          <div className="flex flex-row justify-start items-center my-4 gap-4">
            <AdSubmitBtn
              text={`save`}
              addClass={`w-auto`}
              isLoadin={isLoading}
            />
          </div>
        </form>
      </div>
    </AdContentWrapper>
  );
};
export default ChangePassword;
