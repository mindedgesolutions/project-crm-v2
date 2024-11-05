import {
  AdContentWrapper,
  AdSubmitBtn,
  CGroupMultiSelect,
  CNewGroupPopover,
} from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { newGroupSet } from "@/features/coUsersSlice";
import customFetch from "@/utils/customFetch";
import { decParam } from "@/utils/functions";
import showSuccess from "@/utils/showSuccess";
import { splitErrors } from "@/utils/splitErrors";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";

const CAddEditUser = () => {
  const { currentUser } = useSelector((store) => store.currentUser);
  const { coGroups, currentGroups } = useSelector((store) => store.coUsers);
  const { uuid: uuidEnc } = useParams();
  const uuid = uuidEnc && decParam(uuidEnc);
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    role: user?.role || "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  document.title = `${
    uuid ? `Edit details of ${form.name}` : `Add New User`
  } | ${import.meta.env.VITE_APP_TITLE}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget); // Handling incoming data starts ------
    let data = Object.fromEntries(formData);
    data = { ...data, groups: currentGroups };
    data = uuid ? { ...data, password: 123456 } : data;
    const api = uuid ? `/company/users/${uuid}` : `/company/users`;
    const process = uuid ? customFetch.put : customFetch.post;
    const msg = uuid ? `Details updated` : `User added`; // Handling incoming data ends ------

    try {
      await process(api, data);
      showSuccess(msg);
      if (uuid) {
        navigate(`/app/${currentUser.cslug}/settings/users`);
      } else {
        setForm({
          ...form,
          name: "",
          email: "",
          mobile: "",
          role: "",
          password: "",
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
    }
  };

  return (
    <AdContentWrapper>
      <div className="flex flex-row justify-between items-center bg-muted my-4 p-2">
        <h3 className="font-bold text-xl tracking-widest text-muted-foreground">
          {uuid ? `Details of : ${form.name}` : `Add new user`}
        </h3>
      </div>
      <div className="my-4">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row justify-between items-center gap-4 mb-2">
            <div className="basis-1/3 flex flex-col space-y-2">
              <Label
                className="text-muted-foreground text-xs uppercase"
                htmlFor="name"
              >
                name <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Full name is required"
                value={form.name}
                onChange={handleChange}
                autoFocus={true}
              />
            </div>
            <div className="basis-1/3 flex flex-col space-y-2">
              <Label
                className="text-muted-foreground text-xs uppercase"
                htmlFor="email"
              >
                email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="email"
                id="email"
                placeholder="A valid email is a must"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="basis-1/3 flex flex-col space-y-2">
              <Label
                className="text-muted-foreground text-xs uppercase"
                htmlFor="mobile"
              >
                mobile <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="mobile"
                id="mobile"
                placeholder="A valid mobile no. is a must"
                value={form.mobile}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between items-center gap-4 mt-4 mb-4">
            <div className="basis-1/3 flex flex-col space-y-2">
              <Label
                className="text-muted-foreground text-xs uppercase"
                htmlFor="price"
              >
                role <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-row justify-start items-center gap-4 py-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value={"2"}
                    id={`admin`}
                    checked={form.role.toString() === "2"}
                    onChange={handleChange}
                  />
                  <Label
                    htmlFor={`admin`}
                    className="text-xs uppercase font-normal text-muted-foreground"
                  >
                    Admin
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value={"3"}
                    id={`manager`}
                    checked={form.role.toString() === "3"}
                    onChange={handleChange}
                  />
                  <Label
                    htmlFor={`manager`}
                    className="text-xs uppercase font-normal text-muted-foreground"
                  >
                    Manager
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value={"4"}
                    id={`user`}
                    checked={form.role.toString() === "4"}
                    onChange={handleChange}
                  />
                  <Label
                    htmlFor={`user`}
                    className="text-xs uppercase font-normal text-muted-foreground"
                  >
                    User
                  </Label>
                </div>
              </div>
            </div>
            {/* // Multi-select starts ------ */}
            <div className="basis-1/3 flex flex-col space-y-2">
              <Label
                className="text-muted-foreground text-xs uppercase"
                htmlFor="group"
              >
                <div className="flex flex-row justify-start items-center">
                  <span>group</span>
                  <CNewGroupPopover setForm={setForm} form={form} />
                </div>
              </Label>
              <CGroupMultiSelect coGroups={coGroups} />
            </div>
            {/* // Multi-select ends ------ */}
            <div className="basis-1/3">&nbsp;</div>
          </div>

          <Separator />

          <div className="flex flex-col mb-4">
            <div className="flex flex-row justify-between items-center bg-muted my-4 p-2">
              <h3 className="font-semibold tracking-widest text-muted-foreground">
                Login credentials
              </h3>
            </div>
            <div className="flex flex-row justify-between items-center gap-4">
              <div className="basis-1/3 flex flex-col space-y-2">
                <Label
                  className="text-muted-foreground text-xs uppercase"
                  htmlFor="username"
                >
                  username <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Full name is required"
                  value={form.email}
                  readOnly={true}
                />
              </div>
              <div className="basis-1/3 flex flex-col space-y-2">
                <Label
                  className="text-muted-foreground text-xs uppercase"
                  htmlFor="password"
                >
                  password <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Keep it simple for now"
                  value={uuid ? `********` : form.password}
                  onChange={handleChange}
                  disabled={uuid ? true : false}
                  className={uuid ? `bg-gray-100` : null}
                />
              </div>
              <div className="basis-1/3">&nbsp;</div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-row justify-start items-center my-8 gap-4">
            <AdSubmitBtn
              isLoading={isLoading}
              text={uuid ? `save changes` : `add user`}
              addClass={`w-auto`}
            />
            <Link to={`/app/${currentUser.cslug}/settings/users`}>
              <Button type="button" variant="outline" className="uppercase">
                Back to users
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </AdContentWrapper>
  );
};
export default CAddEditUser;

// Loader function starts ------
export const loader =
  (store) =>
  async ({ params }) => {
    const { uuid: uuidEnc } = params;
    const uuid = uuidEnc && decParam(uuidEnc);
    const { currentUser } = store.getState().currentUser;

    try {
      const response = await customFetch.get(`/company/users/${uuid}`);
      const user = uuid ? response.data.data.rows[0] : {};
      store.dispatch(newGroupSet(response?.data?.data?.rows[0]?.groups || []));

      return { user };
    } catch (error) {
      console.log(error);
      splitErrors(error?.response?.data?.msg);
      return redirect(`/app/${currentUser.cslug}/settings/users`);
    }
  };
