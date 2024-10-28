import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userType } from "@/utils/data";
import { nanoid } from "nanoid";
import { useState } from "react";
import { Form, useLocation, useNavigate } from "react-router-dom";

const AdUserFilter = ({ total }) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const searchStr = new URLSearchParams(search);
  const typeInput = searchStr.get("type");
  const searchInput = searchStr.get("search");
  const [form, setForm] = useState({
    type: typeInput || "",
    search: searchInput || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ ...form, type: "", search: "" });
    navigate(`/admin/users`);
  };

  return (
    <div className="flex flex-row justify-between items-center bg-muted my-4 p-2">
      <span>
        <h3 className="text-sm tracking-wider text-muted-foreground">
          <span className="font-bold">{total}</span> records found
        </h3>
      </span>
      <Form className="flex flex-row justify-end items-center gap-4">
        <select
          name="type"
          id="type"
          className="flex h-10 min-w-48 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
          value={form.type}
          onChange={handleChange}
        >
          <option value="">- Select -</option>
          {userType.map((type) => {
            return (
              <option key={nanoid()} value={type.typeLabel}>
                {type.typeLabel}
              </option>
            );
          })}
        </select>
        <Input
          className="min-w-48"
          name="search"
          id="search"
          placeholder="name, email or mobile ..."
          value={form.search}
          onChange={handleChange}
        />
        <Button type="submit">Seach</Button>
        <Button type="button" variant="outline" onClick={resetForm}>
          Reset
        </Button>
      </Form>
    </div>
  );
};
export default AdUserFilter;
