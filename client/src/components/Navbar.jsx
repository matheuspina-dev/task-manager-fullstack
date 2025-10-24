import { useState, useRef, useEffect } from 'react';
import { HiDesktopComputer } from 'react-icons/hi';
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
    <nav className="flex justify-evenly items-center bg-blue-500 py-8 text-3xl">
      <div className="flex items-center gap-x-4">
        <Link to="/">
          <HiDesktopComputer />
        </Link>
        <Link to="/">
          <h1>Taskly</h1>
        </Link>
      </div>
      {!props.user ? (
        <div className="">
          <ul className="flex gap-x-4">
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Sign up</Link>
            </li>
          </ul>
        </div>
      ) : (
        <div ref={menuRef} className="relative">
          <button onClick={toggleMenu} className="cursor-pointer">
            <CgProfile />
          </button>

          {showMenu ? (
            <div className="text-2xl absolute left-1/2 mt-2 bg-white rounded-lg shadow-md p-8 transform -translate-x-1/2 flex flex-col items-center gap-y-4">
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
