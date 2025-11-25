import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { LuCircleCheckBig } from "react-icons/lu";

export default (props) => {
  const location = useLocation();

  // only these pages should show the brand
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <nav
      className={`fixed top-0 right-0 h-16 flex items-center bg-tanager-bg border-b shadow-sm py-8 text-3xl transition-all duration-300
        ${isAuthPage ? "justify-start" : "justify-between"}`}
      style={
        isAuthPage
          ? { left: 0, width: "100%" } // no sidebar offset on auth pages
          : {
              left: props.sidebarWidth,
              width: `calc(100% - ${props.sidebarWidth})`,
            }
      }
    >
      {isAuthPage ? (
        <Link className="flex items-center gap-x-3 ml-6" to="/">
          <LuCircleCheckBig />
          <h1>Tanager</h1>
        </Link>
      ) : (
        <h1 className="ml-4 capitalize">{props.activeView}</h1>
      )}
    </nav>
  );
};
