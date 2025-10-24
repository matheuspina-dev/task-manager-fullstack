import { HiDesktopComputer } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';

export default (props) => {
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
        <Link to="/profile">
          <CgProfile />
        </Link>
      )}
    </nav>
  );
};
