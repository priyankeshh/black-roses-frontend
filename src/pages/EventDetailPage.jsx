import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ChevronRight } from 'lucide-react';
import { getEventById } from '../lib/apiService';

const EventDetailPage = () => {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Extract the actual event ID from the URL parameter (which might include the title)
  const actualEventId = eventId.split('-')[0];

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!actualEventId) return;

      try {
        setLoading(true);
        const data = await getEventById(actualEventId);

        if (data) {
          setEvent(data);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [actualEventId, navigate]);

  // Format date from ISO string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Check if event is full
  const isEventFull = () => {
    return event.maxParticipants && event.registrations &&
           event.registrations.length >= event.maxParticipants;
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">{t('events.notFound')}</h1>
          <Link to="/" className="text-teal-600 hover:text-teal-700">
            {t('events.backToEvents')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Event Header */}
          <div className="mb-8">
            <Link to="/" className="text-teal-600 hover:text-teal-700 mb-4 inline-block">
              &larr; {t('events.backToEvents')}
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">{event.title}</h1>
          </div>

          {/* Event Image */}
          {event.imageUrl && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-md">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Event Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">{t('events.description')}</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{event.description}</p>
          </div>

          {/* Registration Button */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Link
              to={`/event-signup/${event._id}-${event.title.toLowerCase().replace(/\s+/g, '-')}`}
              className={`inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded transition-colors ${
                isEventFull()
                  ? "bg-gray-400 cursor-not-allowed"
                  : ""
              }`}
              onClick={(e) => isEventFull() && e.preventDefault()}
            >
              {isEventFull() ? t('events.full') : t('events.signup')}
              <ChevronRight size={20} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
