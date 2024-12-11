import dayjs from "dayjs";
import { useState } from "react";
import defaultUser from "@/assets/company/defaults/user_default.svg";

const CUpdateCard = ({ update, bgColor = "bg-muted/40" }) => {
  const [showFull, setShowFull] = useState(false);
  const { updated_at, follow_up_date, lead_comments, status } = update;
  const comment =
    lead_comments.length > 75
      ? lead_comments.substring(0, 75) + `...`
      : lead_comments;

  return (
    <figure
      className={`flex flex-col justify-start items-start p-3 rounded-sm ${bgColor}`}
    >
      <blockquote className="mb-1 w-full">
        <div className="text-sm text-start text-muted-foreground">
          {dayjs(updated_at).format("dddd, MMMM D, YYYY h:mm A")}
        </div>
        <p className="text-sm my-2 mb-4 text-muted-foreground">
          {showFull ? lead_comments : comment}{" "}
          <button
            className="text-xs ml-4 text-red-500 font-bold"
            onClick={() => setShowFull(!showFull)}
          >
            {lead_comments.length > 75
              ? showFull
                ? `Show less ...`
                : `Show more ...`
              : null}
          </button>
        </p>
        <div className="my-3 space-y-1.5">
          <p className="flex flex-row text-xs">
            <span className="basis-1/5 uppercase text-muted-foreground">
              Status:{" "}
            </span>
            <span className="font-semibold uppercase">{status}</span>
          </p>
          <p className="flex flex-row text-[11px]">
            <span className="basis-1/5 uppercase text-muted-foreground">
              Follow-up date:{" "}
            </span>
            <span className="font-semibold uppercase">
              {follow_up_date
                ? dayjs(follow_up_date).format("DD/MM/YYYY")
                : `NA`}
            </span>
          </p>
        </div>
      </blockquote>
      <figcaption className="flex items-center justify-center ">
        <img
          className="rounded-full w-7 h-7"
          src={update.user_img || defaultUser}
          alt="profile picture"
        />
        <div className="space-y-0.5 text-xs uppercase font-medium text-muted-foreground text-left ms-3">
          <div>{update.name}</div>
        </div>
      </figcaption>
    </figure>
  );
};
export default CUpdateCard;
