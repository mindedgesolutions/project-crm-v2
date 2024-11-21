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
import { Pencil, Trash2 } from "lucide-react";

const CAddEditGroupModal = ({ btnClass, editId }) => {
  const [isLoading, setIsLoading] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", desc: "" });
  const [groupImg, setGroupImg] = useState("");
  const [dbGroupImg, setDbGroupImg] = useState("");
  const dispatch = useDispatch();
  const { coGroups } = useSelector((store) => store.coUsers);
  const group = editId && coGroups?.find((i) => i.id === editId);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setGroupImg(e.target.files[0]);
  };

  const removeFile = () => {
    setGroupImg("");
    document.getElementById("groupImg").value = "";
  };

  // Handle form submit starts ------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("desc", form.desc);
    formData.append("groupImg", groupImg);

    const api = editId ? `/company/groups/${editId}` : `/company/groups`;
    const process = editId ? customFetch.put : customFetch.post;
    const msg = editId ? `Changes saved` : `Group added`;

    try {
      await process(api, formData);
      setForm({ ...form, name: "", desc: "" });
      removeFile();
      showSuccess(msg);

      const cogroups = await customFetch.get(`/company/groups`);
      dispatch(setCoGroups(cogroups.data.data.rows));

      setIsOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
    }
  };
  // Handle form submit ends ------

  useEffect(() => {
    if (group) {
      setForm({ ...form, name: group.name, desc: group.short_desc });
      setDbGroupImg(group.group_img);
    }
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
            <div className="flex flex-col justify-start items-start space-y-2">
              <Label
                htmlFor="groupImg"
                className="text-right text-muted-foreground"
              >
                Group image
              </Label>
              <input
                type="file"
                name="groupImg"
                id="groupImg"
                onChange={handleFileChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div className="flex flex-col justify-start items-start space-y-2">
              <div className="w-32 h-32 p-1 border border-dashed relative">
                <button
                  type="button"
                  className="absolute right-1 text-red-500 hover:text-red-400"
                  onClick={removeFile}
                >
                  <Trash2 />
                </button>
                {groupImg ? (
                  <img
                    src={URL.createObjectURL(groupImg)}
                    alt="No image found"
                  />
                ) : dbGroupImg ? (
                  <img src={dbGroupImg} alt="No image found" />
                ) : null}
              </div>
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
