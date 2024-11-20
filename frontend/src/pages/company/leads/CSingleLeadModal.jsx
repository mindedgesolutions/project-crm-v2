import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

const CSingleLeadModal = ({ editId, leads }) => {
  const [isLoading, setIsLoading] = useState();
  const dispatch = useDispatch();
  const lead = editId && leads?.find((i) => i.id === editId);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("status");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button type="button">
          <Pencil
            size={16}
            className="text-muted-foreground transition duration-200 group-hover:text-yellow-500"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl p-3 pt-6">
        <DialogHeader>
          <DialogTitle className="font-semibold tracking-wider text-muted-foreground capitalize">
            Update lead information
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-start items-start p-0 gap-0 bg-muted">
          <Button
            type="button"
            variant={`outline`}
            className={`border-b-0 rounded-none text-muted-foreground w-32 ${
              currentTab === "status"
                ? "bg-white border border-b-0 hover:bg-background"
                : "bg-inherit border-0 hover:bg-accent"
            }`}
            onClick={() => setCurrentTab("status")}
          >
            Status
          </Button>
          <Button
            type="button"
            variant={`outline`}
            className={`border-0 bg-inherit rounded-none text-muted-foreground w-32 hover:bg-background ${
              currentTab === "reassign"
                ? "bg-white border border-b-0 hover:bg-background"
                : "bg-inherit border-0 hover:bg-accent"
            }`}
            onClick={() => setCurrentTab("reassign")}
          >
            Re-assign
          </Button>
          <Button
            type="button"
            variant={`outline`}
            className={`border-0 bg-inherit rounded-none text-muted-foreground w-32 hover:bg-background ${
              currentTab === "sendemail"
                ? "bg-white border border-b-0 hover:bg-background"
                : "bg-inherit border-0 hover:bg-accent"
            }`}
            onClick={() => setCurrentTab("sendemail")}
          >
            Email
          </Button>
          <Button
            type="button"
            variant={`outline`}
            className={`border-0 bg-inherit rounded-none text-muted-foreground w-32 hover:bg-background ${
              currentTab === "sendwa"
                ? "bg-white border border-b-0 hover:bg-background"
                : "bg-inherit border-0 hover:bg-accent"
            }`}
            onClick={() => setCurrentTab("sendwa")}
          >
            WhatsApp
          </Button>
        </div>
        <div className="border border-t-0 -mt-4 min-h-8"></div>
        <DialogFooter>
          {/* <AdSubmitBtn
            addClass={`w-auto`}
            text={`save`}
            isLoading={isLoading}
          /> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CSingleLeadModal;
