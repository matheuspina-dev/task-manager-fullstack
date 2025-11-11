import { useContext } from "react";
import { SidebarContext } from "./Sidebar";

export default (props) => {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      onClick={props.onClick}
      className={`
        group relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors 
        ${
          props.active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }`}
    >
      {props.icon}
      <span
        className={`whitespace-nowrap overflow-hidden transition-all duration-300 transform ${
          expanded ? "w-52 ml-3 translate-x-0" : "w-0 -translate-x-1"
        }`}
      >
        {props.text}
      </span>
      {props.alert ? (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        ></div>
      ) : null}

      {!expanded ? (
        <div
          className="absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 
        text-sm invisible opacity-20 -translate-x-3 transition-all 
        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
        >
          {props.text}
        </div>
      ) : null}
    </li>
  );
};
