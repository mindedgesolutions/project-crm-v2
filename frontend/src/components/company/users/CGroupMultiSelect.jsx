import Select from "react-select";

const CGroupMultiSelect = ({ coGroups, selectedGroups, setSelectedGroups }) => {
  const dbGroup = [];
  coGroups.map((group) => {
    const element = { value: group.id, label: group.name };
    dbGroup.push(element);
  });

  const handleChange = async (selected) => {
    setSelectedGroups(selected);
  };

  return (
    <Select
      id="groups"
      name="groups"
      styles={style}
      options={dbGroup}
      onChange={handleChange}
      value={selectedGroups}
      className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-0 py-2 text-sm focus:outline-none"
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
  }),
};
