import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const ProfileEventCard = ({ event }) => {
  const { t } = useTranslation();

  // Check if event is valid
  if (!event || typeof event !== 'object') {
    return <div className="p-4 bg-red-100 text-red-800 rounded">Invalid event data</div>;
  }

  // Handle nested event structure
  const actualEvent = event.data && event.data.events && event.data.events[0] ? event.data.events[0] : event;

  // Ensure we have a valid ID (handle both _id and id)
  const eventId = actualEvent._id || actualEvent.id;

  // Format date from ISO string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-gray-800">{actualEvent.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{actualEvent.description}</p>
        </div>

        <div className="space-y-1 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2 text-teal-600" />
            <span>{formatDate(actualEvent.eventDate)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock size={16} className="mr-2 text-teal-600" />
            <span>{actualEvent.time}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-2 text-teal-600" />
            <span>{actualEvent.location}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            to={`/events/${eventId}-${actualEvent.title ? actualEvent.title.toLowerCase().replace(/\s+/g, '-') : 'event'}`}
            className="flex items-center text-teal-600 hover:text-teal-700 font-medium transition-colors text-sm"
          >
            {t('events.details')}
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileEventCard;
