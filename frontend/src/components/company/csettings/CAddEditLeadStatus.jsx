import { AdSubmitBtn } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateCounter } from "@/features/commonSlice";
import customFetch from "@/utils/customFetch";
import showSuccess from "@/utils/showSuccess";
import { splitErrors } from "@/utils/splitErrors";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const CAddEditLeadStatus = ({ status: dbStatus, editId, setEditId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "" });
  const dispatch = useDispatch();
  const status = editId && dbStatus.find((i) => i.id === editId);
  const { currentUser } = useSelector((store) => store.currentUser);

  const { search } = useLocation();
  const queryString = new URLSearchParams(search);
  const page = queryString.get("page");

  // Assigning initial values ------
  useEffect(() => {
    setForm({ ...form, name: status ? status.status : "" });
  }, [editId]);

  // Resetting values on page change ------
  useEffect(() => {
    setForm({ ...form, name: "" });
    setEditId("");
  }, [page]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    let data = Object.fromEntries(formData);
    const api = editId
      ? `/company/lead-status/${currentUser.company_id}/${editId}`
      : `/company/lead-status/${currentUser.company_id}`;
    const action = editId ? customFetch.put : customFetch.post;
    const msg = editId ? `Details updated` : `Status added`;
    try {
      await action(api, data);
      dispatch(updateCounter());
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
    setEditId("");
  };

  return (
    <div className="basis-1/3 min-h-40 border rounded-lg p-4">
      <h3 className="text-lg font-medium tracking-wider text-muted-foreground mb-4">
        {editId ? `Edit details` : `Add new status`}
      </h3>
      <Separator />
      <form onSubmit={handleSubmit} autoComplete="off" className="mt-4">
        <div className="w-full items-center space-y-1 mb-4">
          <Label
            htmlFor="name"
            className="capitalize text-muted-foreground tracking-widest"
          >
            lead status <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="A new status, as per your need"
            value={form.name}
            onChange={handleChange}
          />
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
export default CAddEditLeadStatus;
