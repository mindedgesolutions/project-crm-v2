import { CAddEditGroupModal } from "@/components";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";

const CNewGroupPopover = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="pl-4 text-muted-foreground">
          <Info size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 h-auto p-4">
        <ScrollArea className="h-auto">
          <div className="grid gap-4">
            <div className="grid gap-2 text-xs tracking-wider text-start">
              <p className="text-muted-foreground tracking-wider text-justify text-xs mb-2">
                Create different groups and put employees in those groups such
                as Facebook Team, IndiaMart Team etc.
              </p>
              <p className="text-muted-foreground tracking-wider text-justify text-xs mb-2">
                It is particularly very useful when you have a large marketing
                team and you wish to distribute leads to designated people
              </p>
            </div>
            <CAddEditGroupModal />
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
export default CNewGroupPopover;
