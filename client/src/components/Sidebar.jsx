import { createContext, useState, useEffect } from 'react';
import { HiDesktopComputer } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import getInitials from '../utils/getInitials';
import {
  LuChevronFirst,
  LuCircleCheckBig,
  LuEllipsisVertical,
  LuChevronLast,
} from 'react-icons/lu';

export const SidebarContext = createContext();

export default (props) => {
  const [expanded, setExpanded] = useState(true);

  const EXPANDED_WIDTH = '21.5rem';
  const COLLAPSED_WIDTH = '4.2rem';
  const currentWidth = expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  useEffect(() => {
    if (props.onWidthChange) {
      props.onWidthChange(currentWidth);
    }
  }, [currentWidth, props.onWidthChange]);

  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-white border-r shadow-sm transition-all duration-300"
      style={{ width: currentWidth }}
    >
      <nav className="h-full flex flex-col">
        <div className="p-4 pb-2 flex justify-between items-center">
          <Link
            className={`flex items-center text-4xl gap-x-2 transition-all duration-300 ease-in-out transform ${
              expanded
                ? 'opacity-100 scale-100 translate-x-0'
                : 'opacity-0 scale-0 pointer-events-none -translate-x-full'
            }`}
            to="/"
          >
            <LuCircleCheckBig className="transition-all" />
            <h1 className="transition-all">Tanager</h1>
          </Link>
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className={`p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-4xl cursor-pointer transition-all duration-300 transform ${
              expanded ? 'translate-x-0' : '-translate-x-43'
            }`}
          >
            {expanded ? <LuChevronFirst /> : <LuChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{props.children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <div className="flex justify-center items-center text-xl w-10 h-10 rounded-md bg-gray-500">
            <span className="">
              {props.user ? getInitials(props.user.name) : 'Noname'}
            </span>
          </div>
          <div
            className={`flex justify-between items-center transition-all duration-300 ease-in-out overflow-hidden transform ${
              expanded
                ? 'w-52 ml-3 opacity-100 scale-100 translate-x-0'
                : 'w-0 ml-0 opacity-0 scale-0 -translate-x-1'
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">
                {props.user ? props.user.name : 'Signup'}
              </h4>
              <span className="text-xs text-gray-600">
                {props.user ? props.user.email : 'No email'}
              </span>
            </div>
            <LuEllipsisVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
};
