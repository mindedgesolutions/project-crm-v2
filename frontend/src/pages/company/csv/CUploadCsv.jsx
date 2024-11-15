import {
  AdContentWrapper,
  AdSubmitBtn,
  CGroupCustomSelect,
  CNetworkCustomSelect,
  CNewNetworkPopover,
  CUserMultiselect,
} from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import customFetch from "@/utils/customFetch";
import { splitErrors } from "@/utils/splitErrors";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import instructionsPdf from "@/assets/company/documents/Instructions - CSV upload.pdf";
import demoCsv from "@/assets/company/documents/CsvDemo.csv";
import formatCsv from "@/assets/company/documents/CsvFormat.csv";
import showSuccess from "@/utils/showSuccess";

const CUploadCsv = () => {
  document.title = `Upload CSV | ${import.meta.env.VITE_APP_TITLE}`;
  const { currentUser } = useSelector((store) => store.currentUser);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [coNetworks, setCoNetworks] = useState("");
  const [csvToUpload, setCsvToUpload] = useState("");
  const [assignee, setAssignee] = useState("");
  const [selectedCoGroups, setSelectedCoGroups] = useState("");
  const { currentUsers } = useSelector((store) => store.coUsers);

  const handleFileChange = (e) => {
    setCsvToUpload(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("network", JSON.stringify(coNetworks));
    formData.append("assignType", assignee);
    formData.append("assignGroup", JSON.stringify(selectedCoGroups));
    formData.append("assignUsers", currentUsers);
    formData.append("leads", csvToUpload);
    try {
      await customFetch.post(`/company/leads/upload`, formData);
      setIsLoading(false);
      showSuccess(`Leads uploaded and assigned`);
      navigate(`/app/${currentUser.cslug}/leads/all`);
    } catch (error) {
      setIsLoading(false);
      splitErrors(error?.response?.data?.msg);
      return null;
    }
  };
  return (
    <AdContentWrapper>
      <div className="flex flex-row justify-between items-center bg-muted my-4 p-2">
        <h3 className="font-bold text-xl tracking-widest text-muted-foreground">
          Upload CSV
        </h3>
      </div>
      <div className="my-4">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row justify-between items-center gap-4 mb-4">
            <div className="basis-1/3 flex flex-col space-y-2">
              <Label
                className="text-muted-foreground text-xs uppercase"
                htmlFor="assignee"
              >
                <div className="flex flex-row justify-start items-center">
                  <span>select network</span>
                  <CNewNetworkPopover />
                </div>
              </Label>
              <CNetworkCustomSelect
                setCoNetworks={setCoNetworks}
                coNetworks={coNetworks}
              />
            </div>
            <div className="basis-1/3 flex flex-col space-y-2">
              <Label
                className="text-muted-foreground text-xs uppercase"
                htmlFor="leads"
              >
                select csv <span className="text-red-500">*</span>
              </Label>
              <Input
                type="file"
                name="leads"
                id="leads"
                placeholder="Full name is required"
                className="text-muted-foreground"
                onChange={handleFileChange}
              />
            </div>

            <div className="basis-1/3 flex flex-col space-y-2">
              <Label>&nbsp;</Label>
              <div className="flex flex-row justify-start items-center gap-4">
                <a
                  href={instructionsPdf}
                  download={`Instructions - CSV upload`}
                >
                  <Button variant="outline" type="button">
                    Instructions
                  </Button>
                </a>
                <a href={demoCsv} download={`Demo CSV - CSV Upload`}>
                  <Button type="button">Demo CSV</Button>
                </a>
                <a href={formatCsv} download={`Format - CSV Upload`}>
                  <Button type="button">Format</Button>
                </a>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col mb-4">
            <div className="flex flex-row justify-between items-center bg-muted my-4 p-2">
              <h3 className="font-semibold tracking-widest text-muted-foreground">
                Leads Assign Details
              </h3>
            </div>
            <div className="flex flex-row justify-between items-center gap-4">
              <div className="basis-1/3 flex flex-col space-y-2">
                <Label
                  className="text-muted-foreground text-xs uppercase"
                  htmlFor="assignee"
                >
                  select <span className="text-red-500">*</span>
                </Label>
                <select
                  name="assignee"
                  id="assignee"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none text-muted-foreground"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                >
                  <option value="">- Select -</option>
                  <option value={1}>All users</option>
                  <option value={2}>Group</option>
                  <option value={3}>Users</option>
                </select>
              </div>
              <div className="basis-1/3 flex flex-col space-y-2">
                {assignee === "2" && (
                  <CGroupCustomSelect
                    selectedCoGroups={selectedCoGroups}
                    setSelectedCoGroups={setSelectedCoGroups}
                  />
                )}
                {assignee === "3" && <CUserMultiselect />}
              </div>
              <div className="basis-1/3"></div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-row justify-start items-center my-8 gap-4">
            <AdSubmitBtn
              isLoading={isLoading}
              text={`upload CSV`}
              addClass={`w-auto`}
            />
            <Link to={`/app/${currentUser.cslug}/leads/all`}>
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
export default CUploadCsv;

// Loader function starts ------
export const loader = async () => {
  try {
    const response = await customFetch.get(`/company/all-users`);
    const users = response.data.data.rows;
    return { users };
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    return null;
  }
};
