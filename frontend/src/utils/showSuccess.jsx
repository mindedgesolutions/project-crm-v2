import { CircleCheckBig } from "lucide-react";
import toast from "react-hot-toast";

const showSuccess = (msg) => {
  return toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex flex-col w-full p-4 space-y-1">
        <div className="flex flex-row justify-center items-start gap-2">
          <div className="flex-shrink-0 pt-0.5">
            <CircleCheckBig size={16} className="text-green-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">{msg}</p>
          </div>
        </div>
      </div>

      <div className="flex">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-green-600 hover:text-green-500 focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  ));
};
export default showSuccess;
