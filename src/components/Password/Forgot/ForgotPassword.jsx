// src/pages/ForgotPassword.jsx

import React from "react"
import forgotPasswordImage from "../../../assets/forgot-password.png"
import ForgotPasswordForm from "./ForgotPasswordForm"

const ForgotPassword = ({ setIssue, setIdentifier, setEmail }) => {
  return (
    <div>
      {/* Main Content Area */}
      <div className="flex flex-col max-w-full w-[1440px] mx-auto font-poppins dark:bg-black ">
        {/* Main Container Wrapping the Image and Form Areas */}
        <div className="flex flex-col md:flex-row pt-8 max-w-[1440px] justify-center items-center h-full">
          {/* Left Side - Image Area */}
          <div className="hidden md:flex w-full md:max-w-[608px] mx-2 md:mx-4 lg:mx-8 mb-8 bg-primary-green overflow-hidden rounded-lg h-[calc(100vh-150px)] lg:h-[780px]">
            <div
              className="flex-grow h-full w-full bg-cover bg-center backdrop-blur-xl relative"
              style={{
                backgroundImage: `url(${forgotPasswordImage})`,
                backgroundBlendMode: "overlay",
                 
              }}
            >
              <div className="h-full w-full flex flex-col justify-center px-5 md:px-0 bg-primary-green bg-opacity-60" />
              <div className="absolute top-0 left-0 w-full h-full bg-primary-green opacity-[0.4]" />
            </div>
          </div>

          {/* Right Side - Form Area */}
          <div className="flex-grow flex flex-col justify-center my-auto p-4 md:px-8">
            {/* Form Content */}
            <div className="flex-grow">
              <ForgotPasswordForm
                setIssue={setIssue}
                setIdentifier={setIdentifier}
                setEmail={setEmail}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
