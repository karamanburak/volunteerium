// src/components/Password/Forgot/ForgotPasswordForm.jsx

import React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { IoIosArrowBack } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import logo from "../../../assets/logo.png"
import toastNotify from "../../../utils/toastNotify"
import { axiosWithPublic } from "../../../hooks/useAxios"
import { translations } from "../../../locales/translations"
import { useTranslation } from "react-i18next"

const ForgotPasswordForm = ({ setIssue, setIdentifier, setEmail }) => {
  const navigate = useNavigate()
  const {t} = useTranslation() 

  const forgotPassword = async (email) => {
    try {
      const { data } = await axiosWithPublic.post("auth/forgot-password", { email })
      // console.log(data)
      setIdentifier(data.resetToken)
      setIssue("verify-reset-token")
      toastNotify("success", data.message)
    } catch (error) {
      toastNotify("error", error.response?.data?.message)
    }
  }

  // Form validation using Formik and Yup
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t(translations.yup.invalid.email))
        .required(t(translations.yup.required.email)),
    }),
    onSubmit: (values) => {
      // console.log("Email:", values.email)
      setEmail(values.email)
      forgotPassword(values.email)
    },
  })

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col items-start space-y-6 p-6 w-full max-w-[44.1875rem] bg-white dark:bg-black rounded-lg relative"
    >
      {/* Mobile View - Back Arrow and Back to Login */}
      <div
        className="md:hidden w-full flex items-center space-x-1 cursor-pointer justify-start absolute top-[-1.25rem] left-[0.0625rem]"
        onClick={() => navigate("/login")}
      >
        <IoIosArrowBack className="text-2xl text-black dark:text-white" />
        <span className="text-lg font-semibold text-black dark:text-white">{t(translations.password.forgotPassForm.backToLogin)}</span>
      </div>

      {/* Mobile View - Logo Centered */}
      <div className="md:hidden w-full flex justify-center mb-6 mt-[5rem]">
        <img src={logo} alt= {t(translations.password.forgotPassForm.logoAlt)} className="h-12 w-auto" />
      </div>

      {/* Title and Description */}
      <div className="w-full">
        <h1 className="text-left text-[1.5rem] md:text-[2rem] font-semibold dark:text-white leading-tight mb-4">
        {t(translations.password.forgotPassForm.forgotPassword)}
        </h1>
        <p className="text-left w-full text-[1rem] md:text-[1.125rem] font-normal text-gray-2 dark:text-white leading-snug">
        {t(translations.password.forgotPassForm.forgotDesc)}
        </p>
      </div>

      {/* Email Field */}
      <div className="flex flex-col w-full">
        <label htmlFor="email" className="text-sm font-medium mb-1 text-gray-2 dark:text-white">
        {t(translations.password.forgotPassForm.email)}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          className="border border-gray-2 p-2 rounded-lg dark:bg-black dark:text-white focus:border-primary-green"
          placeholder={t(translations.password.forgotPassForm.emailPH)}
        />
        {formik.touched.email && formik.errors.email && (
          <span className="text-danger text-sm mt-1">{formik.errors.email}</span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-primary-green text-white w-full max-w-[44.1875rem] h-[2.8125rem] rounded-lg hover:bg-dark-green transition duration-300"
      >
        {t(translations.password.forgotPassForm.submit)}
      </button>

      {/* Sign Up Link */}
      <p className="mt-4 text-center text-sm dark:text-white w-full">
      {t(translations.password.forgotPassForm.dontHave)}{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-primary-green cursor-pointer underline"
        >
          {t(translations.password.forgotPassForm.signUp)}
        </span>
      </p>
    </form>
  )
}

export default ForgotPasswordForm
