import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { useLoaderData } from "react-router-dom";

const CLeadDetails = () => {
  const { lead } = useLoaderData();
  const other = lead.other ? lead.other && JSON.parse(lead?.other) : {};

  return (
    <div className="p-1 border border-muted shadow-lg">
      <div className="bg-muted p-2 flex flex-row justify-end items-end gap-2">
        <span className="text-muted-foreground text-xs capitalize tracking-wider">
          added by{" "}
          <span className="uppercase font-semibold">{lead.addedby}</span> on
          <span className="mx-2 font-semibold">
            {dayjs(lead.created_at).format("dddd, MMMM D, YYYY h:mm A")}
          </span>{" "}
        </span>
      </div>
      <div className="p-2">
        <div className="flex flex-row justify-start items-center mb-3 gap-4">
          <span className="basis-1/3 text-muted-foreground/80 text-xs tracking-wider flex flex-row justify-between items-center">
            <span>Client name</span>
            <span>:</span>
          </span>
          <span className="text-muted-foreground text-xs tracking-wider uppercase">
            {lead.name}
          </span>
        </div>
        <div className="flex flex-row justify-start items-center mb-3 gap-4">
          <span className="basis-1/3 text-muted-foreground/80 text-xs tracking-wider flex flex-row justify-between items-center">
            <span>Mobile no.</span>
            <span>:</span>
          </span>
          <span className="text-muted-foreground text-xs tracking-wider">
            {lead.mobile}
          </span>
        </div>
        <div className="flex flex-row justify-start items-center mb-3 gap-4">
          <span className="basis-1/3 text-muted-foreground/80 text-xs tracking-wider flex flex-row justify-between items-center">
            <span>WhatsApp no.</span>
            <span>:</span>
          </span>
          <span className="text-muted-foreground text-xs tracking-wider">
            {lead.whatsapp}
          </span>
        </div>
        <div className="flex flex-row justify-start items-center mb-3 gap-4">
          <span className="basis-1/3 text-muted-foreground/80 text-xs tracking-wider flex flex-row justify-between items-center">
            <span>Email</span>
            <span>:</span>
          </span>
          <span className="text-muted-foreground text-xs tracking-wider">
            {lead.email}
          </span>
        </div>
        <div className="flex flex-row justify-start items-center mb-3 gap-4">
          <span className="basis-1/3 text-muted-foreground/80 text-xs tracking-wider flex flex-row justify-between items-center">
            <span>Address</span>
            <span>:</span>
          </span>
          <span className="text-muted-foreground text-xs tracking-wider">
            {lead.address || `N/A`}
          </span>
        </div>
        <div className="flex flex-row justify-start items-center mb-3 gap-4">
          <span className="basis-1/3 text-muted-foreground/80 text-xs tracking-wider flex flex-row justify-between items-center">
            <span>City</span>
            <span>:</span>
          </span>
          <span className="text-muted-foreground text-xs tracking-wider">
            {lead.city || `N/A`}
          </span>
        </div>
        <div className="flex flex-row justify-start items-center gap-4">
          <span className="basis-1/3 text-muted-foreground/80 text-xs tracking-wider flex flex-row justify-between items-center">
            <span>State</span>
            <span>:</span>
          </span>
          <span className="text-muted-foreground text-xs tracking-wider">
            {lead.state || `N/A`}
          </span>
        </div>
      </div>
      <div className="bg-muted p-2 flex flex-row justify-start items-start mt-2 gap-2">
        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          other information
        </span>
      </div>
      <div className="p-2">
        {Object.entries(other).length > 0 ? (
          Object.entries(other)?.map(([key, value]) => {
            return (
              <div
                key={nanoid()}
                className="flex flex-row justify-start items-center mb-3 gap-4"
              >
                <span className="basis-1/3 text-muted-foreground/80 text-xs tracking-wider flex flex-row justify-between items-center">
                  <span>{key}</span>
                  <span>:</span>
                </span>
                <span className="text-muted-foreground text-xs tracking-wider uppercase">
                  {value}
                </span>
              </div>
            );
          })
        ) : (
          <span className="text-muted-foreground/80 text-xs tracking-wider uppercase">
            No data available
          </span>
        )}
      </div>
    </div>
  );
};
export default CLeadDetails;
