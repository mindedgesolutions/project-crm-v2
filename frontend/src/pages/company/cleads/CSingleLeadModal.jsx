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
import { ChartColumnBig, Handshake, Mail, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CLeadInfoModal,
  CModalReassign,
  CModalSendEmail,
  CModalSendWa,
  CModalStatus,
} from "@/components";
import { FaWhatsapp } from "react-icons/fa";
import { useSelector } from "react-redux";

const CSingleLeadModal = ({ editId }) => {
  const { leadList } = useSelector((store) => store.leads);
  const lead = editId && leadList?.find((i) => i.id === editId);
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
            lead information
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <CLeadInfoModal lead={lead} />
        <div className="flex flex-row justify-start items-start p-0 gap-0 bg-muted">
          <Button
            type="button"
            variant={`outline`}
            className={`border-b-0 rounded-none text-muted-foreground w-32 ${
              currentTab === "status"
                ? "bg-background border border-b-0 hover:bg-background"
                : "bg-inherit border-0 hover:bg-accent"
            }`}
            onClick={() => setCurrentTab("status")}
          >
            <span className="flex flex-row justify-center items-center gap-2">
              <ChartColumnBig size={18} className="text-fuchsia-400" />
              Status
            </span>
          </Button>
          <Button
            type="button"
            variant={`outline`}
            className={`border-0 bg-inherit rounded-none text-muted-foreground w-32 hover:bg-background ${
              currentTab === "reassign"
                ? "bg-background border border-b-0 hover:bg-background"
                : "bg-inherit border-0 hover:bg-accent"
            }`}
            onClick={() => setCurrentTab("reassign")}
          >
            <span className="flex flex-row justify-center items-center gap-2">
              <Handshake size={18} className="text-blue-400" />
              Re-assign
            </span>
          </Button>
          <Button
            type="button"
            variant={`outline`}
            className={`border-0 bg-inherit rounded-none text-muted-foreground w-32 hover:bg-background ${
              currentTab === "sendemail"
                ? "bg-background border border-b-0 hover:bg-background"
                : "bg-inherit border-0 hover:bg-accent"
            }`}
            onClick={() => setCurrentTab("sendemail")}
          >
            <span className="flex flex-row justify-center items-center gap-2">
              <Mail size={18} className="text-red-400" />
              Email
            </span>
          </Button>
          <Button
            type="button"
            variant={`outline`}
            className={`border-0 bg-inherit rounded-none text-muted-foreground w-32 hover:bg-background ${
              currentTab === "sendwa"
                ? "bg-background border border-b-0 hover:bg-background"
                : "bg-inherit border-0 hover:bg-accent"
            }`}
            onClick={() => setCurrentTab("sendwa")}
          >
            <span className="flex flex-row justify-center items-center gap-2">
              <FaWhatsapp size={18} className="text-green-400" />
              WhatsApp
            </span>
          </Button>
        </div>
        <div className="border border-t-0 -mt-4 min-h-8">
          {currentTab === "status" && <CModalStatus lead={lead} />}
          {currentTab === "reassign" && <CModalReassign lead={lead} />}
          {currentTab === "sendemail" && <CModalSendEmail />}
          {currentTab === "sendwa" && <CModalSendWa />}
        </div>
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
