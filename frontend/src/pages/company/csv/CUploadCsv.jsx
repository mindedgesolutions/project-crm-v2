import {
  AdContentWrapper,
  AdSubmitBtn,
  CGroupMultiSelect,
  CNewGroupPopover,
} from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import customFetch from "@/utils/customFetch";
import showSuccess from "@/utils/showSuccess";
import { splitErrors } from "@/utils/splitErrors";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const CUploadCsv = () => {
  const { currentUser } = useSelector((store) => store.currentUser);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    try {
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  return (
    <AdContentWrapper>
      <div className="flex flex-row justify-between items-center bg-muted my-4 p-2">
        <h3 className="font-bold text-xl tracking-widest text-muted-foreground">
          Upload CSV
        </h3>
      </div>
      <div className="my-4">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row justify-between items-center gap-4 mb-4">
            <div className="basis-1/3 flex flex-col space-y-2">
              <Label
                className="text-muted-foreground text-xs uppercase"
                htmlFor="name"
              >
                csv custom name
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Full name is required"
                // value={form.name}
                // onChange={handleChange}
                autoFocus={true}
              />
            </div>
            <div className="basis-1/3 flex flex-col space-y-2">
              <Label
                className="text-muted-foreground text-xs uppercase"
                htmlFor="mobile"
              >
                CSV date <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                name="start"
                dateFormat={import.meta.env.VITE_DATE_FORMAT}
                className={`form-control flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none`}
                // selected={filterStart}
                // minDate={new Date(startDate)}
                // maxDate={filterEnd}
                // onChange={(date) => setFilterStart(date)}
              />
            </div>
            <div className="basis-1/3"></div>
          </div>

          <Separator />

          <div className="flex flex-col mb-4">
            <div className="flex flex-row justify-between items-center bg-muted my-4 p-2">
              <h3 className="font-semibold tracking-widest text-muted-foreground">
                Upload CSV
              </h3>
            </div>
            <div className="flex flex-row justify-between items-center gap-4">
              <div className="basis-1/3 flex flex-col space-y-2">
                <Label
                  className="text-muted-foreground text-xs uppercase"
                  htmlFor="username"
                >
                  username <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Full name is required"
                  // value={form.email}
                  // readOnly={true}
                />
              </div>
              <div className="basis-1/3">&nbsp;</div>
              <div className="basis-1/3">&nbsp;</div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-row justify-start items-center my-8 gap-4">
            <AdSubmitBtn
              isLoading={isLoading}
              text={`upload CSV`}
              addClass={`w-auto`}
            />
            <Link to={`/app/${currentUser.cslug}/settings/users`}>
              <Button type="button" variant="outline" className="uppercase">
                Back to users
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </AdContentWrapper>
  );
};
export default CUploadCsv;
