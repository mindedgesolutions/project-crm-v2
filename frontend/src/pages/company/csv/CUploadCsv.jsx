import {
  AdContentWrapper,
  AdSubmitBtn,
  CGroupDropdown,
  CUserMultiselect,
} from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CUploadCsv = () => {
  const { currentUser } = useSelector((store) => store.currentUser);
  const { networks } = useSelector((store) => store.networks);
  const [isLoading, setIsLoading] = useState(false);
  const [coNetworks, setCoNetworks] = useState("");
  const [assignee, setAssignee] = useState("");

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
                htmlFor="file"
              >
                select csv <span className="text-red-500">*</span>
              </Label>
              <Input
                type="file"
                name="file"
                id="file"
                placeholder="Full name is required"
                // value={form.name}
                // onChange={handleChange}
              />
            </div>
            <div className="basis-1/3"></div>
            <div className="basis-1/3"></div>
          </div>

          <Separator />

          <div className="flex flex-col mb-4">
            <div className="flex flex-row justify-between items-center bg-muted my-4 p-2">
              <h3 className="font-semibold tracking-widest text-muted-foreground">
                Leads Assign Details
              </h3>
            </div>
            <div className="flex flex-row justify-between items-center gap-4">
              <div className="basis-1/3 flex flex-col space-y-2">
                <Label
                  className="text-muted-foreground text-xs uppercase"
                  htmlFor="assignee"
                >
                  select network
                </Label>
                <select
                  name="assignee"
                  id="assignee"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                  value={coNetworks}
                  onChange={(e) => setCoNetworks(e.target.value)}
                >
                  <option value="">- Select -</option>
                  {networks?.map((network) => {
                    return (
                      <option key={nanoid()} value={network.id}>
                        {network.network}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="basis-1/3 flex flex-col space-y-2">
                <Label
                  className="text-muted-foreground text-xs uppercase"
                  htmlFor="assignee"
                >
                  select <span className="text-red-500">*</span>
                </Label>
                <select
                  name="assignee"
                  id="assignee"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                >
                  <option value="">- Select -</option>
                  <option value={1}>All users</option>
                  <option value={2}>Group</option>
                  <option value={3}>Selected users</option>
                </select>
              </div>
              <div className="basis-1/3 flex flex-col space-y-2">
                {assignee === "2" && <CGroupDropdown />}
                {assignee === "3" && <CUserMultiselect />}
              </div>
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
