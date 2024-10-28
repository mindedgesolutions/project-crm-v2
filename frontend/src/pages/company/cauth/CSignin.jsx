import loginBg from "@/assets/admin/loginBg.svg";
import { AdSubmitBtn } from "@/components";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import customFetch from "@/utils/customFetch";
import showSuccess from "@/utils/showSuccess";
import { splitErrors } from "@/utils/splitErrors";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Form,
  Link,
  redirect,
  useNavigate,
  useNavigation,
} from "react-router-dom";

const CSignin = () => {
  document.title = `Sign In | ${import.meta.env.VITE_APP_TITLE}`;
  const [type, setType] = useState("password");
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isLoading = navigation.state === "submitting";
  const [form, setForm] = useState({ username: "", password: "" });
  const { currentUser } = useSelector((store) => store.currentUser);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loginStatusCompany = async () => {
    // try {
    //   const response = await customFetch.get(`/auth/company/check-login`);
    //   if (response.data.status === true && currentUser) {
    //     navigate(`/app/${currentUser.cslug}/dashboard`);
    //   }
    // } catch (error) {
    //   splitErrors(error?.response?.data?.msg);
    //   console.log(error);
    // }
  };

  useEffect(() => {
    loginStatusCompany();
  }, []);

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-4">
      <div className="flex justify-end items-end">
        <div className="w-full md:max-w-md p-6">
          <div className="flex justify-center items-center mb-8">
            <h3 className="text-5xl font-bold text-muted-foreground tracking-widest">
              CRM
            </h3>
          </div>
          <Form method="post" autoComplete="off">
            <div className="flex flex-col space-y-4">
              <div className="w-full items-center gap-1.5">
                <Label
                  htmlFor="username"
                  className="capitalize tracking-widest"
                >
                  username
                </Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="johndoe@test.com"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full items-center gap-1.5">
                <Label
                  htmlFor="password"
                  className="capitalize tracking-widest"
                >
                  password
                </Label>
                <div className="flex flex-row justify-center items-center relative">
                  <Input
                    type={type}
                    id="password"
                    name="password"
                    placeholder="********"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute h-full right-0 px-2 bg-transparent hover:bg-transparent"
                    onClick={() =>
                      setType(type === "password" ? "text" : "password")
                    }
                  >
                    <Eye size={20} className="font-normal" />
                  </button>
                </div>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" name="remember" />
                    <label
                      htmlFor="remember"
                      className="text-sm tracking-widest text-muted-foreground hover:text-gray-600"
                    >
                      Remember
                    </label>
                  </div>
                </div>
                <Link to={`/admin/forgot-password`}>
                  <p className="text-sm tracking-widest text-muted-foreground hover:text-gray-600">
                    Forgot password?
                  </p>
                </Link>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <AdSubmitBtn text="login" isLoading={isLoading} />
            </div>
          </Form>
        </div>
      </div>
      <div className="hidden md:flex flex-row h-screen justify-center items-center">
        <img
          src={loginBg}
          alt={import.meta.env.VITE_APP_TITLE}
          className="object-cover"
        />
      </div>
    </div>
  );
};
export default CSignin;

// Action function starts ------
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const response = await customFetch.post(`/auth/company/sign-in`, data);
    const cslug = response.data.data.cslug;
    showSuccess(`Welcome ${response.data.data.name}`);
    return redirect(`/app/${cslug}/dashboard`);
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    return null;
  }
};
