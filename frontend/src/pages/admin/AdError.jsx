import { useRouteError } from "react-router-dom";

const AdError = () => {
  const error = useRouteError();
  console.log(error);
  return <div>AdError</div>;
};
export default AdError;
