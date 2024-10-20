import React, { useState } from 'react';
import { FaInstagram } from 'react-icons/fa';

export default function About() {
  const [selectedPlan, setSelectedPlan] = useState('');

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className='bg-gradient-to-r from-blue-200 min-h-screen flex items-center justify-center'>
      <div className='max-w-4xl w-full bg-white shadow-lg rounded-lg p-8'>
        <h1 className='text-4xl font-bold mb-6 text-slate-800 text-center'>About SquareFeet</h1>
        <p className='mb-6 text-slate-700 text-lg leading-relaxed'>
          SquareFeet is a leading real estate agency that specializes in helping clients buy, sell, and rent properties in the most desirable neighborhoods. Our team of experienced agents is dedicated to providing exceptional service and making the buying and selling process as smooth as possible.
        </p>
        <p className='mb-6 text-slate-700 text-lg leading-relaxed'>
          Our mission is to help our clients achieve their real estate goals by providing expert advice, personalized service, and a deep understanding of the local market. Whether you are looking to buy, sell, or rent a property, we are here to help you every step of the way.
        </p>
        <p className='mb-6 text-slate-700 text-lg leading-relaxed'>
          Our team of agents has a wealth of experience and knowledge in the real estate industry, and we are committed to providing the highest level of service to our clients. We believe that buying or selling a property should be an exciting and rewarding experience, and we are dedicated to making that a reality for each and every one of our clients.
        </p>
        
        {/* Social Media Links */}
        <div className='flex justify-center gap-4 mt-8'>
          <a 
            href='https://www.instagram.com/squarefeet_69/' 
            target='_blank' 
            rel='noopener noreferrer' 
            className='text-blue-600 hover:text-blue-800 transition'
          >
            <FaInstagram size={30} />
          </a>
        </div>
        
        {/* Subscription Plans */}
        <div className='mt-10'>
          <h2 className='text-2xl font-bold mb-4 text-center'>Available Subscription Plans</h2>
          <div className='flex justify-center gap-6'>
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition ${
                selectedPlan === 'Basic' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
              }`}
              onClick={() => handlePlanSelect('Basic')}
            >
              <h3 className='font-bold'>Basic Plan</h3>
              <p>₹599/month</p>
              <p>Access to basic listings and updates.</p>
            </div>
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition ${
                selectedPlan === 'Premium' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
              }`}
              onClick={() => handlePlanSelect('Premium')}
            >
              <h3 className='font-bold'>Premium Plan</h3>
              <p>₹999/month</p>
              <p>Access to all listings, premium content, and priority support.</p>
            </div>
          </div>

          {selectedPlan && (
            <div className='mt-6 text-center'>
              <p className='text-lg text-slate-700'>You have selected the {selectedPlan} plan.</p>
            </div>
          )}
        </div>

        {/* Copyright Notice */}
        <div className='mt-8 text-center text-sm text-gray-600'>
          <p>&copy; {new Date().getFullYear()} SquareFeet. All rights reserved.</p>
          <p>SquareFeet® is a registered trademark of SquareFeet Inc.</p>
          <p>All information provided is deemed reliable but is not guaranteed and should be independently verified.</p>
        </div>
      </div>
    </div>
  );
}
