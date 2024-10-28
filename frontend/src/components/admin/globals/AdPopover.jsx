import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Info, X } from "lucide-react";
import { useLoaderData } from "react-router-dom";

const AdPopover = ({ values }) => {
  const { attributes } = useLoaderData();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="pl-4 text-muted-foreground">
          <Info size={18} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-96 max-h-96 p-2">
        <ScrollArea className="h-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Features</h4>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-1 items-center">
                {attributes.map((attr, index) => {
                  const result = values.find((i) => i.attr_id === attr.id);
                  let label = "";
                  if (result?.attr_value === "yes") {
                    label = <Check size={16} className="text-green-500" />;
                  } else if (result?.attr_value === "no") {
                    label = <X size={16} className="text-red-500" />;
                  } else if (result?.attr_value) {
                    label = result?.attr_value;
                  }

                  return (
                    <div
                      key={index}
                      className="flex flex-row justify-between items-start text-xs py-2 border-b-[1px]"
                    >
                      <p className="min-w-10">{index + 1}.</p>
                      <p className="min-w-40">{attr.attribute}</p>
                      <p className="min-w-32 capitalize">{label}</p>
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
export default AdPopover;
