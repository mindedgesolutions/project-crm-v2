import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const WbRegister = () => {
  return (
    <div className="w-[800px] mt-10 mx-auto p-8 shadow-xl">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-muted-foreground tracking-widest uppercase">
          Signup
        </h3>
      </div>
      <Separator />
      <div className="flex flex-row justify-between items-center">
        <div className="w-full flex flex-col space-y-2 p-2 mt-4">
          <Label
            htmlFor="name"
            className="capitalize text-muted-foreground tracking-wider"
          >
            your name <span className="text-red-500">*</span>
          </Label>
          <Input
            name="name"
            id="name"
            placeholder="John Doe"
            className="w-full"
          />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="w-full flex flex-col space-y-2 p-2 mt-2">
          <Label
            htmlFor="name"
            className="capitalize text-muted-foreground tracking-wider"
          >
            company name <span className="text-red-500">*</span>
          </Label>
          <Input
            name="name"
            id="name"
            placeholder="Fun Factory pvt. ltd."
            className="w-full"
          />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center mt-2">
        <div className="w-full flex flex-col space-y-2 p-2">
          <Label
            htmlFor="name"
            className="capitalize text-muted-foreground tracking-wider"
          >
            email <span className="text-red-500">*</span>
          </Label>
          <Input
            name="name"
            id="name"
            placeholder="johndoe@gmail.com"
            className="w-full"
          />
        </div>
        <div className="w-full flex flex-col space-y-2 p-2">
          <Label
            htmlFor="name"
            className="capitalize text-muted-foreground tracking-wider"
          >
            mobile <span className="text-red-500">*</span>
          </Label>
          <Input name="name" id="name" placeholder="983XXXXXXX" />
        </div>
      </div>
    </div>
  );
};
export default WbRegister;
