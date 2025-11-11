import { createContext, useState, useEffect, useRef } from "react";
import { HiDesktopComputer } from "react-icons/hi";
import { Link } from "react-router-dom";
import getInitials from "../utils/getInitials";
import {
  LuChevronFirst,
  LuCircleCheckBig,
  LuEllipsisVertical,
  LuChevronLast,
} from "react-icons/lu";

export const SidebarContext = createContext();

export default (props) => {
  const [expanded, setExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const EXPANDED_WIDTH = "21.5rem";
  const COLLAPSED_WIDTH = "4.2rem";
  const currentWidth = expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (props.onWidthChange) {
      props.onWidthChange(currentWidth);
    }
  }, [currentWidth, props.onWidthChange]);

  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-tanager-bg border-r shadow-sm transition-all duration-300"
      style={{ width: currentWidth }}
    >
      <nav className="h-full flex flex-col">
        <div className="p-3 pb-2 flex items-center w-full">
          <div
            className={`flex items-center gap-x-2 transition-all duration-300 overflow-hidden ${
              expanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
            }`}
          >
            <Link className="flex items-center h-12 text-4xl gap-x-2" to="/">
              <LuCircleCheckBig />
              <h1>Tanager</h1>
            </Link>
          </div>

          {expanded ? <div className="flex-1" /> : null}

          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="flex items-center justify-center w-10 h-10 text-4xl rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all duration-300 mx-auto"
          >
            {expanded ? <LuChevronFirst /> : <LuChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 flex flex-col px-3">{props.children}</ul>
        </SidebarContext.Provider>

        <div
          ref={menuRef}
          className="border-t w-full flex items-center py-3 px-3 transition-all duration-300"
        >
          {/* Avatar */}
          <div
            className={
              props.user
                ? `group flex justify-center items-center text-xl font-medium w-10 h-10 rounded-md flex-shrink-0 mx-auto bg-indigo-200 transition-colors  ${
                    expanded ? "" : "hover:bg-indigo-300 cursor-pointer"
                  }`
                : `flex justify-center items-center rounded-md text-center cursor-pointer bg-tanager-primary text-tanager-bg mx-auto transition-all duration-300 ${
                    expanded ? "text-nowrap py-2 px-4 text-lg" : "py-1 px-1"
                  }`
            }
            onClick={() => {
              if (!expanded) setShowMenu((prev) => !prev);
            }}
          >
            {props.user ? (
              <span>{getInitials(props.user.name)}</span>
            ) : (
              <Link to={"/login"}>Sign in</Link>
            )}

            {!expanded ? (
              <div
                className="absolute font-medium left-14 rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 
                text-sm text-nowrap invisible opacity-20 -translate-x-3 transition-all 
                group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
              >
                Account Settings
              </div>
            ) : null}
          </div>

          {/* Name + email */}
          {props.user ? (
            <div
              className={`transition-all duration-300 ease-in-out  ${
                expanded
                  ? "ml-3 w-full opacity-100 translate-x-0"
                  : "w-0 ml-0 opacity-0 -translate-x-1 hidden"
              }`}
            >
              <div className="flex items-center w-full">
                <div className="leading-4 flex-1 min-w-0">
                  <h4 className="font-semibold">{props.user.name}</h4>
                  <span className="text-xs text-gray-600">
                    {props.user.email}
                  </span>
                </div>

                {/* Dots */}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu((prev) => !prev)}
                    className="cursor-pointer"
                  >
                    <LuEllipsisVertical className="ml-3 shrink-0" size={20} />
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {showMenu && props.user ? (
            <div
              className={`absolute bottom-20 w-56 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50 ${
                expanded ? "right-3" : "left-3"
              }`}
            >
              <div className="px-3 py-2 border-b">
                <p className="font-semibold text-gray-800">{props.user.name}</p>
                <p className="text-sm text-gray-500">{props.user.email}</p>
              </div>
              <button className="w-full cursor-pointer text-left px-3 py-2 hover:bg-gray-100">
                Edit Profile
              </button>
              <button className="w-full cursor-pointer text-left px-3 py-2 hover:bg-gray-100">
                Account Settings
              </button>
              <button
                className="w-full cursor-pointer text-left px-3 py-2 text-red-600 hover:bg-red-50"
                onClick={props.handleLogout}
              >
                Sign Out
              </button>
            </div>
          ) : null}
        </div>
      </nav>
    </aside>
  );
};
