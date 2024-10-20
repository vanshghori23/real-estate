// src/components/PaymentModal.jsx
import React, { useState } from 'react';

const PaymentModal = ({ plan, onClose, onPaymentSuccess }) => {
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiration: '', cvv: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const subscriptionAmounts = {
    Basic: '₹599',
    Premium: '₹999',
  };

  const handleChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.id]: e.target.value });
    setError(''); // Clear error on change
  };

  const validateCardDetails = () => {
    const { cardNumber, expiration, cvv } = cardDetails;
    if (!/^\d{16}$/.test(cardNumber)) return 'Card number must be 16 digits.';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiration)) return 'Expiration date format must be MM/YY.';
    if (!/^\d{3}$/.test(cvv)) return 'CVV must be 3 digits.';
    return '';
  };

  const handlePayment = (e) => {
    e.preventDefault();
    const validationError = validateCardDetails();

    if (validationError) {
      setError(validationError);
      return;
    }

    // Simulate a successful payment process
    setSuccess(true);
    setTimeout(() => {
      onPaymentSuccess();
      onClose();
    }, 2000); // Simulate a delay for payment processing
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Payment for {plan}</h2>
        
        {success ? (
          <div className="text-green-600 text-center mb-4">
            <h3 className="text-lg">Payment Successful!</h3>
            <p>Your subscription has been activated.</p>
          </div>
        ) : (
          <>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="Card Number"
                  value={cardDetails.cardNumber}
                  onChange={handleChange}
                  className="border border-gray-300 p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <input
                  type="text"
                  id="expiration"
                  placeholder="MM/YY"
                  value={cardDetails.expiration}
                  onChange={handleChange}
                  className="border border-gray-300 p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300"
                  required
                />
                <input
                  type="text"
                  id="cvv"
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={handleChange}
                  className="border border-gray-300 p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg p-4 hover:bg-blue-700 transition duration-300"
              >
                Pay Now
              </button>
            </form>
            <p className="mt-4 text-lg font-semibold text-center">Amount: {subscriptionAmounts[plan]}</p>
          </>
        )}
        
        <button onClick={onClose} className="mt-6 text-gray-600 underline hover:text-blue-600 transition duration-300">Cancel</button>
      </div>
    </div>
  );
};

export default PaymentModal;
