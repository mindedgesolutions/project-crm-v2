import { Label } from "@/components/ui/label";
import { CircleUserRound, Mail, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const CLeadInfoModal = ({ lead }) => {
  return (
    <div className="">
      <div className="flex flex-row w-full justify-start items-start p-2 mb-1">
        <div className="flex flex-row justify-start items-center gap-3 text-muted-foreground">
          <CircleUserRound size={18} />
          <Label className="font-normal uppercase">{lead.name}</Label>
        </div>
      </div>
      <div className="flex flex-row w-full justify-start items-start p-2 mb-1">
        <div className="basis-1/2 flex flex-row justify-start items-center gap-3 text-muted-foreground">
          <div className="basis-1/2 flex flex-row justify-start items-center gap-3 text-muted-foreground">
            <Phone size={18} />
            <Label className="font-normal uppercase">{lead.mobile}</Label>
          </div>
          <div className="basis-1/2 flex flex-row justify-start items-center gap-3 text-muted-foreground">
            <FaWhatsapp size={18} className="text-green-500" />
            <Label className="font-normal uppercase">{lead.mobile}</Label>
          </div>
        </div>
        <div className="basis-1/2 flex flex-row justify-start items-center gap-3 text-muted-foreground">
          <Mail size={18} />
          <Label className="font-normal uppercase">
            {lead.email || `email not available`}
          </Label>
        </div>
      </div>
    </div>
  );
};
export default CLeadInfoModal;
