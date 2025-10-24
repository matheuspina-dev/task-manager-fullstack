import Navbar from '../components/Navbar';
import { registerUser } from '../utils/authService';

export default () => {
  const handleSubmit = async (formData) => {
    const name = formData.get('name');
    const email = formData.get('email');
    const confirmEmail = formData.get('confirm-email');
    const password = formData.get('password');

    if (email !== confirmEmail) {
      alert('Emails do not match!');
      return;
    }

    try {
      await registerUser({ name, email, password });
      alert('User registered successfully!');
    } catch (err) {
      console.log(err);
      alert('Error registering user');
    }
  };

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="flex justify-center items-center flex-col mt-16">
        <h1 className="text-3xl font-bold">Sign up</h1>
        <form action={handleSubmit} className="flex flex-col mt-8 gap-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            name="name"
            className="border-1 border-solid px-8 py-4 rounded-lg text-xl"
          />
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            className="border-1 border-solid px-8 py-4 rounded-lg text-xl"
          />
          <input
            type="email"
            placeholder="Confirm your email"
            name="confirm-email"
            className="border-1 border-solid px-8 py-4 rounded-lg text-xl"
          />
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            className="border-1 border-solid px-8 py-4 rounded-lg text-xl"
          />
          <button className="border-1 border-solid px-8 py-4 rounded-lg text-xl mt-4 cursor-pointer bg-blue-500">
            Sign up
          </button>
        </form>
      </main>
    </>
  );
};
