import React from 'react';

export default function Alert() {
  return (
    <div className="container mx-auto p-4">
      <div className="bg-red-500 text-white p-4 relative mb-8">
        {/* Zigzag Border */}
        <div className="zigzag-bottom" />

        {/* Special Offer Text */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Special Offer!</h2>
          <p className="text-lg mb-4">Get 50% off on our premium plan for a limited time.</p>
          <a href="#" className="bg-white text-red-500 hover:bg-red-700 hover:text-white py-2 px-4 rounded-full inline-block">Learn More</a>
        </div>
      </div>

      {/* Pricing Plans */}
      {/* ... Your pricing plan components go here ... */}
    </div>
  );
}
