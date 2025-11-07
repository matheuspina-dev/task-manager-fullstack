import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { loginUser } from '../services/authService';

export default () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('user', JSON.stringify(res.user));
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Invalid credentials');
    }
  };

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="flex justify-center items-center flex-col mt-16">
        <h1 className="text-3xl font-bold">Login</h1>
        <form action={handleSubmit} className="flex flex-col mt-8 gap-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            className="border-1 border-solid px-8 py-4 rounded-lg text-xl"
          />
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            className="border-1 border-solid px-8 py-4 rounded-lg text-xl"
          />
          <span className="cursor-pointer">Forgot your password?</span>
          <button className="border-1 border-solid px-8 py-4 rounded-lg text-xl cursor-pointer bg-blue-500">
            Login
          </button>
          <div className="flex justify-center items-center gap-4">
            <span>Don't have an account?</span>
            <Link
              to={'/register'}
              className="border-1 border-solid rounded-3xl px-8 py-2"
            >
              Sign up
            </Link>
          </div>
        </form>
      </main>
    </>
  );
};
