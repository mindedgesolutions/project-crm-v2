// Website pages start ------
export { default as WbLayout } from "./website/WbLayout";
export { default as WbLanding } from "./website/WbLanding";
export { default as WbAbout } from "./website/WbAbout";
export { default as WbServices } from "./website/WbServices";
export { default as WbRegister } from "./website/WbRegister";
// Website pages end ------

// Admin pages start ------
export { default as AdSignin } from "./admin/auth/AdSignin";
export { default as AdForgotPassword } from "./admin/auth/AdForgotPassword";
export { default as AdResetPassword } from "./admin/auth/AdResetPassword";
export { default as AdLayout } from "./admin/AdLayout";
export { default as AdDashboard } from "./admin/AdDashboard";
export { default as AdError } from "./admin/AdError";
export { default as AdListUsers } from "./admin/users/AdListUsers";
export { default as AdListPlanAttributes } from "./admin/plans/AdListPlanAttributes";
export { default as AdListPlans } from "./admin/plans/AdListPlans";
export { default as AdAddEditPlan } from "./admin/plans/AdAddEditPlan";
// Admin pages end ------

// Company pages start ------
export { default as CSignin } from "./company/cauth/CSignin";
export { default as CForgotPassword } from "./company/cauth/CForgotPassword";
export { default as CResetPassword } from "./company/cauth/CResetPassword";
export { default as CDashboard } from "./company/CDashboard";
export { default as CLayout } from "./company/CLayout";
export { default as CError } from "./company/CError";
export { default as CListCsvUploads } from "./company/csv/CListCsvUploads";
export { default as CUploadCsv } from "./company/csv/CUploadCsv";
export { default as CListUsers } from "./company/cusers/CListUsers";
export { default as CAddEditUser } from "./company/cusers/CAddEditUser";
export { default as CListGroups } from "./company/cusers/CListGroups";
// Company pages end ------
