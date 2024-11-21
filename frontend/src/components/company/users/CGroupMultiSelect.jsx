import { newGroupSet } from "@/features/coUsersSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLoaderData } from "react-router-dom";
import Select from "react-select";

const CGroupMultiSelect = ({ coGroups }) => {
  const dispatch = useDispatch();
  const { user } = useLoaderData();

  const dbGroup = [];
  user?.groups?.map((group) => {
    const element = { value: group.gid, label: group.gname };
    group.gid && dbGroup.push(element);
  });

  const [localState, setLocalState] = useState(dbGroup || []);

  const allGroups = [];
  coGroups.map((group) => {
    const element = { value: group.id, label: group.name };
    allGroups.push(element);
  });

  const options = allGroups.filter(
    (obj1) => !localState.some((obj2) => obj1.label === obj2.label)
  );

  const handleChange = async (selected) => {
    setLocalState(selected);
    dispatch(newGroupSet(selected));
  };

  return (
    <Select
      id="groups"
      name="groups"
      styles={style}
      options={options}
      onChange={handleChange}
      value={localState}
      className="flex h-auto w-full items-center justify-between rounded-md border border-input bg-background text-black px-0 py-0 text-sm focus:outline-none"
      isMulti
    />
  );
};
export default CGroupMultiSelect;

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
