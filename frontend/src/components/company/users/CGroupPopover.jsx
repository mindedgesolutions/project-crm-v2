import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";

const CGroupPopover = ({ users }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="pl-4 text-muted-foreground">
          <Info size={18} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-96 h-auto p-2">
        <ScrollArea className="h-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Users</h4>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-1 items-center">
                {users.map((user, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-row justify-start items-start text-xs py-2 border-b-[1px]"
                    >
                      <p className="min-w-10">{index + 1}.</p>
                      <p className="min-w-40">{user.uname}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
export default CGroupPopover;
