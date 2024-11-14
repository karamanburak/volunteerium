import React, { useState } from "react"
import AddNewDocumentModal from "./AddNewDocumentModal"
import { useTranslation } from "react-i18next"
import { translations } from "../../locales/translations"
import { FaExternalLinkAlt } from "react-icons/fa"
import DeleteModal from "../ui/Modals/DeleteModal"
import useAccountCall from "../../hooks/useAccountCall"
import toastNotify from "../../utils/toastNotify"

// Modal component
const MyDocumentsModal = ({ isOpen, onClose, certificates }) => {
  const { t } = useTranslation()
  const { deleteAccountFile } = useAccountCall()
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentDocument, setCurrentDocument] = useState(null)

  const openAddNewModal = () => setIsAddNewModalOpen(true)
  const closeAddNewModal = () => setIsAddNewModalOpen(false)

  const closeDeleteModal = () => setIsDeleteModalOpen((prevState) => !prevState)

  const handleDelete = async () => {
    if (currentDocument && currentDocument._id) {
      try {
        const data = await deleteAccountFile(currentDocument._id)
        toastNotify("success", data.message)
      } catch (error) {
        toastNotify("error", error.response.data.message)
      } finally {
        closeDeleteModal()
      }
    } else {
      toastNotify("error", t(translations.toastify.selectError))
    }
  }

  const handleOpenDeleteModal = (deletedDocument) => {
    setCurrentDocument(deletedDocument)
    setIsDeleteModalOpen(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-gray-3  p-6 rounded-lg max-w-[854px] w-full px-[20px] py-[40px]">
        <h2 className="text-[1.75rem] dark:text-white leading-[1.4642] font-semibold mb-4 text-center">
          {t(translations.myDocs.h2)}
        </h2>
        <p className="text-center text-dark-gray-1 dark:text-white leading-[1.5625]">
          {t(translations.myDocs.p)}
        </p>

        <div className="max-w-[669px] mx-auto ">
          <div className="flex justify-end items-center mb-[15px] mt-[25px]">
            <button
              className="text-[1rem] leading-[1.5625] text-primary-green cursor-pointer"
              onClick={openAddNewModal}
            >
              {t(translations.myDocs.addNew)}
            </button>
          </div>
          <AddNewDocumentModal isOpen={isAddNewModalOpen} onClose={closeAddNewModal} />
          <div className="max-h-[300px] overflow-y-auto">
            {certificates.map((certificate) => (
              <div
                key={certificate._id}
                className="flex justify-between items-center bg-light-gray mb-[15px] w-full h-[40px]"
              >
                <div onClick={() => window.open(certificate.fileUrl, "_blank")}>
                  <p className="text-dark-gray-1 hover:text-dark-gray-2 ml-3 cursor-pointer font-medium flex gap-2 items-center">
                    {certificate.title}{" "}
                    <span>
                      <FaExternalLinkAlt size={12} />
                    </span>
                  </p>
                </div>
                <div>
                  <button
                    className="leading-[1.5625] font-semibold text-danger hover:text-danger/30 duration-100 mr-[20px]"
                    onClick={() => handleOpenDeleteModal(certificate)}
                  >
                    {t(translations.myDocs.delete)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-[25px]">
          <button className="py-2 px-4 text-primary-green" onClick={onClose}>
            {t(translations.myDocs.cancel)}
          </button>
        </div>
      </div>

      {isDeleteModalOpen && (
        <DeleteModal
          onClose={closeDeleteModal}
          onDelete={handleDelete}
          title={t(translations.delModal.documentTitle)}
          description={t(translations.delModal.documentDesc)}
        />
      )}
    </div>
  )
}

export default MyDocumentsModal
