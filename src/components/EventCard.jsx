import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const EventCard = ({ event }) => {
  const { t } = useTranslation();

  // Check if event is valid
  if (!event || typeof event !== 'object') {
    console.error('Invalid event object:', event);
    return <div className="p-4 bg-red-100 text-red-800 rounded">Invalid event data</div>;
  }

  // Handle nested event structure
  const actualEvent = event.data && event.data.events && event.data.events[0] ? event.data.events[0] : event;

  // Ensure we have a valid ID (handle both _id and id)
  const eventId = actualEvent._id || actualEvent.id;

  // Log the event structure to debug
  console.log('EventCard received event:', { eventId, actualEvent });

  // Format date from ISO string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Check if event is full
  const isEventFull = () => {
    return actualEvent.maxParticipants && actualEvent.registrations &&
           actualEvent.registrations.length >= actualEvent.maxParticipants;
  };

  return (
    <div className={cn(
      "bg-dark-100 shadow-md rounded-lg overflow-hidden border border-dark-200",
      "transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    )}>
      <div className="h-48 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${actualEvent.imageUrl || 'https://images.pexels.com/photos/7861965/pexels-photo-7861965.jpeg'}')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        {actualEvent.status && (
          <div className={cn(
            "absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold",
            actualEvent.status === 'upcoming' && "bg-green-500 text-black",
            actualEvent.status === 'ongoing' && "bg-blue-500 text-black",
            actualEvent.status === 'completed' && "bg-gray-500 text-black",
            actualEvent.status === 'cancelled' && "bg-red-500 text-black"
          )}>
            {t(`events.status.${actualEvent.status}`)}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-oswald mb-2">{actualEvent.title}</h3>
        <p className="text-gray-400 mb-4 line-clamp-2">{actualEvent.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300">
            <Calendar size={18} className="mr-2 text-teal-600" />
            <span>{formatDate(actualEvent.eventDate)}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Clock size={18} className="mr-2 text-teal-600" />
            <span>{actualEvent.time}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <MapPin size={18} className="mr-2 text-teal-600" />
            <span>{actualEvent.location}</span>
          </div>
          {actualEvent.maxParticipants && (
            <div className="flex items-center text-gray-300">
              <Users size={18} className="mr-2 text-teal-600" />
              <span>
                {actualEvent.registrations ? actualEvent.registrations.length : 0} / {actualEvent.maxParticipants} {t('events.participants')}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Link
            to={`/events/${eventId}-${actualEvent.title ? actualEvent.title.toLowerCase().replace(/\s+/g, '-') : 'event'}`}
            className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
          >
            {t('events.details')}
          </Link>
          <Link
            to={`/event-signup/${eventId}-${actualEvent.title ? actualEvent.title.toLowerCase().replace(/\s+/g, '-') : 'event'}`}
            className={cn(
              "px-4 py-2 text-black font-medium rounded transition-colors",
              isEventFull()
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            )}
            onClick={(e) => isEventFull() && e.preventDefault()}
          >
            {isEventFull() ? t('events.full') : t('events.signup')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;