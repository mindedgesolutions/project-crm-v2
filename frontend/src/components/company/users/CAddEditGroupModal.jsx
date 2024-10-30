import { AdSubmitBtn } from "@/components";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { splitErrors } from "@/utils/splitErrors";
import customFetch from "@/utils/customFetch";
import showSuccess from "@/utils/showSuccess";
import { useDispatch, useSelector } from "react-redux";
import { setCoGroups } from "@/features/coUsersSlice";
import { Pencil } from "lucide-react";

const CAddEditGroupModal = ({ btnClass, editId }) => {
  const [isLoading, setIsLoading] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", desc: "" });
  const dispatch = useDispatch();
  const { coGroups } = useSelector((store) => store.coUsers);
  const group = editId && coGroups?.find((i) => i.id === editId);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const api = editId ? `/company/groups/${editId}` : `/company/groups`;
    const process = editId ? customFetch.put : customFetch.post;
    const msg = editId ? `Changes saved` : `Group added`;
    try {
      await process(api, data);
      setForm({ ...form, name: "", desc: "" });
      showSuccess(msg);

      const cogroups = await customFetch.get(`/company/groups`);
      dispatch(setCoGroups(cogroups.data.data.rows));

      setIsOpen(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
    }
  };

  useEffect(() => {
    group && setForm({ ...form, name: group.name, desc: group.short_desc });
  }, [editId]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {editId ? (
          <button type="button">
            <Pencil
              size={16}
              className="text-muted-foreground transition duration-200 group-hover:text-yellow-500"
            />
          </button>
        ) : (
          <Button
            type="button"
            className={
              btnClass ||
              `bg-primary w-28 h-8 uppercase tracking-widest text-xs`
            }
          >
            add group
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-muted-foreground tracking-wider">
            {editId ? `Update group details` : `Add new group`}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="grid gap-4 py-4">
            <div className="flex flex-col justify-start items-start space-y-2">
              <Label
                htmlFor="name"
                className="text-right text-muted-foreground"
              >
                Group name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                className="col-span-3"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col justify-start items-start space-y-2">
              <Label
                htmlFor="desc"
                className="text-right text-muted-foreground"
              >
                Description
              </Label>
              <Input
                id="desc"
                name="desc"
                className="col-span-3"
                value={form.desc}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <AdSubmitBtn
              addClass={`w-auto`}
              text={`save`}
              isLoading={isLoading}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CAddEditGroupModal;
