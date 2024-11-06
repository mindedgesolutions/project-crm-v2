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
import customFetch from "@/utils/customFetch";
import showSuccess from "@/utils/showSuccess";
import { splitErrors } from "@/utils/splitErrors";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const AddLead = () => {
  const { currentUser } = useSelector((store) => store.currentUser);
  const { coGroups, currentGroups } = useSelector((store) => store.coUsers);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    leadType: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  document.title = `Add New Lead | ${import.meta.env.VITE_APP_TITLE}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = { ...form, groups: currentGroups };
      await customFetch.post(`/company/leads`, data);
      showSuccess("Lead added successfully");

      // Reset form fields after successful submission
      setForm({
        name: "",
        email: "",
        phone: "",
        leadType: "",
      });
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
          Add New Lead
        </h3>
      </div>
      <div className="my-4">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row justify-between items-center gap-4 mb-2">
            {/* Lead Name */}
            <div className="basis-1/3 flex flex-col space-y-2">
              <Label
                className="text-muted-foreground text-xs uppercase"
                htmlFor="name"
              >
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Full name is required"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            {/* Lead Email */}
            <div className="basis-1/3 flex flex-col space-y-2">
              <Label
                className="text-muted-foreground text-xs uppercase"
                htmlFor="email"
              >
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Valid email is required"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            {/* Lead Phone */}
            <div className="basis-1/3 flex flex-col space-y-2">
              <Label
                className="text-muted-foreground text-xs uppercase"
                htmlFor="phone"
              >
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                type="tel"
                name="phone"
                id="phone"
                placeholder="Valid phone number is required"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="flex flex-row justify-between items-center gap-4 mt-4 mb-4">
            {/* Lead Type */}
            <div className="basis-1/3 flex flex-col space-y-2">
              <Label
                className="text-muted-foreground text-xs uppercase"
                htmlFor="leadType"
              >
                Lead Type <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-row justify-start items-center gap-4 py-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="leadType"
                    value="potential"
                    id="potential"
                    checked={form.leadType === "potential"}
                    onChange={handleChange}
                  />
                  <Label
                    htmlFor="potential"
                    className="text-xs uppercase font-normal text-muted-foreground"
                  >
                    Potential
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="leadType"
                    value="confirmed"
                    id="confirmed"
                    checked={form.leadType === "confirmed"}
                    onChange={handleChange}
                  />
                  <Label
                    htmlFor="confirmed"
                    className="text-xs uppercase font-normal text-muted-foreground"
                  >
                    Confirmed
                  </Label>
                </div>
              </div>
            </div>
            {/* Lead Group */}
            <div className="basis-1/3 flex flex-col space-y-2">
              <Label
                className="text-muted-foreground text-xs uppercase"
                htmlFor="group"
              >
                <div className="flex flex-row justify-start items-center">
                  <span>Group</span>
                  <CNewGroupPopover setForm={setForm} form={form} />
                </div>
              </Label>
              <CGroupMultiSelect coGroups={coGroups} />
            </div>
            <div className="basis-1/3">&nbsp;</div>
          </div>

          <Separator />

          <div className="flex flex-row justify-start items-center my-8 gap-4">
            <AdSubmitBtn
              isLoading={isLoading}
              text="Add Lead"
              addClass="w-auto"
            />
            <Link to={`/app/${currentUser.cslug}/lead-manager/leads`}>
              <Button type="button" variant="outline" className="uppercase">
                Back to leads
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </AdContentWrapper>
  );
};

export default AddLead;
