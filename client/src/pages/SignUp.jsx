import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import PaymentModal from '../components/PaymentModal'; // Import the new component

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false); // State for the payment modal
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true); // Open payment modal
  };

  const handlePaymentSuccess = () => {
    setSubscribed(true); // Set subscription status
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, plan: selectedPlan }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='bg-gradient-to-r from-blue-200 min-h-screen flex items-center justify-center'>
      <div className='p-10 w-full max-w-md bg-white shadow-lg rounded-lg border border-gray-200'>
        <h1 className='text-4xl font-bold text-gray-800 mb-6 text-center'>Create an Account</h1>
        
        {/* Subscription Section */}
        {!subscribed ? (
          <div className='mb-6'>
            <h2 className='text-2xl font-semibold text-center mb-4'>Choose a Subscription Plan</h2>
            <div className='flex flex-col gap-4'>
              <div className='border border-gray-300 p-4 rounded-lg shadow-sm'>
                <h3 className='text-xl font-bold mb-2'>Basic Plan</h3>
                <p className='text-gray-600'>₹599/month</p>
                <button
                  onClick={() => handleSubscribe('Basic')}
                  className='w-full bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition duration-300 mt-4'
                >
                  Subscribe Now
                </button>
              </div>
              <div className='border border-gray-300 p-4 rounded-lg shadow-sm'>
                <h3 className='text-xl font-bold mb-2'>Premium Plan</h3>
                <p className='text-gray-600'>₹999/month</p>
                <button
                  onClick={() => handleSubscribe('Premium')}
                  className='w-full bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition duration-300 mt-4'
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='flex flex-col'>
            <input
              type='text'
              placeholder='Username'
              className='border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mb-4 shadow-sm'
              id='username'
              onChange={handleChange}
              required
            />
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
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
            <OAuth />
          </form>
        )}
        
        <div className='flex gap-2 mt-5 justify-center'>
          <p className='text-gray-600'>Already have an account?</p>
          <Link to={'/sign-in'}>
            <span className='text-blue-700 font-semibold hover:underline'>Sign In</span>
          </Link>
        </div>
        {error && <p className='text-red-500 mt-5 text-center'>{error}</p>}
      </div>

      {/* Render Payment Modal if open */}
      {showPaymentModal && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
