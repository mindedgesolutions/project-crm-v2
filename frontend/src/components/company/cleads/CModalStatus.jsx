import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { leadStatusIdBadge } from "@/utils/functions";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { AdSubmitBtn } from "@/components";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import customFetch from "@/utils/customFetch";
import { splitErrors } from "@/utils/splitErrors";

const CModalStatus = ({ lead }) => {
  let title = "";
  const { coUsers } = useSelector((store) => store.coUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    status: "",
    annotation: "",
    followup: "",
  });

  if (!lead.lstatus[0].uid) {
    title = "no update yet";
  } else {
    title = `total ${lead.lstatus.length} updates available`;
  }
  const lastTwoRows = lead.lstatus?.slice(-2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    try {
      await customFetch.post(`/lead/update-status/${lead.id}`, data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return null;
    }
  };

  return (
    <div className="p-2">
      <div className="bg-muted p-1 pl-2 flex flex-row justify-between items-center">
        <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium">
          {title}
        </span>
        <Link to={`#`}>
          <Button
            type="button"
            variant={`outline`}
            className="h-auto p-2 px-3 uppercase text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            view all
          </Button>
        </Link>
      </div>
      {lead.lstatus[0].uid && (
        <Table>
          <TableHeader>
            <TableRow className="text-muted-foreground">
              <TableHead>Status</TableHead>
              <TableHead>On</TableHead>
              <TableHead>By</TableHead>
              <TableHead>Comment</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {lastTwoRows?.map((ld) => {
              const updateBy = coUsers?.find((i) => +i.id === +ld.uid)?.name;
              console.log(ld.comments.length);
              const commentLabel =
                ld.comments.length > 20
                  ? ld.comments.substring(0, 20) + "..."
                  : ld.comments;

              return (
                <TableRow key={nanoid()} className="uppercase h-2">
                  <TableCell className="text-[10px]">
                    {leadStatusIdBadge(ld.status)}
                  </TableCell>
                  <TableCell className="text-[10px]">
                    {dayjs(new Date(ld.created)).format("MMM D, YYYY h:mm A")}
                  </TableCell>
                  <TableCell className="text-[10px]">{updateBy}</TableCell>
                  <TableCell className="text-[10px]">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p>{commentLabel}</p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{ld.comments}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      <Separator />
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="flex flex-row w-full justify-start items-start p-2 mt-2 mb-1">
          <div className="flex flex-row w-full justify-start items-center gap-3 text-muted-foreground">
            <Label className="basis-1/4 font-normal uppercase text-xs tracking-wider">
              current status <span className="text-red-500">*</span>
            </Label>
            <div className="basis-3/4">
              <select
                name="status"
                id="status"
                className="flex h-8 min-w-60 items-center justify-between rounded-md border border-input bg-background p-1 text-sm focus:outline-none"
              >
                <option value="">Select</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full justify-start items-start p-2 mb-1">
          <div className="flex flex-row w-full justify-start items-center gap-3 text-muted-foreground">
            <Label className="basis-1/4 font-normal uppercase text-xs tracking-wider">
              annotation <span className="text-red-500">*</span>
            </Label>
            <div className="basis-3/4">
              <Textarea
                name="annotation"
                id="annotation"
                placeholder="Your remarks"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full justify-start items-start p-2 mb-1">
          <div className="flex flex-row w-full justify-start items-center gap-3 text-muted-foreground">
            <Label className="basis-1/4 font-normal uppercase text-xs tracking-wider">
              follow-up date
            </Label>
            <div className="basis-3/4">
              <DatePicker
                className="basis-1/2 h-8 min-w-60 rounded-md border-[1px] bg-background p-1 text-sm focus-visible:outline-none"
                id="followup"
                name="followup"
                dateFormat={`dd-MM-yyyy`}
                selected={form.followup}
                minDate={new Date()}
                onChange={(date) => setForm({ ...form, followup: date })}
                placeholderText="Select a follow-up date"
              />
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-row w-full justify-start items-start p-2 mb-1">
          <div className="flex flex-row w-full justify-start items-center gap-3 text-muted-foreground">
            <Label className="basis-1/4"></Label>
            <div className="basis-3/4">
              <AdSubmitBtn
                text={`update`}
                isLoading={isLoading}
                addClass={`my-0 p-2 px-3 text-xs h-auto`}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default CModalStatus;
