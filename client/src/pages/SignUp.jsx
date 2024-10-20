import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate('/');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='bg-gradient-to-r from-blue-200 to-white min-h-screen flex items-center justify-center p-4'>
      <div className='p-6 sm:p-10 w-full max-w-md bg-white shadow-lg rounded-lg border border-gray-200'>
        <h1 className='text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center'>Welcome Back!</h1>
        <form onSubmit={handleSubmit} className='flex flex-col'>
          <input
            type='email'
            placeholder='Email'
            className='border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mb-4 shadow-sm'
            id='email'
            onChange={handleChange}
            required
          />
          <input
            type='password'
            placeholder='Password'
            className='border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mb-6 shadow-sm'
            id='password'
            onChange={handleChange}
            required
          />
          <button
            disabled={loading}
            className='w-full bg-blue-600 text-white rounded-lg p-4 uppercase hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 mb-4 shadow-md'
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <OAuth />
        </form>
        <div className='flex gap-2 mt-5 justify-center'>
          <p className='text-gray-600'>Don't have an account?</p>
          <Link to={'/sign-up'}>
            <span className='text-blue-700 font-semibold hover:underline'>Sign Up</span>
          </Link>
        </div>
        {error && <p className='text-red-500 mt-5 text-center'>{error}</p>}
      </div>
    </div>
  );
}
