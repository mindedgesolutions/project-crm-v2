import { createBrowserRouter, RouterProvider } from "react-router-dom";
import * as Crm from "@/pages";
import store from "./store";

// Actions start ------
import { action as adSigninAction } from "@/pages/admin/auth/AdSignin";
import { action as cSigninAction } from "@/pages/company/cauth/CSignin";

// Loaders start ------
import { loader as adLayoutLoader } from "@/pages/admin/AdLayout";
import { loader as adAddEditPlanLoader } from "@/pages/admin/plans/AdAddEditPlan";
import { loader as adListPlansLoader } from "@/pages/admin/plans/AdListPlans";
import { loader as cLayoutLoader } from "@/pages/company/CLayout";
import { loader as cAddEditUserLoader } from "@/pages/company/cusers/CAddEditUser";
import { loader as cUploadCsvLoader } from "@/pages/company/csv/CUploadCsv";
import { loader as cListLeadsLoader } from "@/pages/company/cleads/CListLeads";
import { loader as cListLeadsUserLoader } from "@/pages/company/cleads/CListLeadsUser";

const router = createBrowserRouter([
  // Website routes start ------
  {
    path: `/`,
    element: <Crm.WbLayout />,
    children: [
      { index: true, element: <Crm.WbLanding /> },
      { path: `who-are-we`, element: <Crm.WbAbout /> },
      { path: `what-we-do`, element: <Crm.WbServices /> },
      { path: `refund-policies`, element: <Crm.WbRefundPolicies /> },
      { path: `terms-and-conditions`, element: <Crm.WbTermsAndConditions /> },
      { path: `contact-us`, element: <Crm.WbContactUs /> },
      { path: `sign-up`, element: <Crm.WbRegister /> },
    ],
  },
  // Website routes end ------

  // Admin routes start ------
  {
    path: `admin/sign-in`,
    element: <Crm.AdSignin />,
    action: adSigninAction,
  },
  { path: `admin/forgot-password`, element: <Crm.AdForgotPassword /> },
  { path: `admin/reset-password`, element: <Crm.AdResetPassword /> },
  {
    path: `admin`,
    element: <Crm.AdLayout />,
    loader: adLayoutLoader(store),
    errorElement: <Crm.AdError />,
    children: [
      { path: `dashboard`, element: <Crm.AdDashboard /> },
      { path: `profile`, element: <Crm.ProfileSettings /> },
      { path: `change-password`, element: <Crm.ChangePassword /> },
      { path: `dashboard`, element: <Crm.AdDashboard /> },
      { path: `users`, element: <Crm.AdListUsers /> },
      {
        path: `masters/plan-attributes`,
        element: <Crm.AdListPlanAttributes />,
      },
      {
        path: `masters/plans`,
        element: <Crm.AdListPlans />,
        loader: adListPlansLoader,
      },
      {
        path: `masters/plan/:id?`,
        element: <Crm.AdAddEditPlan />,
        loader: adAddEditPlanLoader,
      },
    ],
  },
  // Admin routes end ------

  // Company routes start ------
  { path: `sign-in`, element: <Crm.CSignin />, action: cSigninAction },
  { path: `forgot-password`, element: <Crm.CForgotPassword /> },
  { path: `reset-password`, element: <Crm.CResetPassword /> },
  {
    path: `app/:companySlug`,
    element: <Crm.CLayout />,
    loader: cLayoutLoader(store),
    errorElement: <Crm.CError />,
    children: [
      { path: `dashboard`, element: <Crm.CDashboard /> },
      { path: `profile`, element: <Crm.ProfileSettings /> },
      { path: `change-password`, element: <Crm.ChangePassword /> },
      // Settings related routes start ------
      { path: `settings/users`, element: <Crm.CListUsers /> },
      {
        path: `settings/user`,
        element: <Crm.CAddEditUser />,
        loader: cAddEditUserLoader(store),
      },
      {
        path: `settings/user/:uuid/edit`,
        element: <Crm.CAddEditUser />,
        loader: cAddEditUserLoader(store),
      },
      { path: `settings/networks`, element: <Crm.CListNetworks /> },
      { path: `settings/groups`, element: <Crm.CListGroups /> },
      { path: `settings/lead-status`, element: <Crm.CListLeadStatus /> },
      {
        path: `settings/lead-categories`,
        element: <Crm.CListLeadCategories />,
      },
      // Settings related routes end ------

      // Leads related routes start ------
      {
        path: `leads/all`,
        element: <Crm.CListLeads />,
        loader: cListLeadsLoader(store),
      },
      {
        path: `leads/my-leads`,
        element: <Crm.CListLeadsUser />,
        loader: cListLeadsUserLoader(store),
      },
      { path: `leads/lead/:uuid?`, element: <Crm.CAddSingleLead /> },
      {
        path: `leads/upload-csv`,
        element: <Crm.CUploadCsv />,
        loader: cUploadCsvLoader,
      },
    ],
  },
  // Company routes end ------
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
