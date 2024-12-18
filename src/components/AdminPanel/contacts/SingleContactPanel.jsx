import React, { useState, useRef, useEffect } from "react"
import { ImSpinner9 } from "react-icons/im"
import { IoIosArrowBack } from "react-icons/io"
import { MdOutlineSettings } from "react-icons/md"
import { LuMailPlus } from "react-icons/lu"
import { useNavigate } from "react-router-dom"
import useAdminCall from "../../../hooks/useAdminCall"
import DeleteModal from "../../ui/Modals/DeleteModal"
import { formatDateWithTime } from "../../../helpers/formatDate"
import { translations } from "../../../locales/translations"
import { useTranslation } from "react-i18next"

const SingleContactPanel = ({ contactId, setIdentifier }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [contactData, setContactData] = useState([])
  const [loading, setLoading] = useState(false)
  const { fetchSingleData, deleteData } = useAdminCall()
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isDeleteContactModalOpen, setIsDeleteContactModalOpen] = useState(false)
  const settingsButtonRef = useRef(null)
  const modalRef = useRef(null)

  const fetchContactData = async () => {
    setLoading(true)
    try {
      const data = await fetchSingleData("contacts", contactId)
      setContactData(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContactData()
  }, [contactId])

  const handleNavigateBack = () => {
    setIdentifier(null)
    navigate(`/admin-panel?tab=contacts`)
  }

  const closeDeleteContactModal = () => {
    setIsDeleteContactModalOpen(false)
  }

  const openDeleteContactModal = () => {
    setIsDeleteContactModalOpen(true)
  }

  const handleSettingsButtonClick = () => {
    setIsSettingsModalOpen((prevState) => !prevState)
  }

  const handleOutsideClick = (e) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(e.target) &&
      settingsButtonRef.current &&
      !settingsButtonRef.current.contains(e.target)
    ) {
      setIsSettingsModalOpen(false)
    }
  }

  useEffect(() => {
    // Event listener for outside click
    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [])

  const handleDeleteEvent = () => {
    deleteData("contacts", contactId)
    navigate(`/admin-panel?tab=contacts`)
    setIdentifier(null)
    setIsSettingsModalOpen(false)
    closeDeleteContactModal()
  }

  return (
    <div className="relative">
      <button
        onClick={handleNavigateBack}
        className="absolute -top-8 left-0 md:-left-5 flex items-center gap-1 text-primary-green dark:text-white"
      >
        <IoIosArrowBack className="w-5 h-5" />
        <span>{t(translations.adminPanel.backButton)}</span>
      </button>
      <div>
        {loading ? (
          <div className="my-8 mb:my-4 flex h-max justify-center items-start pt-24">
            <ImSpinner9 className="animate-spin h-8 w-8 text-primary-green dark:text-white" />
          </div>
        ) : contactData ? (
          <div className="my-8 md:my-4 space-y-2 h-max">
            <div className="flex justify-between items-center p-4 bg-white dark:bg-dark-gray-1 rounded-lg ">
              <div className="text-sm sm:text-[1.125rem] flex gap-1 md:gap-2 items-center text-dark-gray-1 me-3">
                <span className="text-primary-green dark:text-white font-semibold w-[80px] sm:w-fit">
                  {t(translations.adminPanel.contacts.singleContactPanel.contactId)}:
                </span>
                <span className="w-[100px] md:w-auto overflow-x-scroll scrollbar-hide">
                  {contactId}
                </span>
              </div>
              <div className="flex gap-1 md:gap-2 items-center">
                <button ref={settingsButtonRef} onClick={handleSettingsButtonClick}>
                  <MdOutlineSettings className="w-5 h-5 sm:w-8 sm:h-8 text-dark-gray-1 dark:text-white hover:text-dark-gray-1" />
                </button>
              </div>
            </div>
            <div className="flex flex-col xl:flex-row gap-2 h-full">
              {/* User Information */}
              <div className="bg-white dark:bg-dark-gray-1 rounded-lg w-full xl:w-1/2 p-4">
                <h1 className="text-[1.125rem] font-semibold text-primary-green dark:text-white">
                  {t(translations.adminPanel.contacts.singleContactPanel.contactInfo)}
                </h1>
                <ul className="space-y-2 text-dark-gray-1 dark:text-light-gray-2">
                  {/* Full Name  */}
                  <li className="flex gap-1 mt-4">
                    <span className="font-semibold">
                      {t(translations.adminPanel.contacts.singleContactPanel.name)}:
                    </span>
                    <span>{contactData?.name}</span>
                  </li>

                  <li className="flex flex-col sm:flex-row gap-1">
                    <span className="font-semibold">
                      {t(translations.adminPanel.contacts.singleContactPanel.email)}:
                    </span>
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contactData?.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-1 items-center text-primary-green dark:text-green-300 hover:underline"
                    >
                      {contactData?.email} <LuMailPlus />
                    </a>
                  </li>
                  <li className="flex flex-col sm:flex-row gap-1">
                    <span className="font-semibold">
                      {t(translations.adminPanel.contacts.singleContactPanel.createdAt)}:
                    </span>
                    <span>{formatDateWithTime(contactData?.createdAt)}</span>
                  </li>
                  <li className="flex flex-col sm:flex-row gap-1">
                    <span className="font-semibold">
                      {t(translations.adminPanel.contacts.singleContactPanel.lastUpdatedAt)}:
                    </span>
                    <span>{formatDateWithTime(contactData?.updatedAt)}</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white dark:bg-dark-gray-1 rounded-lg w-full xl:w-1/2 p-4">
                <h1 className="text-[1.125rem] font-semibold text-primary-green dark:text-white">
                  {t(translations.adminPanel.contacts.singleContactPanel.contactDetails)}
                </h1>
                <ul className="space-y-2 text-dark-gray-1 dark:text-light-gray-2">
                  <li className="flex flex-col sm:flex-row gap-1 my-4">
                    <span className="font-semibold">
                      {t(translations.adminPanel.contacts.singleContactPanel.subject)}:
                    </span>
                    <span>{contactData?.subject}</span>
                  </li>
                  <li className="flex flex-col sm:flex-row gap-1">
                    <span className="font-semibold">
                      {t(translations.adminPanel.contacts.singleContactPanel.message)}:
                    </span>
                    <span>{contactData?.message}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div>{t(translations.adminPanel.contacts.singleContactPanel.noContacts)}</div>
        )}
      </div>
      {isSettingsModalOpen && (
        <div className="absolute z-50 top-14 right-8 border border-gray-1 dark:border-gray-1 overflow-hidden rounded-lg">
          <div ref={modalRef} className="bg-white dark:bg-gray-1 shadow-lg w-[120px] md:w-[200px]">
            <div className="flex flex-col justify-between">
              <button
                onClick={openDeleteContactModal}
                className="text-danger hover:text-danger/50 border-b dark:border-gray-2 hover:bg-light-gray-2 w-full py-2"
              >
                {t(translations.adminPanel.contacts.singleContactPanel.deleteContact)}
              </button>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className=" text-primary-green hover:text-primary-green/50 hover:bg-light-gray-2 w-full py-2"
              >
                {t(translations.adminPanel.cancel)}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Modal */}
      {isDeleteContactModalOpen && (
        <DeleteModal
          onClose={closeDeleteContactModal}
          onDelete={handleDeleteEvent}
          title={t(translations.adminPanel.contacts.singleContactPanel.deleteContact)}
          description={t(translations.adminPanel.contacts.singleContactPanel.deleteDescription)}
        />
      )}
    </div>
  )
}

export default SingleContactPanel
