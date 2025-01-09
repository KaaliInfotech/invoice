import React, { useState } from 'react';

const Upgrade = ({ onSubscribe }) => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    // <div className="flex flex-col justify-center items-center  max-w-4xl p-4  my-8 dark:bg-black">

<div className="flex justify-center dark:bg-black  ">
<div className="flex flex-col items-center w-full max-w-6xl rounded-lg shadow-md p-8  dark:bg-bg-gray my-8">
      <h1 className="text-5xl font-medium text-txt-blue mb-2 dark:text-white">Find Your Perfect Plan</h1>
      <p className="text-center mb-6 text-txt-gray mt-2 dark:text-tl-gray">
        Purchase an Invoice Sheet subscription in order to remove ads and reduce payment processing costs.
      </p>
      {/* <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 mx-1 ${billingCycle === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setBillingCycle('monthly')}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 mx-1 ${billingCycle === 'yearly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setBillingCycle('yearly')}
        >
          Yearly
        </button>
      </div> */}

      <div className="flex justify-center mb-6 rounded-md  bg-gray-100 py-2 px-6 items-center justify-center ">
        <button
        //   className={`px-4 py-2 mx-1 ${billingCycle === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        //   onClick={() => setBillingCycle('monthly')}
        >
          Monthly
        </button>
        <button
        //   className={`px-4 py-2 mx-1 ${billingCycle === 'yearly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        //   onClick={() => setBillingCycle('yearly')}
        className='ml-4 text-txt-gray'
        >
          Yearly
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="shadow-lg rounded-lg p-6 py-8 dark:bg-l-gray">
            <div className='flex'>
          <h2 className="text-3xl font-semibold mb-2 text-txt-blue dark:text-white ">Starter</h2>
          <span className="inline-block px-2 py-1 text-xs text-custom-blue bg-white rounded mb-4 ml-4 mt-2 rounded-md border border-custom-blue dark:bg-bg-gray">Most popular</span>
          </div>
          <h1 className="text-xl  mb-2 text-txt-blue dark:text-tl-gray">Subscription to Invoice-Generator.com Starter plan.</h1>
          <div className='flex'>
          <p className="text-5xl font-medium my-4 text-txt-blue dark:text-white">$5</p>
          <p className="mt-9 ml-6 text-lg dark:text-white">per month</p>
          </div>
          <ul className="mb-4 text-left mt-4">
            <li className="mb-2 flex items-center text-txt-blue text-lg dark:text-tl-gray">
              <svg
                className="w-6 h-6 text-txt-blue mr-2 dark:text-tl-gray"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              No Ads
            </li>
            <li className="mb-2 flex items-center text-txt-blue text-lg dark:text-tl-gray">
              <svg
                className="w-6 h-6 text-txt-blue mr-2 dark:text-tl-gray"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Payment Processing Fee: 0.6%
            </li>
          </ul>
          <button
      className="w-full py-2 bg-white border border-txt-blue text-txt-blue rounded-lg hover:bg-txt-blue hover:text-white transition duration-200 mt-2"
      onClick={onSubscribe}
    >
      Subscribe
    </button>
          {/* <button className="w-full py-2 bg-txt-blue text-white rounded-lg hover:bg-white hover:text-txt-blue hover:border-txt-blue border transition duration-200 mt-2">
            Subscribe
          </button> */}
        </div>
        <div className=" shadow-lg rounded-lg p-6 py-8 dark:bg-l-gray">
        <h2 className="text-3xl font-semibold mb-4 text-txt-blue dark:text-white ">Premium</h2>
        <h1 className="text-xl  mb-2 text-txt-gray dark:text-tl-gray">Subscription to Invoice-Generator.com  Premium plan.</h1>
        <div className='flex'>
          <p className="text-5xl font-medium my-4 text-txt-blue  dark:text-white">$19</p>
          <p className="mt-9 ml-6 text-lg  dark:text-white">per month</p>
        </div>
        <ul className="mb-4 text-left mt-4">
            <li className="mb-2 flex items-center text-txt-blue text-lg dark:text-tl-gray">
              <svg
                className="w-6 h-6 text-txt-blue mr-2 dark:text-tl-gray"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              No Ads
            </li>
            <li className="mb-2 flex items-center text-txt-blue text-lg dark:text-tl-gray">
              <svg
                className="w-6 h-6 text-txt-blue mr-2 dark:text-tl-gray"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              No Payment Processing Fee
            </li>
          </ul>
          <button className="w-full py-2 bg-white border border-txt-blue text-txt-blue rounded-lg hover:bg-txt-blue hover:text-white transition duration-200 mt-2 ">
            Subscribe
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Upgrade;
