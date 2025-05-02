import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, Users, ChevronDown, ChevronUp, Edit, Trash } from 'lucide-react';
import { getEvents, updateRegistrationStatus } from '../lib/apiService';
import EventRegistrationsTable from './EventRegistrationsTable';
import { cn } from '../lib/utils';

const AdminEventManager = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventsData = await getEvents();
      
      // Sort events by date (newest first)
      const sortedEvents = [...eventsData].sort((a, b) => 
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
          {t('admin.retry')}
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">{t('admin.manageEvents')}</h2>
      
      {events.map((event) => (
        <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
              <div className="flex items-center">
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold mr-4",
                  event.status === 'upcoming' && "bg-green-100 text-green-800",
                  event.status === 'ongoing' && "bg-blue-100 text-blue-800",
                  event.status === 'completed' && "bg-gray-100 text-gray-800",
                  event.status === 'cancelled' && "bg-red-100 text-red-800"
                )}>
                  {t(`events.status.${event.status}`)}
                </span>
                <div className="flex space-x-2">
                  <button 
                    className="p-1 text-gray-500 hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit event
                    }}
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete event
                    }}
                  >
                    <Trash size={18} />
                  </button>
                  {expandedEvent === event._id ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {expandedEvent === event._id && (
            <div className="p-6 bg-gray-50">
              <EventRegistrationsTable 
                event={event} 
                onUpdateStatus={(registrationId, status) => 
                  handleUpdateRegistrationStatus(event._id, registrationId, status)
                } 
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminEventManager;
