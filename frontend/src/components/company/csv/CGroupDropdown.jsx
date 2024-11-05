import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";

const CGroupDropdown = () => {
  const { coGroups } = useSelector((store) => store.coUsers);

  return (
    <>
      <Label
        className="text-muted-foreground text-xs uppercase"
        htmlFor="assignee"
      >
        select group <span className="text-red-500">*</span>
      </Label>
      <select
        name="assignee"
        id="assignee"
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
      >
        <option value="">- Select -</option>
        {coGroups?.map((group) => {
          return (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          );
        })}
      </select>
    </>
  );
};
export default CGroupDropdown;
