import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";

const CNewCategoryPopover = () => {
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
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Tempore, consectetur error alias ratione nobis reprehenderit!
              </p>
              <p className="text-muted-foreground tracking-wider text-justify text-xs mb-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Et,
                eligendi? Cupiditate in eos labore voluptas.
              </p>
            </div>
            {/* <CAddEditGroupModal /> */}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
export default CNewCategoryPopover;
