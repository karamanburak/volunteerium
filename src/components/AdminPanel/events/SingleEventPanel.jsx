import React from "react"
import { useEffect } from "react"
import { IoIosArrowBack } from "react-icons/io"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import useEventCall from "../../../hooks/useEventCall"
import { ImSpinner9 } from "react-icons/im"
import { MdOutlineSettings } from "react-icons/md"
import { formatDate, formatDateWithTime } from "../../../helpers/formatDate"
import useLanguage from "../../../hooks/useLanguages"
import { UserAvatar } from "../../ui/Avatar/userAvatar"
import { Link } from "react-router-dom"
import { FaExternalLinkAlt } from "react-icons/fa"
import { useState } from "react"
import { useRef } from "react"
import DeleteModal from "../../ui/Modals/DeleteModal"
import useAdminCall from "../../../hooks/useAdminCall"
import { translations } from "../../../locales/translations"
import { useTranslation } from "react-i18next"

const SingleEventPanel = ({ eventId, setIdentifier }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { singleEvent, loading } = useSelector((state) => state.event)
  const { getSingleEvent, deleteEvent } = useEventCall()
  const { updateData } = useAdminCall()
  const { getLangName, getTranslatedCategory } = useLanguage()
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isDeleteEventModalOpen, setIsDeleteEventModalOpen] = useState(false)
  const modalRef = useRef(null)
  const settingsButtonRef = useRef(null)

  useEffect(() => {
    getSingleEvent(eventId)
  }, [eventId])

  const handleNavigateBack = () => {
    setIdentifier(null)
    navigate(`/admin-panel?tab=events`)
  }

  const closeDeleteEventModal = () => {
    setIsDeleteEventModalOpen(false)
  }

  const openDeleteEventModal = () => {
    setIsDeleteEventModalOpen(true)
  }

  const handleSettingsButtonClick = () => {
    setIsSettingsModalOpen((prevState) => !prevState)
  }

  const handleOutsideClick = (e) => {
    // Check if the click is outside the settings button and modal
    if (
      modalRef.current &&
      !modalRef.current.contains(e.target) &&
      settingsButtonRef.current &&
      !settingsButtonRef.current.contains(e.target)
    ) {
      setIsSettingsModalOpen(false)
    }
  }

  const handleDeleteEvent = () => {
    deleteEvent(singleEvent._id)
    navigate(`/admin-panel?tab=events`)
    setIdentifier(null)
    setIsSettingsModalOpen(false)
    closeDeleteEventModal()
  }

  const handleSuspendEvent = () => {
    if (singleEvent?.isActive) {
      updateData("events", singleEvent._id, { isActive: false })
    } else {
      updateData("events", singleEvent._id, { isActive: true })
    }
    setIsSettingsModalOpen(false)
  }

  useEffect(() => {
    // Event listener for outside click
    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [])

  return (
    <div className="relative ">
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
        ) : singleEvent ? (
          <div className="my-8 md:my-4 space-y-2 h-max">
            <div className="flex justify-between items-center p-4 bg-white dark:bg-dark-gray-1 rounded-lg ">
              <div className="text-sm sm:text-[1.125rem] flex gap-1 md:gap-2 items-center text-dark-gray-1 me-3">
                <span className="text-primary-green dark:text-white font-semibold w-[55px] sm:w-fit">
                  {t(translations.adminPanel.events.singleEventPanel.eventId)}
                </span>
                <span className="w-[100px] md:w-auto overflow-x-scroll scrollbar-hide">
                  {eventId}
                </span>
                <span>
                  <FaExternalLinkAlt
                    onClick={() => navigate(`/events/${singleEvent?._id}`)}
                    className="hover:text-gray-1 cursor-pointer"
                  />
                </span>
              </div>
              <div className="flex gap-1 md:gap-2 items-center">
                {singleEvent?.isActive ? (
                  <span className="text-primary-green dark:bg-white text-md sm:text-xl border border-primary-green dark:border-white px-1 sm:px-2 py-1">
                    {t(translations.adminPanel.activeUpper)}
                  </span>
                ) : (
                  <span className="text-warning dark:bg-white text-md sm:text-xl border border-warning px-1 sm:px-2 py-1">
                    {t(translations.adminPanel.suspendedUpper)}
                  </span>
                )}
                <button ref={settingsButtonRef} onClick={handleSettingsButtonClick}>
                  <MdOutlineSettings className="w-5 h-5 sm:w-8 sm:h-8 text-dark-gray-1 dark:text-white hover:text-dark-gray-1" />
                </button>
              </div>
            </div>
            <div className="flex flex-col xl:flex-row gap-2 h-full">
              <div className="bg-white dark:bg-dark-gray-1 rounded-lg w-full xl:w-1/2 p-4">
                <h1 className="text-[1.125rem] font-semibold text-primary-green dark:text-white">
                  {t(translations.adminPanel.events.singleEventPanel.eventDetails)}
                </h1>
                <ul className="space-y-2 text-dark-gray-1 dark:text-light-gray-2">
                  <li className="flex gap-1 rounded-md overflow-hidden mt-2">
                    <img
                      src={singleEvent?.eventPhoto || `${import.meta.env.VITE_AWS_URL}logo.webp`}
                      alt="Event-Photo"
                      className="object-cover h-[300px] w-full"
                    />
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="font-semibold">
                      {t(translations.adminPanel.events.singleEventPanel.eventName)}:
                    </span>
                    <span>{singleEvent?.title}</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="font-semibold">
                      {t(translations.adminPanel.events.singleEventPanel.eventDescription)}:
                    </span>
                    <span>{singleEvent?.description}</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="font-semibold">
                      {t(translations.adminPanel.events.singleEventPanel.eventCreator)}:
                    </span>
                    <Link
                      to={`?tab=users&identifier=${singleEvent?.createdBy?._id}`}
                      className="flex gap-1 hover:underline"
                    >
                      <UserAvatar
                        user={singleEvent?.createdBy}
                        size="h-6 w-6"
                        backgroundActive={true}
                      />
                      <span>
                        {singleEvent?.createdBy?.fullName ||
                          singleEvent?.createdBy?.organizationName}
                      </span>
                    </Link>
                  </li>
                  <li className="flex flex-col sm:flex-row gap-1">
                    <span className="font-semibold">
                      {t(translations.adminPanel.events.singleEventPanel.startDate)}:
                    </span>
                    <span>{formatDateWithTime(singleEvent?.startDate)}</span>
                  </li>
                  <li className="flex flex-col sm:flex-row gap-1">
                    <span className="font-semibold">
                      {t(translations.adminPanel.events.singleEventPanel.endDate)}:
                    </span>
                    <span>{formatDateWithTime(singleEvent?.endDate)}</span>
                  </li>
                  <li className="flex flex-col sm:flex-row gap-1">
                    <span className="font-semibold">
                      {t(translations.adminPanel.events.singleEventPanel.contactName)}:
                    </span>
                    <span>{singleEvent?.contactName}</span>
                  </li>
                  <li className="flex flex-col sm:flex-row gap-1">
                    <span className="font-semibold">
                      {t(translations.adminPanel.events.singleEventPanel.contactEmail)}:{" "}
                    </span>
                    <span>{singleEvent?.contactEmail}</span>
                  </li>
                  <li className="flex gap-1">
                    <span className="font-semibold">
                      {t(translations.adminPanel.events.singleEventPanel.contactPhone)}:
                    </span>
                    <span>{singleEvent?.contactPhone}</span>
                  </li>
                  <li className="flex flex-col sm:flex-row gap-1">
                    <span className="font-semibold">
                      {t(translations.adminPanel.events.singleEventPanel.languages)}:
                    </span>
                    <span>
                      {singleEvent?.languages.length > 0 &&
                        singleEvent.languages
                          .map((language) => getLangName(language))
                          .filter(Boolean)
                          .join(", ")}
                    </span>
                  </li>
                  <li className="flex flex-col sm:flex-row gap-1">
                    <span className="font-semibold">
                      {t(translations.adminPanel.events.singleEventPanel.interests)}
                    </span>
                    <span>
                      {singleEvent?.interestIds.length > 0 &&
                        singleEvent?.interestIds
                          .map((interest) => getTranslatedCategory(interest.name))
                          .join(" , ")}
                    </span>
                  </li>
                  <li className="flex gap-1">
                    <span className="font-semibold">
                      {t(translations.adminPanel.events.singleEventPanel.onlineEvent)}:
                    </span>
                    <span>
                      {singleEvent?.isOnline
                        ? t(translations.adminPanel.yes)
                        : t(translations.adminPanel.no)}
                    </span>
                  </li>
                  <li className="flex gap-1 flex-col">
                    <span className="font-semibold">
                      {t(translations.adminPanel.events.singleEventPanel.eventLocation)}:
                    </span>
                    <span>
                      {!singleEvent?.isOnline &&
                        `${singleEvent?.addressId?.streetName} ${singleEvent?.addressId?.streetNumber} ${singleEvent?.addressId?.zipCode}, ${singleEvent?.addressId?.city} ${singleEvent?.addressId?.state} ${singleEvent?.addressId?.country}`}
                    </span>
                  </li>
                  <li className="flex gap-1 flex-col">
                    <span className="font-semibold">
                      {t(translations.adminPanel.events.singleEventPanel.documents)}:{" "}
                    </span>
                    <span>
                      {singleEvent?.documentIds.length > 0 &&
                        singleEvent?.documentIds.map((document) => {
                          return (
                            <div
                              key={document._id}
                              className="p-1 text-dark-gray-1 rounded cursor-pointer flex flex-col gap-1 items-start"
                            >
                              <span
                                onClick={() => window.open(`${document.fileUrl}`, "_blank")}
                                className="text-sm font-medium flex gap-1 items-center hover:text-gray-1"
                              >
                                - {document.title} <FaExternalLinkAlt />
                              </span>
                              <span className="text-xs text-gray-500">
                                {t(translations.adminPanel.events.singleEventPanel.documentId)}:{" "}
                                {document._id}
                              </span>
                            </div>
                          )
                        })}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-white dark:bg-dark-gray-1 rounded-lg w-full xl:w-1/2 p-4">
                <div className="flex justify-between text-[1.125rem] font-semibold text-primary-green dark:text-white">
                  <h1>{t(translations.adminPanel.events.singleEventPanel.eventParticipants)}</h1>
                  <p className="px-2 text-lg">
                    (
                    {
                      singleEvent?.eventParticipantIds.filter(
                        (participant) => participant.isApproved === true
                      ).length
                    }
                    /{singleEvent?.maxParticipant})
                  </p>
                </div>
                <div className="h-auto mt-5">
                  {singleEvent?.eventParticipantIds.length > 0 ? (
                    <div className="min-w-full bg-white dark:bg-dark-gray-1">
                      {/* Header Row */}
                      <div className="w-full border-b text-gray-600 dark:text-light-gray uppercase text-xs leading-normal flex gap-2">
                        <div className="py-3 text-left flex-[2] max-w-[130px]">
                          {t(translations.adminPanel.events.singleEventPanel.participantId)}
                        </div>
                        <div className="py-3 text-left flex-[2] max-w-[130px]">
                          {t(translations.adminPanel.events.singleEventPanel.user)}
                        </div>
                        <div className="py-3 text-center flex-[1]">
                          {t(translations.adminPanel.events.singleEventPanel.status)}
                        </div>
                        {window.innerWidth > 500 && (
                          <div className="py-3 text-center flex-[1]">
                            {t(translations.adminPanel.events.singleEventPanel.joinDate)}
                          </div>
                        )}
                      </div>

                      {/* Data Rows */}
                      <div className="text-gray-600 dark:text-gray-200 text-sm font-light w-full">
                        {singleEvent?.eventParticipantIds.map((participant) => (
                          <ul
                            key={participant?._id}
                            className="border-b border-gray-200 dark:border-gray-600 flex gap-2 items-center"
                          >
                            {/* Participant ID */}
                            <li
                              className="text-left flex-[2] max-w-[130px] whitespace-nowrap overflow-x-scroll scrollbar-hide py-3"
                              data-label={t(
                                translations.adminPanel.events.singleEventPanel.participantIdDL
                              )}
                            >
                              {participant?._id}
                            </li>
                            {/* User */}
                            <li
                              onClick={() =>
                                navigate(
                                  `/admin-panel?tab=users&identifier=${participant?.userId?._id}`
                                )
                              }
                              className="text-center flex-[2] max-w-[130px] whitespace-nowrap overflow-x-scroll scrollbar-hide py-3"
                              data-label={t(translations.adminPanel.events.singleEventPanel.userDL)}
                            >
                              <div className="flex gap-1 items-center w-full cursor-pointer">
                                <UserAvatar
                                  user={participant?.userId}
                                  size="h-6 w-6"
                                  backgroundActive={true}
                                />
                                <span className="text-xs text-left overflow-x-scroll scrollbar-hide whitespace-nowrap flex-1">
                                  {participant?.userId?.fullName}
                                </span>
                              </div>
                            </li>
                            {/* Status */}
                            <li
                              className={`text-center flex-[1] py-3 ${
                                participant?.isPending
                                  ? "text-warning dark:text-orange-300"
                                  : participant?.isApproved && !participant?.isPending
                                    ? "text-primary-green dark:text-green-300"
                                    : !participant?.isApproved && !participant?.isPending
                                      ? "text-danger dark:text-red-300"
                                      : participant?.hasJoined === "joined"
                                        ? "text-primary-green dark:text-green-300"
                                        : "text-danger dark:text-red-300"
                              }`}
                              data-label={t(
                                translations.adminPanel.events.singleEventPanel.statusDL
                              )}
                            >
                              {participant?.isPending
                                ? t(translations.adminPanel.events.singleEventPanel.pending)
                                : participant?.isApproved && !participant?.isPending
                                  ? t(translations.adminPanel.events.singleEventPanel.approved)
                                  : !participant?.isApproved && !participant?.isPending
                                    ? t(translations.adminPanel.events.singleEventPanel.rejected)
                                    : participant?.hasJoined === "joined"
                                      ? t(translations.adminPanel.events.singleEventPanel.joined)
                                      : t(
                                          translations.adminPanel.events.singleEventPanel.notJoined
                                        )}
                            </li>
                            {/* Join Date */}
                            {window.innerWidth > 500 && (
                              <li
                                className="text-center flex-[1] py-3 overflow-x-scroll scrollbar-hide"
                                data-label={t(
                                  translations.adminPanel.events.singleEventPanel.joinDateDL
                                )}
                              >
                                {formatDate(participant?.createdAt)}
                              </li>
                            )}
                          </ul>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-600 dark:text-light-gray">
                      {t(translations.adminPanel.events.singleEventPanel.noParticipantYet)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>{t(translations.adminPanel.events.singleEventPanel.noEvent)}</div>
        )}
      </div>
      {isSettingsModalOpen && (
        <div className="absolute z-50 top-14 right-8 border border-gray-1 dark:border-gray-1 overflow-hidden rounded-lg">
          <div
            ref={modalRef}
            className="bg-white text-sm md:text-md dark:bg-gray-1 shadow-lg w-[170px] md:w-[220px]"
          >
            <div className="flex flex-col justify-between">
              <button
                onClick={openDeleteEventModal}
                className="text-danger hover:text-danger/50 border-b dark:border-gray-2 hover:bg-light-gray-2 w-full py-2 px-2"
              >
                {t(translations.adminPanel.events.singleEventPanel.deleteEvent)}
              </button>
              <button
                onClick={handleSuspendEvent}
                className="text-warning hover:text-warning/50 border-b dark:border-gray-2 hover:bg-light-gray-2 w-full py-2 px-2"
              >
                {singleEvent?.isActive
                  ? t(translations.adminPanel.events.singleEventPanel.suspendEvent)
                  : t(translations.adminPanel.events.singleEventPanel.unsuspendEvent)}
              </button>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className=" text-primary-green hover:text-primary-green/50 hover:bg-light-gray-2 w-full py-2 px-2"
              >
                {t(translations.adminPanel.cancel)}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Modal */}
      {isDeleteEventModalOpen && (
        <DeleteModal
          onClose={closeDeleteEventModal}
          onDelete={handleDeleteEvent}
          title={t(translations.adminPanel.events.singleEventPanel.deleteEvent)}
          description={t(translations.adminPanel.events.singleEventPanel.desc)}
        />
      )}
    </div>
  )
}

export default SingleEventPanel
