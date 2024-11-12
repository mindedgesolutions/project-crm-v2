import { useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import networkImg from "@/assets/company/defaults/network_default.png";

const CNetworkCustomSelect = ({ setCoNetworks, coNetworks }) => {
  const { networks } = useSelector((store) => store.networks);
  const [localState, setLocalState] = useState("");

  const options = [];
  networks.map((network) => {
    const option = {
      value: network.id,
      label: network.network,
      imageUrl: network.network_img ?? null,
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
          src={networkImg}
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
          src={networkImg}
          alt={import.meta.env.VITE_APP_TITLE}
          className="h-6 w-auto mr-3"
        />
      )}
      {props.data.label}
    </span>
  );

  const handleChange = async (selected) => {
    setLocalState(selected);
    setCoNetworks(selected);
  };

  return (
    <Select
      id="networks"
      name="networks"
      styles={style}
      options={options}
      components={{ SingleValue: customSingleValue, Option: customOption }}
      onChange={handleChange}
      value={coNetworks}
      className="flex h-auto w-full items-center justify-between rounded-md border border-input bg-background px-0 py-0 text-sm focus:outline-none"
    />
  );
};
export default CNetworkCustomSelect;

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
