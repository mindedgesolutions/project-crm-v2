import { Button } from "@/components/ui/button";

const CModalSendWa = () => {
  return (
    <div className="p-2">
      <div className="bg-muted p-1 pl-2 flex flex-row justify-between items-center">
        <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium">
          send whatsapp
        </span>
        <Button
          type="button"
          variant={`outline`}
          className="h-auto p-2 px-3 uppercase text-xs bg-primary text-primary-foreground hover:bg-primary/90"
        >
          send
        </Button>
      </div>
    </div>
  );
};
export default CModalSendWa;
