import { useRouteError } from "react-router-dom";

const CError = () => {
  const error = useRouteError();
  console.log(error);

  return <div>CError</div>;
};
export default CError;
