import forgotPasswordBg from "@/assets/admin/forgotPasswordBg.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, Link } from "react-router-dom";

const AdForgotPassword = () => {
  document.title = `Forgot Password | ${import.meta.env.VITE_APP_TITLE}`;

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-4">
      <div className="flex justify-end items-end">
        <div className="w-full md:max-w-md p-6">
          <div className="flex flex-col justify-center items-center space-y-8 mb-8">
            <h3 className="text-5xl font-bold text-gray-800 tracking-widest">
              CRM
            </h3>
            <p className="text-justify text-sm md:text-[16px] tracking-wide">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum ex
              unde deserunt accusantium voluptatum repellendus dolorum enim ut
              ea quasi?
            </p>
          </div>
          <Form>
            <div className="flex flex-col space-y-4">
              <div className="w-full items-center gap-1.5">
                <Label
                  htmlFor="username"
                  className="capitalize tracking-widest"
                >
                  enter registered email
                </Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="johndoe@test.com"
                />
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Button
                type="submit"
                className="w-full uppercase tracking-widest mt-8 mb-4"
              >
                send reset link
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
          src={forgotPasswordBg}
          alt={import.meta.env.VITE_APP_TITLE}
          className="object-cover"
        />
      </div>
    </div>
  );
};
export default AdForgotPassword;
