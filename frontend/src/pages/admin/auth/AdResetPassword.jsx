import resetPasswordBg from "@/assets/admin/resetPasswordBg.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import { useState } from "react";
import { Form, Link } from "react-router-dom";

const AdResetPassword = () => {
  document.title = `Reset Password | ${import.meta.env.VITE_APP_TITLE}`;
  const [type, setType] = useState("password");

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-4">
      <div className="flex justify-end items-end">
        <div className="w-full md:max-w-md p-6">
          <div className="flex justify-center items-center mb-8">
            <h3 className="text-5xl font-bold text-gray-800 tracking-widest">
              CRM
            </h3>
          </div>
          <Form>
            <div className="flex flex-col space-y-4">
              <div className="w-full items-center gap-1.5">
                <Label
                  htmlFor="newPassword"
                  className="capitalize tracking-widest"
                >
                  new password
                </Label>
                <div className="flex flex-row justify-center items-center relative">
                  <Input
                    type={type}
                    id="newPassword"
                    name="newPassword"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    className="absolute h-full right-0 px-2 hover:bg-muted"
                    onClick={() =>
                      setType(type === "password" ? "text" : "password")
                    }
                  >
                    <Eye size={20} className="font-normal" />
                  </button>
                </div>
              </div>
              <div className="w-full items-center gap-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="capitalize tracking-widest"
                >
                  confirm password
                </Label>
                <div className="flex flex-row justify-center items-center relative">
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="********"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Button
                type="submit"
                className="w-full uppercase tracking-widest mt-8 mb-4"
              >
                save
              </Button>
            </div>
          </Form>
          <div className="flex flex-row justify-end items-center">
            <Link to={`/admin/sign-in`}>
              <p className="text-sm tracking-widest text-gray-800 hover:text-gray-600">
                Never mind. Back to Login
              </p>
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden md:flex flex-row h-screen justify-center items-center">
        <img
          src={resetPasswordBg}
          alt={import.meta.env.VITE_APP_TITLE}
          className="object-cover"
        />
      </div>
    </div>
  );
};
export default AdResetPassword;
