import { AdSubmitBtn } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateCounter } from "@/features/commonSlice";
import customFetch from "@/utils/customFetch";
import { fieldTypes } from "@/utils/data";
import showSuccess from "@/utils/showSuccess";
import { splitErrors } from "@/utils/splitErrors";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const AdAddEditPlanAttribute = ({ attributes, editId, setEditId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const attr = editId && attributes.find((i) => i.id === editId);

  const [form, setForm] = useState({ attribute: "", type: "" });
  const { search } = useLocation();
  const queryString = new URLSearchParams(search);
  const page = queryString.get("page");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Assigning initial values ------
  useEffect(() => {
    setForm({
      ...form,
      attribute: attr ? attr.attribute : "",
      type: attr ? attr.type : "",
    });
  }, [editId]);

  // Resetting values on page change ------
  useEffect(() => {
    setForm({ ...form, attribute: "", type: "" });
    setEditId("");
  }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    let data = Object.fromEntries(formData);
    const api = editId
      ? `/admin/plan-attributes/${editId}`
      : `/admin/plan-attributes`;
    const action = editId ? customFetch.put : customFetch.post;
    const msg = editId ? `Details updated` : `Attribute added`;

    try {
      await action(api, data);

      dispatch(updateCounter());

      setIsLoading(false);
      setForm({ ...form, attribute: "", type: "" });
      setEditId("");

      showSuccess(msg);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
    }
  };

  const resetForm = () => {
    setForm({ ...form, attribute: "", type: "" });
    setEditId("");
  };

  return (
    <div className="basis-1/3 min-h-40 border rounded-lg p-4">
      <h3 className="text-lg font-medium tracking-wider text-muted-foreground mb-4">
        {editId ? `Edit details` : `Add plan attribute`}
      </h3>
      <Separator />
      <form onSubmit={handleSubmit} autoComplete="off" className="mt-4">
        <div className="w-full items-center space-y-1 mb-4">
          <Label
            htmlFor="attribute"
            className="capitalize text-muted-foreground tracking-widest"
          >
            attribute <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="attribute"
            name="attribute"
            placeholder="A fitting attribute explains the plan better"
            value={form.attribute}
            onChange={handleChange}
          />
        </div>
        <div className="w-full items-center space-y-1 mb-4">
          <Label
            htmlFor="type"
            className="capitalize text-muted-foreground tracking-widest"
          >
            attribute response type <span className="text-red-500">*</span>
          </Label>
          <select
            name="type"
            id="type"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
            value={form.type}
            onChange={handleChange}
          >
            <option value="">- Select -</option>
            {fieldTypes.map((type) => {
              return (
                <option key={nanoid()} value={type}>
                  {type}
                </option>
              );
            })}
          </select>
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
export default AdAddEditPlanAttribute;
