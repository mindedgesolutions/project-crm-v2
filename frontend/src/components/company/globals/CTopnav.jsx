import { CProfileContainer } from "@/components";
import { ModeToggle } from "@/components/ModeToggle";
import { useSelector } from "react-redux";

const CTopnav = () => {
  const { currentUser } = useSelector((store) => store.currentUser);

  return (
    <section className="w-full bg-muted shadow-lg p-2 flex flex-row justify-end items-center gap-2 pr-8">
      <ModeToggle />
      <span className="text-sm text-muted-foreground font-medium">
        Welcome{" "}
        <span className="uppercase tracking-wider ml-1">
          {currentUser.name}
        </span>
      </span>
      <CProfileContainer />
    </section>
  );
};
export default CTopnav;
