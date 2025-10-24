import Navbar from '../components/Navbar';
import { loginUser } from '../utils/authService';

export default () => {
  const handleSubmit = async (formData) => {
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('user', JSON.stringify(res.user));
      alert('login successful');
      console.log(res);
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
          <button className="border-1 border-solid px-8 py-4 rounded-lg text-xl mt-4 cursor-pointer bg-blue-500">
            Login
          </button>
        </form>
      </main>
    </>
  );
};
