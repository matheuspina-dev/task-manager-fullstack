import { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';

export default (props) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      className="fixed top-0 right-0 h-16 flex justify-between items-center bg-tanager-bg border-b shadow-sm py-8 text-3xl transition-all duration-300"
      style={{
        left: props.sidebarWidth,
        width: `calc(100% - ${props.sidebarWidth})`,
      }}
    >
      <h1 className="ml-12">
        {props.activeView.charAt(0).toUpperCase() + props.activeView.slice(1)}
      </h1>
      {!props.user ? (
        <div className="">
          <ul className="flex gap-x-8">
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Sign up</Link>
            </li>
          </ul>
        </div>
      ) : (
        <div ref={menuRef} className="relative mr-36">
          <button onClick={toggleMenu} className="cursor-pointer">
            <CgProfile />
          </button>

          {showMenu ? (
            <div className="text-2xl absolute left-1/2 mt-2 bg-white rounded-lg shadow-md p-8 transform -translate-x-1/2 flex flex-col items-center gap-y-4 w-auto min-w-max">
              <h3 className="whitespace-nowrap">Hello, {props.user.name}</h3>
              <Link to="/profile">Profile page</Link>
              <button
                onClick={props.handleLogout}
                className="bg-blue-500 px-8 py-4 rounded-lg text-white cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      )}
    </nav>
  );
};
