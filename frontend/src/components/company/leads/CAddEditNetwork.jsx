import { AdSubmitBtn } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateCounter } from "@/features/commonSlice";
import customFetch from "@/utils/customFetch";
import showSuccess from "@/utils/showSuccess";
import { splitErrors } from "@/utils/splitErrors";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CAddEditNetwork = ({ networks: dbNetworks, editId, setEditId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "" });
  const [networkImg, setNetworkImg] = useState("");
  const [dbNetworkImg, setDbNetworkImg] = useState("");
  const dispatch = useDispatch();
  const network = editId && dbNetworks.find((i) => i.id === editId);
  const { currentUser } = useSelector((store) => store.currentUser);

  const handleFileChange = (e) => {
    setNetworkImg(e.target.files[0]);
  };

  const removeFile = () => {
    setNetworkImg("");
    document.getElementById("networkImg").value = "";
  };

  // Assigning initial values ------
  useEffect(() => {
    if (network) {
      setForm({ ...form, name: network ? network.network : "" });
      setDbNetworkImg(network.network_img);
    }
  }, [editId]);

  // Resetting values on page change ------
  useEffect(() => {
    setForm({ ...form, name: "" });
    setEditId("");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("networkImg", networkImg);
    const api = editId
      ? `/company/co-networks/${editId}`
      : `/company/co-networks`;
    const action = editId ? customFetch.put : customFetch.post;
    const msg = editId ? `Details updated` : `Network added`;
    try {
      await action(api, formData);
      dispatch(updateCounter());
      removeFile();
      setIsLoading(false);
      setForm({ ...form, name: "" });
      setEditId("");
      showSuccess(msg);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
    }
  };

  const resetForm = () => {
    setForm({ ...form, name: "" });
    removeFile();
    setEditId("");
  };

  return (
    <div className="basis-1/3 min-h-40 border rounded-lg p-4">
      <h3 className="text-lg font-medium tracking-wider text-muted-foreground mb-4">
        {editId ? `Edit details` : `Add new network`}
      </h3>
      <Separator />
      <form onSubmit={handleSubmit} autoComplete="off" className="mt-4">
        <div className="w-full items-center space-y-1 mb-4">
          <Label
            htmlFor="name"
            className="capitalize text-muted-foreground tracking-widest"
          >
            network <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="A new network, as per your need"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div className="w-full items-center space-y-1 mb-2">
          <Label
            htmlFor="name"
            className="capitalize text-muted-foreground tracking-widest"
          >
            network icon
          </Label>
          <input
            type="file"
            id="networkImg"
            name="networkImg"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
            onChange={handleFileChange}
          />
        </div>
        <div className="h-28 w-28 border border-dashed p-2 mb-4 relative">
          <button
            type="button"
            className="absolute right-1 text-red-500 hover:text-red-400"
            onClick={removeFile}
          >
            <Trash2 />
          </button>
          {networkImg ? (
            <img src={URL.createObjectURL(networkImg)} alt="No image found" />
          ) : dbNetworkImg ? (
            <img src={dbNetworkImg} alt="No image found" />
          ) : null}
        </div>
        <Separator />
        <div className="w-full flex flex-row justify-between items-center mt-4">
          <Button type="button" variant="outline" onClick={resetForm}>
            Reset
          </Button>
          <AdSubmitBtn
            text={editId ? `Update` : `Add`}
            isLoading={isLoading}
            addClass={`my-0`}
          />
        </div>
      </form>
    </div>
  );
};
export default CAddEditNetwork;
