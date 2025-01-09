import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import getUserIdFromToken from './tokendecode';
import { updateUser } from '../api';

const MyAccount = () => {

  const navigate = useNavigate();
  const [isProfileEditable, setIsProfileEditable] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isEmailEditable, setIsEmailEditable] = useState(true);
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [isEmailSaved, setIsEmailSaved] = useState(false);

  const user = getUserIdFromToken()
  const handleSaveProfile = async () => {
    const firstname = `${firstName}${lastName}`; 
    const payload = { firstname }; 
  
    try {
      const response = await updateUser(user.id, payload);
      console.log(response);
      
      if (response.user) {
        setIsProfileEditable(false);
        setIsProfileSaved(true);
      }
    } catch (err) {
      alert(err.message || "An unexpected error occurred.");
    }
  };
  

  const handleSaveEmail = async () => {
    const payload = {};
    if (email) payload.email = email;
    if (confirmEmail) payload.confirmEmail = confirmEmail;
    if (password) payload.password = password;
    if (repeatPassword) payload.confirmPassword = repeatPassword;
  
    try {
      const response = await updateUser(user.id, payload);
  
      if (response.user) {
        setIsEmailEditable(false);
        setIsEmailSaved(true);
      }
    } catch (err) {
      alert(err.message || "An unexpected error occurred.");
    }
  };
  
  const [showCloseAccount, setShowCloseAccount] = useState(false);



  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 dark:bg-black">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8 dark:bg-bg-gray ">
      {!showCloseAccount ? (
          <>
        <p className="text-center mb-4 text-txt-gray dark:text-tl-gray">Manage your user account, including your contact and sign-in information.</p>
        <h1 className="text-3xl font-bold text-center mb-4 text-txt-blue dark:text-white">My Account <span role="img" aria-label="user">👨‍💼</span></h1>
        <div className='mb-8'>
          <p className="text-txt-gray dark:text-tl-gray">Email Id:</p>
          <h1 className="text-sm text-txt-blue dark:text-tl-gray">{user.email}</h1>
        </div>
        
        {isProfileSaved && isEmailSaved && (
          <div className="bg-blue-100 text-green-700 px-4 py-3 rounded relative mb-4 text-center text-txt-blue" role="alert">
            <span className="block sm:inline">Your account has been updated.</span>
          </div>
        )}
        
        <form className="space-y-6">
          <div>
            <h2 className="text-base font-semibold mb-4 text-txt-blue  dark:text-white">Change Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm text-txt-blue dark:text-tl-gray">First Name</label>
                {isProfileEditable ? (
                  <input
                    type="text"
                    id="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Please Enter First Name"
                    className="mt-2 block w-full text-txt-blue rounded p-2 mb-3 border border-txt-blue placeholder-txt-gray bg-gray-100 dark:bg-black dark:text-white  dark:border-gray-600"
                  />
                ) : (
                  <p className="mt-2 w-full text-txt-blue p-2 mb-3 dark:text-white dark:p-0 font-semibold">{firstName}</p>


                //   <div className="text-txt-blue text-center md:text-right w-3/4 md:w-full p-2 mb-2  dark:text-white font-semibold ">
                //   {formData.companyName || "Your Company Name"}
                // </div>
                )}
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm text-txt-blue dark:text-tl-gray">Last Name</label>
                {isProfileEditable ? (
                  <input
                    type="text"
                    id="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Please Enter Last Name"
                    className="mt-2 block w-full text-txt-blue rounded p-2 mb-3 border border-txt-blue placeholder-txt-gray bg-gray-100 dark:bg-black dark:text-white  dark:border-gray-600"
                  />
                ) : (
                  <p className="mt-2 w-full text-txt-blue p-2 mb-3 dark:text-white dark:p-0 font-semibold">{lastName}</p>
                )}
              </div>
            </div>
            {isProfileEditable ? (
              <button
                type="button"
                onClick={handleSaveProfile}
                className="mt-2 px-12 py-2 bg-custom-blue text-white text-xs rounded hover:bg-blue-600 transition duration-200"
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                className="mt-2  px-12 py-2 bg-green-500 text-black border border-black text-xs rounded transition duration-200 flex"
              >
                Saved <svg
                className="w-4 h-4 text-txt-blue ml-2 "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              </button>
            )}
          </div>

          {/* Change Email Address or Password Section */}
          <div>
            <h2 className="text-base font-semibold mb-4 text-txt-blue dark:text-white">Change Email Address or Password</h2>
            <div>
              <div>
                <label htmlFor="new-email" className="block text-sm text-txt-blue dark:text-tl-gray">New Email Address</label>
                {isEmailEditable ? (
                  <input
                    type="email"
                    id="new-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Please Enter New Email"
                    className="mt-2 block w-2/4 text-txt-blue rounded p-2 mb-3 border border-txt-blue placeholder-txt-gray bg-gray-100 dark:bg-black dark:text-white  dark:border-gray-600"
                  />
                ) : (
                  <p className="mt-2 block w-2/4 text-txt-blue rounded p-2 mb-3   dark:text-white dark:p-0 font-semibold">{email}</p>
                )}
              </div>
              <div>
                <label htmlFor="new-email-confirm" className="block text-sm text-txt-blue dark:text-tl-gray">Confirm New Email Address</label>
                {isEmailEditable ? (
                  <input
                    type="email"
                    id="new-email-confirm"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    placeholder="Please Confirm Email"
                    className="mt-2 block w-2/4 text-txt-blue rounded p-2 mb-3 border border-txt-blue placeholder-txt-gray bg-gray-100 dark:bg-black dark:text-white  dark:border-gray-600"
                  />
                ) : (
                  <p className="mt-2 block w-2/4 text-txt-blue rounded p-2 mb-3 dark:text-white dark:p-0 font-semibold">{confirmEmail}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="new-password" className="block text-sm text-txt-blue dark:text-tl-gray">New Password</label>
                {isEmailEditable ? (
                  <input
                    type="password"
                    id="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    className="mt-2 block w-full text-txt-blue rounded p-2 mb-3 border border-txt-blue placeholder-txt-gray bg-gray-100 dark:bg-black dark:text-white  dark:border-gray-600"
                  />
                ) : (
                  <p className="mt-2 block w-full text-txt-blue rounded p-2 mb-3 dark:text-white dark:p-0 font-semibold">********</p>
                )}
              </div>
              <div>
                <label htmlFor="repeat-password" className="block text-sm text-txt-blue dark:text-tl-gray">Repeat Password</label>
                {isEmailEditable ? (
                  <input
                    type="password"
                    id="repeat-password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    placeholder="Repeat Password"
                    className="mt-2 block w-full text-txt-blue rounded p-2 mb-3 border border-txt-blue placeholder-txt-gray bg-gray-100 dark:bg-black dark:text-white  dark:border-gray-600"
                  />
                ) : (
                  <p className="mt-2 block w-full text-txt-blue rounded p-2 mb-3 dark:text-white dark:p-0 font-semibold">********</p>
                )}
              </div>
            </div>
            {isEmailEditable ? (
              <button
                type="button"
                onClick={handleSaveEmail}
                className="mt-2 px-12 py-2 bg-custom-blue text-white text-xs rounded hover:bg-blue-600 transition duration-200"
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                className="mt-2 px-12 py-2 bg-green-500 text-black border border-black text-xs rounded transition duration-200 flex"
              >
                Saved <svg
                className="w-4 h-4 text-txt-blue ml-2 "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              </button>
            )}
          </div>
          <div>
            <button type="button"  onClick={() => setShowCloseAccount(true)}  className="px-4 py-2 bg-gray-150 text-red-500 rounded hover:bg-red-700 hover:text-white transition duration-200 border border-red-500 text-sm font-medium mt-4">
              Close Account
            </button>
          </div>
        </form></>
    ) : (<>
          <div className="text-center ">
            <p className="text-xl mb-4 text-txt-gray dark:text-tl-gray">Your Invoice Sheet user account will be deactivated.</p>
            <h1 className="text-4xl font-semibold mb-4 text-black dark:text-white">Close Account 🚫</h1>
            <div className="flex ml-10 mb-6">
              <input type="checkbox" id="confirm-close" className="mr-3" />
              <label htmlFor="confirm-close" className="text-txt-gray text-lg dark:text-tl-gray">Your Invoice Sheet user account will be deactivated.</label>
            </div>
            <hr></hr>
           <button
           type="button"
           className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600  mt-4 "
           onClick={() => navigate("/login")}
         >
           Confirm
         </button> </div></>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
