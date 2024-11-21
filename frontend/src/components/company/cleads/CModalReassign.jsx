import { AdSubmitBtn } from "@/components";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateCounter } from "@/features/commonSlice";
import customFetch from "@/utils/customFetch";
import showSuccess from "@/utils/showSuccess";
import { splitErrors } from "@/utils/splitErrors";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CModalReassign = ({ lead }) => {
  const { coUsers } = useSelector((store) => store.coUsers);
  const users = coUsers.filter((i) => i.id !== lead.assigned_to);
  const [isLoading, setIsLoading] = useState(false);
  const [assignTo, setAssignTo] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    try {
      await customFetch.post(`/lead/re-assign/${lead.id}`, data);
      showSuccess("Lead re-assigned");
      setAssignTo("");
      dispatch(updateCounter());
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return null;
    }
  };

  return (
    <div className="p-2">
      <div className="bg-muted p-4 pl-2 flex flex-row justify-between items-center mb-2">
        <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium">
          re-assign lead
        </span>
      </div>
      <div className="flex flex-row w-full justify-start items-start p-2 mb-1">
        <div className="flex flex-row w-full justify-start items-center gap-3 text-muted-foreground">
          <Label className="basis-1/4 font-normal uppercase text-xs tracking-wider">
            current assignee
          </Label>
          <Label className="basis-3/4 font-normal uppercase text-xs tracking-wider">
            {lead.assigned}
          </Label>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row w-full justify-start items-start p-2 mb-1">
          <div className="flex flex-row w-full justify-start items-center gap-3 text-muted-foreground">
            <Label className="basis-1/4 font-normal uppercase text-xs tracking-wider">
              assign to
            </Label>
            <div className="basis-3/4">
              <select
                name="assignTo"
                id="assignTo"
                className="flex h-10 min-w-60 items-center justify-between rounded-md border border-input bg-background p-1 text-sm focus:outline-none"
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
              >
                <option value="">Select</option>
                {users.map((i) => {
                  return (
                    <option key={nanoid()} value={i.id}>
                      {i.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-row w-full justify-start items-start p-2 mb-1">
          <div className="flex flex-row w-full justify-start items-center gap-3 text-muted-foreground">
            <Label className="basis-1/4"></Label>
            <div className="basis-3/4">
              <AdSubmitBtn
                text={`assign`}
                isLoading={isLoading}
                addClass={`my-0 p-2 px-3 text-xs h-auto`}
              >
                assign
              </AdSubmitBtn>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default CModalReassign;
