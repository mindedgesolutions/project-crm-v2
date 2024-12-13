import { Input } from "@/components/ui/input";
import { nanoid } from "nanoid";
import { useSelector } from "react-redux";

const CLeadsUserFilters = () => {
  const { allStatus, allStates } = useSelector((store) => store.leads);

  return (
    <div className="p-3 border border-muted-foreground/5 my-4">
      <div className="flex flex-row justify-start items-center gap-4 mb-3">
        <div className="basis-1/5 flex flex-col space-y-1.5">
          <div className="text-[10px] font-medium text-muted-foreground/70 tracking-wider uppercase">
            lead status
          </div>
          <div className="">
            <select
              className="flex h-auto w-full items-center justify-between rounded-sm border border-input bg-background px-1 py-[6px] text-sm focus:outline-none text-muted-foreground"
              name=""
              id=""
            >
              <option value="">Select</option>
              {allStatus?.map((i) => {
                return (
                  <option key={nanoid()} value={i.id}>
                    {i.status}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="basis-1/5 flex flex-col space-y-1.5">
          <div className="text-[10px] font-medium text-muted-foreground/70 tracking-wider uppercase">
            name / phone / whatsapp / email
          </div>
          <div className="">
            <Input
              className="h-auto w-full px-2 py-[6px] rounded-sm text-muted-foreground"
              name="search"
              id="search"
              placeholder="full / partial will do"
            />
          </div>
        </div>
        <div className="basis-1/5 flex flex-col space-y-1.5">
          <div className="text-[10px] font-medium text-muted-foreground/70 tracking-wider uppercase">
            state
          </div>
          <div className="">
            <select className="flex h-auto w-full items-center justify-between rounded-sm border border-input bg-background px-1 py-[6px] text-sm focus:outline-none text-muted-foreground">
              <option value="">Select</option>
              {allStates
                ?.filter((i) => i.state && i.state !== "")
                ?.map((i) => {
                  return (
                    <option key={nanoid()} value={i.state}>
                      {i.state}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
        <div className="basis-1/5 flex flex-col space-y-1.5">
          <div className="text-[10px] font-medium text-muted-foreground/70 tracking-wider uppercase">
            city
          </div>
          <div className="">
            <Input
              className="h-auto w-full px-2 py-[6px] rounded-sm text-muted-foreground"
              name="search"
              id="search"
              placeholder="search by city"
            />
          </div>
        </div>
        <div className="basis-1/5 flex flex-col space-y-1.5">
          <div className="text-[10px] font-medium text-muted-foreground/70 tracking-wider uppercase">
            assigned to
          </div>
          <div className="">
            <select
              className="flex h-auto w-full items-center justify-between rounded-sm border border-input bg-background px-1 py-[6px] text-sm focus:outline-none text-muted-foreground"
              name=""
              id=""
            >
              <option value="">Select</option>
              <option value="">Select 1</option>
              <option value="">Select 2</option>
              <option value="">Select 3</option>
              <option value="">Select 4</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-start items-center gap-4">
        <div className="basis-1/5 flex flex-col space-y-1.5">
          <div className="text-[10px] font-medium text-muted-foreground/70 tracking-wider uppercase">
            lead date (from)
          </div>
          <div className="">
            <input
              type="date"
              className="flex h-auto w-full px-2 py-1 rounded-sm border border-input bg-background text-sm focus:outline-none text-muted-foreground"
              name=""
              id=""
            />
          </div>
        </div>
        <div className="basis-1/5 flex flex-col space-y-1.5">
          <div className="text-[10px] font-medium text-muted-foreground/70 tracking-wider uppercase">
            lead date (till)
          </div>
          <div className="">
            <input
              type="date"
              className="flex h-auto w-full px-2 py-1 rounded-sm border border-input bg-background text-sm focus:outline-none text-muted-foreground"
              name=""
              id=""
            />
          </div>
        </div>
        <div className="basis-1/5 flex flex-col space-y-1.5">
          <div className="text-[10px] font-medium text-muted-foreground/70 tracking-wider uppercase">
            select a custom field
          </div>
          <div className="">
            <select
              className="flex h-auto w-full items-center justify-between rounded-sm border border-input bg-background px-1 py-[6px] text-sm focus:outline-none text-muted-foreground"
              name=""
              id=""
            >
              <option value="">Select</option>
            </select>
          </div>
        </div>
        <div className="basis-1/5 flex flex-col space-y-1.5">
          <div className="text-[10px] font-medium text-muted-foreground/70 tracking-wider uppercase">
            enter field value
          </div>
          <div className="">
            <input
              type="text"
              className="flex h-auto w-full px-2 py-1 rounded-sm border border-input bg-background text-sm focus:outline-none text-muted-foreground"
              name=""
              id=""
            />
          </div>
        </div>
        <div className="basis-1/5 flex flex-row justify-start items-center mt-5 gap-4">
          <button className="bg-primary hover:bg-primary/90 h-auto min-w-16 px-2 py-1 rounded-sm text-card text-sm">
            Filter
          </button>
          <button className="inline-flex items-center h-auto min-w-16 px-2 py-1 justify-center whitespace-nowrap rounded-sm text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
export default CLeadsUserFilters;
