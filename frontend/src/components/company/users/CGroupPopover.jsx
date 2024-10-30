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
      <PopoverContent align="start" className="w-52 h-auto p-2">
        <ScrollArea className="max-h-36 min-h-24">
          <div className="grid gap-1">
            <div className="grid gap-2">
              <div className="grid grid-cols-1 items-center">
                {users.map((user, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-row justify-start items-start text-xs py-2 border-b-[1px] text-muted-foreground"
                    >
                      <p className="min-w-5">{index + 1}.</p>
                      <p className="min-w-40 text-xs uppercase">{user.uname}</p>
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
