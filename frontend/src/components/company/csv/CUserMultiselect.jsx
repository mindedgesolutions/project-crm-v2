import { Label } from "@/components/ui/label";
import { newUserSet } from "@/features/coUsersSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLoaderData } from "react-router-dom";
import Select from "react-select";

const CUserMultiselect = () => {
  const dispatch = useDispatch();
  const { users } = useLoaderData();

  const dbUsers = [];
  users?.map((user) => {
    const element = { value: user.id, label: user.name };
    dbUsers.push(element);
  });

  const [localState, setLocalState] = useState([]);

  const options = dbUsers;

  const handleChange = async (selected) => {
    setLocalState(selected);
    dispatch(newUserSet(selected));
  };

  return (
    <>
      <Label
        className="text-muted-foreground text-xs uppercase"
        htmlFor="assignee"
      >
        user(s) <span className="text-red-500">*</span>
      </Label>
      <Select
        id="users"
        name="users"
        styles={style}
        options={options}
        onChange={handleChange}
        value={localState}
        className="flex h-auto w-full items-center justify-between rounded-md border border-input bg-background text-black px-0 py-0 text-sm focus:outline-none"
        isMulti
      />
    </>
  );
};
export default CUserMultiselect;

const style = {
  control: (base, state) => ({
    ...base,
    borderTop: state.isFocused ? 0 : 0,
    borderLeft: 0,
    borderRight: 0,
    borderBottom: 0,
    boxShadow: state.isFocused ? 0 : 0,
    "&:hover": {
      border: state.isFocused ? 0 : 0,
    },
    width: "100%",
    background: "inherit",
  }),
};
