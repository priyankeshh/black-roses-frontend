import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const ProfileEventCard = ({ event }) => {
  const { t } = useTranslation();

  // Check if event is valid
  if (!event || typeof event !== 'object') {
    // Invalid event object
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

  // Get event status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-green-500';
      case 'ongoing': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-800">{actualEvent.title}</h3>
        {actualEvent.status && (
          <span className={cn(
            "px-2 py-1 text-xs font-medium text-white rounded-full",
            getStatusClass(actualEvent.status)
          )}>
            {t(`events.status.${actualEvent.status}`)}
          </span>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{actualEvent.description}</p>

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

        {/* Registration Status */}
        {actualEvent.userRegistration && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-teal-100 text-teal-800 mr-2">
                {t(`eventSignup.status.${actualEvent.userRegistration.status}`) || actualEvent.userRegistration.status}
              </span>
              <span className="text-xs text-gray-500">
                {t('profile.registeredOn')}: {formatDate(actualEvent.userRegistration.registeredAt)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Link
          to={`/events/${eventId}`}
          className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded transition-colors shadow-sm"
        >
          {t('events.details')}
        </Link>
      </div>
    </div>
  );
};

export default ProfileEventCard;
