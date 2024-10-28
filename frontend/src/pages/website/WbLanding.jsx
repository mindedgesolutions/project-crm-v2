import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WbLanding = () => {
  return (
    <div className="p-8">
      WbLanding
      <div className="mt-4 flex flex-row justify-start items-start gap-4">
        <Link to={`/admin/sign-in`}>
          <Button>Go to Admin</Button>
        </Link>
        <Link to={`/sign-up`}>
          <Button>Company Register</Button>
        </Link>
        <Link to={`/sign-in`}>
          <Button>Company Login</Button>
        </Link>
      </div>
    </div>
  );
};
export default WbLanding;
