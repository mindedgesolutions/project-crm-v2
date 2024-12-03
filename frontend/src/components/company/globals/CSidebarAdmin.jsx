import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlignJustify,
  ChartNoAxesCombined,
  Home,
  Settings,
} from "lucide-react";
import { useSelector } from "react-redux";
import CSettingsSubmenu from "./subMenus/CSettingsSubmenu";

const CSidebarAdmin = () => {
  let isTabletMid = useMediaQuery({ query: "(max-width: 768px)" });
  const [open, setOpen] = useState(isTabletMid ? false : true);
  const sidebarRef = useRef();
  const { pathname } = useLocation();
  const { currentUser } = useSelector((store) => store.currentUser);

  const settingsSubMenus = [
    {
      name: "settings",
      icon: Settings,
      menus: [
        {
          href: `/app/${currentUser.cslug}/settings/lead-status`,
          label: `lead status`,
        },
        {
          href: `/app/${currentUser.cslug}/settings/lead-categories`,
          label: `lead categories`,
        },
        {
          href: `/app/${currentUser.cslug}/settings/networks`,
          label: `networks`,
        },
        { href: `/app/${currentUser.cslug}/settings/groups`, label: `groups` },
        { href: `/app/${currentUser.cslug}/settings/users`, label: `users` },
      ],
    },
  ];

  const leadsSubMenus = [
    {
      name: "leads",
      icon: ChartNoAxesCombined,
      menus: [
        {
          href: `/app/${currentUser.cslug}/leads/all`,
          label: `leads`,
        },
      ],
    },
  ];

  useEffect(() => {
    isTabletMid ? setOpen(false) : setOpen(true);
  }, [isTabletMid]);

  useEffect(() => {
    isTabletMid && setOpen(false);
  }, [pathname]);

  const Nav_animation = isTabletMid
    ? {
        open: {
          x: 0,
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          x: -250,
          width: 0,
          transition: {
            damping: 40,
            delay: 0.15,
          },
        },
      }
    : {
        open: {
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: "4rem",
          transition: {
            damping: 40,
          },
        },
      };

  return (
    <div>
      <div
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 max-h-screen z-10 bg-transparent ${
          open ? "block" : "hidden"
        } `}
      ></div>
      <motion.div
        ref={sidebarRef}
        variants={Nav_animation}
        initial={{ x: isTabletMid ? -250 : 0 }}
        animate={open ? "open" : "closed"}
        className="bg-muted text-muted-foreground z-10 max-w-[16rem] w-[16rem] overflow-hidden md:relative fixed h-screen"
      >
        <div className="flex justify-center items-center my-2 p-2">
          <Link to={`/app/${currentUser.cslug}/dashboard`}>
            <h3 className="text-3xl font-bold tracking-widest text-primary">
              CRM
            </h3>
          </Link>
        </div>
        <div className="flex flex-col h-full">
          <ul className="whitespace-pre px-2.5 text-[0.9rem] py-4 flex flex-col gap-1 font-medium overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100 md:h-[68%] h-[70%]">
            <li>
              <NavLink
                to={`/app/${currentUser.cslug}/dashboard`}
                className={`w-full flex flex-row justify-start items-center p-2 gap-3 rounded-lg hover:bg-card ${
                  pathname === `/app/${currentUser.cslug}/dashboard`
                    ? "bg-card"
                    : null
                }`}
              >
                <Home size={15} className="text-muted-foreground" />
                <p className="text-muted-foreground text-[0.7rem] uppercase font-semibold tracking-widest">
                  Dashboard
                </p>
              </NavLink>
            </li>
            <div className="">
              {settingsSubMenus?.map((menu) => (
                <div key={menu.name} className="flex flex-col gap-1">
                  <CSettingsSubmenu data={menu} />
                </div>
              ))}
            </div>
            <div className="">
              {leadsSubMenus?.map((menu) => (
                <div key={menu.name} className="flex flex-col gap-1">
                  <CSettingsSubmenu data={menu} />
                </div>
              ))}
            </div>
          </ul>
        </div>
      </motion.div>
      <div className="m-3 md:hidden" onClick={() => setOpen(true)}>
        <AlignJustify size={20} />
      </div>
    </div>
  );
};
export default CSidebarAdmin;
