import { AdContentWrapper } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";

const ProfileSettings = () => {
  document.title = `Profile Settings | ${import.meta.env.VITE_APP_TITLE}`;

  return (
    <AdContentWrapper>
      <div className="flex flex-row justify-between items-center bg-muted my-4 p-2">
        <h3 className="font-semibold text-sm tracking-widest text-muted-foreground">
          Profile Settings
        </h3>
      </div>
      <div className="my-4"></div>
    </AdContentWrapper>
  );
};
export default ProfileSettings;
