import { useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import groupImg from "@/assets/company/defaults/group_default.png";
import { Label } from "@/components/ui/label";
import { CGroupPopover } from "@/components";

const CGroupCustomSelect = ({ selectedCoGroups, setSelectedCoGroups }) => {
  const { coGroups } = useSelector((store) => store.coUsers);
  const [localState, setLocalState] = useState("");

  const options = [];
  coGroups.map((group) => {
    const option = {
      value: group.id,
      label: group.name,
      imageUrl: group.group_img ?? null,
    };
    options.push(option);
  });

  const customSingleValue = ({ data }) => (
    <span className="flex items-center text-muted-foreground -mt-6">
      {data.imageUrl ? (
        <img
          src={data.imageUrl}
          alt={import.meta.env.VITE_APP_TITLE}
          className="h-6 w-auto mr-3"
        />
      ) : (
        <img
          src={groupImg}
          alt={import.meta.env.VITE_APP_TITLE}
          className="h-6 w-auto mr-3"
        />
      )}
      {data.label}
    </span>
  );

  const customOption = (props) => (
    <span {...props.innerProps} className="flex items-center p-2 text-black">
      {props.data.imageUrl ? (
        <img src={props.data.imageUrl} alt="" className="h-6 w-auto mr-3" />
      ) : (
        <img
          src={groupImg}
          alt={import.meta.env.VITE_APP_TITLE}
          className="h-6 w-auto mr-3"
        />
      )}
      {props.data.label}
    </span>
  );

  const handleChange = async (selected) => {
    setLocalState(selected);
    setSelectedCoGroups(selected);
  };

  const selectedGroup =
    localState && coGroups?.find((group) => +group.id === +localState?.value);

  return (
    <>
      <Label
        className="text-muted-foreground text-xs uppercase"
        htmlFor="assignee"
      >
        group <span className="text-red-500">*</span>
      </Label>
      <div className="flex flex-row">
        <Select
          id="groups"
          name="groups"
          styles={style}
          options={options}
          components={{ SingleValue: customSingleValue, Option: customOption }}
          onChange={handleChange}
          value={selectedCoGroups}
          className="flex h-auto w-full items-center justify-between rounded-md border border-input bg-background px-0 py-0 text-sm focus:outline-none"
        />
        {selectedCoGroups && (
          <CGroupPopover users={selectedGroup.details.users} />
        )}
      </div>
    </>
  );
};
export default CGroupCustomSelect;

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
