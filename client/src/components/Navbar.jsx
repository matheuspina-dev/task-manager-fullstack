import { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CgProfile } from "react-icons/cg";

export default (props) => {
  return (
    <nav
      className="fixed top-0 right-0 h-16 flex justify-between items-center bg-tanager-bg border-b shadow-sm py-8 text-3xl transition-all duration-300"
      style={{
        left: props.sidebarWidth,
        width: `calc(100% - ${props.sidebarWidth})`,
      }}
    >
      <h1 className="ml-12">
        {/* {props.activeView.charAt(0).toUpperCase() + props.activeView.slice(1)} */}
      </h1>
    </nav>
  );
};
