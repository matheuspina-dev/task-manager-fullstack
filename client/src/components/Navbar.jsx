import { HiDesktopComputer } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <nav className="flex justify-evenly items-center bg-blue-500 py-4">
      <div className="flex items-center gap-x-4">
        <Link to="/">
          <HiDesktopComputer />
        </Link>
        <Link to="/">
          <h1>Taskly</h1>
        </Link>
      </div>
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
    </nav>
  );
};
