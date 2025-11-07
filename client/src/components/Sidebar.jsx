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
      className="fixed left-0 top-0 h-screen bg-tanager-bg border-r shadow-sm transition-all duration-300"
      style={{ width: currentWidth }}
    >
      <nav
        className={`h-full flex flex-col transition-all duration-300 ${
          expanded ? 'items-stretch' : 'items-center'
        }`}
      >
        <div
          className={`p-4 pb-2 flex items-center w-full transition-all duration-300 ${
            expanded ? 'justify-between' : 'justify-center'
          }`}
        >
          {expanded ? (
            <Link
              className="flex items-center text-4xl gap-x-2 transition-all duration-300"
              to="/"
            >
              <LuCircleCheckBig />
              <h1>Tanager</h1>
            </Link>
          ) : null}
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-4xl cursor-pointer transition-all duration-300"
          >
            {expanded ? <LuChevronFirst /> : <LuChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul
            className={`flex-1 px-3 transition-all duration-300 ${
              expanded ? 'w-full items-start' : 'items-center px-0'
            }`}
          >
            {props.children}
          </ul>
        </SidebarContext.Provider>

        <div
          className={`border-t w-full flex items-center py-3 transition-all duration-300 ${
            expanded ? 'px-4 justify-start' : 'justify-center'
          }`}
        >
          {/* Avatar */}
          <div className="flex justify-center items-center text-xl w-10 h-10 rounded-md bg-gray-500 flex-shrink-0">
            <span>{props.user ? getInitials(props.user.name) : 'NA'}</span>
          </div>

          {/* Name + email */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              expanded
                ? 'ml-3 w-full opacity-100 translate-x-0'
                : 'w-0 ml-0 opacity-0 -translate-x-1'
            }`}
          >
            <div className="flex items-center w-full">
              <div className="leading-4 flex-1 min-w-0">
                <h4 className="font-semibold">
                  {props.user ? props.user.name : 'Signup'}
                </h4>
                <span className="text-xs text-gray-600">
                  {props.user ? props.user.email : null}
                </span>
              </div>

              {/* Dots */}
              <LuEllipsisVertical
                className="ml-3 shrink-0 cursor-pointer"
                size={20}
              />
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};
