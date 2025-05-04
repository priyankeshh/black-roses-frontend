import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, Users, ChevronDown, ChevronUp, Edit, Trash } from 'lucide-react';
import { getEvents, updateRegistrationStatus, updateEvent, deleteEvent } from '../lib/apiService';
import EventRegistrationsTable from './EventRegistrationsTable';
import { cn } from '../lib/utils';

const AdminEventManager = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventsData = await getEvents();

      // Make sure eventsData is an array
      const eventsArray = Array.isArray(eventsData) ? eventsData : [];

      // Update event status based on date
      const now = new Date();
      const updatedEvents = eventsArray.map(event => {
        const eventDate = new Date(event.eventDate);
        let status = event.status;

        // If event is in the past and not already marked as completed
        if (eventDate < now && status !== 'completed' && status !== 'cancelled') {
          status = 'completed';
        }
        // If event is today and not already marked as ongoing
        else if (eventDate.toDateString() === now.toDateString() && status !== 'ongoing' && status !== 'cancelled') {
          status = 'ongoing';
        }
        // If event is in the future and not already marked as upcoming
        else if (eventDate > now && status !== 'upcoming' && status !== 'cancelled') {
          status = 'upcoming';
        }

        return { ...event, status };
      });

      // Sort events by date (newest first)
      const sortedEvents = [...updatedEvents].sort((a, b) =>
        new Date(b.eventDate) - new Date(a.eventDate)
      );

      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(t('admin.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRegistrationStatus = async (eventId, registrationId, status) => {
    try {
      await updateRegistrationStatus(eventId, registrationId, status);
      // Refresh events after updating status
      fetchEvents();
    } catch (error) {
      console.error('Error updating registration status:', error);
      // Show error message
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event._id);
    setEditFormData({
      title: event.title,
      description: event.description,
      date: event.eventDate,
      time: event.time,
      location: event.location,
      maxParticipants: event.maxParticipants
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEvent(editingEvent, editFormData);
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      setError(t('admin.updateError'));
    }
  };

  const handleDeleteClick = async (eventId) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      try {
        await deleteEvent(eventId);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        setError(t('admin.deleteError'));
      }
    }
  };

  const toggleEventExpand = (eventId) => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(eventId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4">
        <p>{error}</p>
        <button
          onClick={fetchEvents}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 mb-4">{t('admin.noEvents')}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('admin.manageEvents')}</h2>

      {events.map((event) => (
        <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
          <div
            className={cn(
              "p-6 cursor-pointer",
              expandedEvent === event._id ? "border-b border-gray-200" : ""
            )}
            onClick={() => toggleEventExpand(event._id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1 text-primary" />
                    <span>{formatDate(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1 text-primary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1 text-primary" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-1 text-primary" />
                    <span>
                      {event.registrations ? event.registrations.length : 0}
                      {event.maxParticipants ? ` / ${event.maxParticipants}` : ''}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {event.status && (
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    event.status === 'upcoming' && "bg-green-500 text-white",
                    event.status === 'ongoing' && "bg-blue-500 text-white",
                    event.status === 'completed' && "bg-gray-500 text-white",
                    event.status === 'cancelled' && "bg-red-500 text-white"
                  )}>
                    {t(`events.status.${event.status}`)}
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(event);
                  }}
                  className="p-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(event._id);
                  }}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Trash size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleEventExpand(event._id);
                  }}
                  className="p-2 text-gray-600 hover:text-primary transition-colors"
                >
                  {expandedEvent === event._id ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {editingEvent === event._id && (
            <div className="p-6 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    {t('admin.eventTitle')}
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    {t('admin.eventDescription')}
                  </label>
                  <textarea
                    id="description"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    rows="3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      {t('admin.eventDate')}
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={editFormData.date}
                      onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                      {t('admin.eventTime')}
                    </label>
                    <input
                      type="time"
                      id="time"
                      value={editFormData.time}
                      onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      {t('admin.eventLocation')}
                    </label>
                    <input
                      type="text"
                      id="location"
                      value={editFormData.location}
                      onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">
                      {t('admin.maxParticipants')}
                    </label>
                    <input
                      type="number"
                      id="maxParticipants"
                      value={editFormData.maxParticipants}
                      onChange={(e) => setEditFormData({ ...editFormData, maxParticipants: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      min="1"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md transition-colors"
                  >
                    {t('common.save')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {expandedEvent === event._id && (
            <div className="p-6 border-t border-gray-200">
              <EventRegistrationsTable
                event={event}
                onUpdateStatus={handleUpdateRegistrationStatus}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminEventManager;
