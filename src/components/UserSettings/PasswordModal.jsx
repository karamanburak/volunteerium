import React from "react"
import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"

const PasswordModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  })

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Save Password Logic
      console.log("Current Password:", values.currentPassword)
      console.log("New Password:", values.newPassword)
      onClose() // Close the modal after save
    },
  })

  return (
    <div className="fixed inset-1 flex justify-center items-center z-50  bg-white bg-opacity-50 backdrop-blur-sm">
      <div className=" max-w-full sm:w-[600px] w-[350px] sm:h-[400px] h-[400px] font-Poppins p-[50px] text-black rounded-[8px] bg-white shadow-2xl  ">
        <h1 className="text-center mb-[20px] font-bold">Change your password</h1>
        <hr className="border-gray-1" />
        <form onSubmit={formik.handleSubmit}>
          <div className="mt-[20px]">
            <div className="flex flex-col">
              <div className="flex justify-between items-center gap-[3px] mt-[10px]">
                <p className="text-[0.80rem]">Current Password</p>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="*********"
                  value={formik.values.currentPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-[36px] border ${
                    formik.touched.currentPassword && formik.errors.currentPassword
                      ? "border-danger"
                      : "border-gray-1"
                  } rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary-green text-dark-gray-1`}
                />
              </div>
              {formik.touched.currentPassword && formik.errors.currentPassword ? (
                <p className="text-danger text-xs text-right">{formik.errors.currentPassword}</p>
              ) : null}

              <div className="flex justify-between items-center gap-[3px] mt-[10px]">
                <p className="text-[0.80rem]">New Password</p>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="*********"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-[36px] border ${
                    formik.touched.newPassword && formik.errors.newPassword
                      ? "border-danger"
                      : "border-gray-1"
                  } rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary-green text-dark-gray-1`}
                />
              </div>
              {formik.touched.newPassword && formik.errors.newPassword ? (
                <p className="text-danger text-xs text-right">{formik.errors.newPassword}</p>
              ) : null}

              <div className="flex justify-between items-center gap-[3px] mt-[10px]">
                <p className="text-[0.80rem]">Confirm Password</p>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="*********"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-[36px] border ${
                    formik.touched.confirmPassword && formik.errors.confirmPassword
                      ? "border-danger"
                      : "border-gray-1"
                  } rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary-green text-dark-gray-1`}
                />
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <p className="text-danger text-xs text-right">{formik.errors.confirmPassword}</p>
              ) : null}

              <div className="flex justify-center gap-3 mt-[50px]">
                <button
                  type="button"
                  className="bg-gray-1 text-black px-4 py-2 rounded-md leading-[1.5625] max-w-[150px]"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-green px-4 py-2 rounded-md text-white leading-[1.5625] max-w-[150px]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PasswordModal