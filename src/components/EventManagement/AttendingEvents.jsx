import { useEffect } from "react"
import { useState } from "react"
import { FaSearch, FaChevronDown, FaChevronUp, FaSpinner } from "react-icons/fa"
import { useSelector } from "react-redux"
import useEventCall from "../../hooks/useEventCall"
import EventManagementCard from "./EventCard/EventManagementCard"
import { useTranslation } from "react-i18next"
import { translations } from "../../locales/translations"

const AttendingEvents = () => {
  const { currentUser: user } = useSelector((state) => state.auth)
  const [isUpcomingOpen, setIsUpcomingOpen] = useState(true)
  const [isPastOpen, setIsPastOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { getEvents } = useEventCall()
  const [events, setEvents] = useState([])
  const [refetch, setRefetch] = useState(null)
  const { t } = useTranslation()
  const [filteredEvents, setFilteredEvents] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const eventsResponse = await getEvents(
          `events/management?clientId=${user._id}&type=attending-events`
        )
        setEvents(eventsResponse.data)
        setFilteredEvents(eventsResponse.data)
      } catch (error) {
        // console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [refetch])

  const handleRefetch = async () => {
    setRefetch(new Date().getTime())
  }

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase()
    const filtered = events.filter((event) => event.title.toLowerCase().includes(query))
    setFilteredEvents(filtered)
  }

  const upcomingEvents = filteredEvents?.filter((event) => !event.isDone) || []
  const pastEvents = filteredEvents?.filter((event) => event.isDone) || []

  return loading ? (
    <div className="flex mt-12 items-center justify-center text-primary-green text-md font-semibold">
      <FaSpinner className="animate-spin mr-2" />
      {t(translations.registerForm.loading)}
    </div>
  ) : (
    <div className="mt-3  p-3 max-w-[99%] min-h-[calc(100vh-116px)] rounded-lg bg-light-gray dark:bg-dark-gray-3 ">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-primary-green break-words text-[1.1rem] pr-2  font-semibold">
          {t(translations.eventManagement.attendingEvents)}
        </h2>

        <div className="flex items-center border border-primary-green dark:border-white rounded-lg py-[0.36rem]">
          <FaSearch className="mx-2 text-primary-green dark:text-white" />
          <input
            type="text"
            onChange={handleSearchChange}
            placeholder={t(translations.eventManagement.searchInput)}
            className="text-[0.7rem] border-none rounded-lg focus:outline-none focus:ring-0 text-primary-green font-medium bg-light-gray dark:bg-dark-gray-3 dark:text-white"
          />
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mb-2">
        <div
          onClick={() => setIsUpcomingOpen(!isUpcomingOpen)}
          className="mr-4 my-6 flex justify-between items-center cursor-pointer text-primary-green text-md font-semibold"
        >
          <span>{t(translations.eventManagement.upcomingEvents)}</span>
          {isUpcomingOpen ? (
            <FaChevronUp className="text-primary-green" />
          ) : (
            <FaChevronDown className="text-primary-green" />
          )}
        </div>
        {isUpcomingOpen && (
          <div className="mt-2 p-2 flex flex-col gap-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <EventManagementCard key={event._id} eventId={event} refetch={handleRefetch} />
              ))
            ) : (
              <p className="dark:text-white">{t(translations.eventManagement.noUpcomingEvents)}</p>
            )}
          </div>
        )}
      </div>

      {/* Past Events */}
      <div>
        <div
          onClick={() => setIsPastOpen(!isPastOpen)}
          className="mr-4 my-6 flex justify-between items-center cursor-pointer text-primary-green text-md font-semibold"
        >
          <span>{t(translations.eventManagement.yourPastEvents)}</span>
          {isPastOpen ? (
            <FaChevronUp className="text-primary-green" />
          ) : (
            <FaChevronDown className="text-primary-green" />
          )}
        </div>
        {isPastOpen && (
          <div className="mt-2 p-2 flex flex-col gap-3">
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => <EventManagementCard key={event._id} eventId={event} />)
            ) : (
              <p className="dark:text-white">{t(translations.eventManagement.noUpcomingEvents)}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AttendingEvents
