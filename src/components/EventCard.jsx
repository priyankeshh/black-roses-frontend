import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const EventCard = ({ event }) => {
  const { t } = useTranslation();

  // Format date from ISO string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Check if event is full
  const isEventFull = () => {
    return event.maxParticipants && event.registrations &&
           event.registrations.length >= event.maxParticipants;
  };

  return (
    <div className={cn(
      "bg-dark-100 shadow-md rounded-lg overflow-hidden border border-dark-200",
      "transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    )}>
      <div
        className="h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url('${event.imageUrl || 'https://images.pexels.com/photos/7861965/pexels-photo-7861965.jpeg'}')` }}
      >
        {event.status && (
          <div className={cn(
            "absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold",
            event.status === 'upcoming' && "bg-green-500 text-white",
            event.status === 'ongoing' && "bg-blue-500 text-white",
            event.status === 'completed' && "bg-gray-500 text-white",
            event.status === 'cancelled' && "bg-red-500 text-white"
          )}>
            {t(`events.status.${event.status}`)}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-oswald mb-2">{event.title}</h3>
        <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300">
            <Calendar size={18} className="mr-2 text-primary" />
            <span>{formatDate(event.eventDate)}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Clock size={18} className="mr-2 text-primary" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <MapPin size={18} className="mr-2 text-primary" />
            <span>{event.location}</span>
          </div>
          {event.maxParticipants && (
            <div className="flex items-center text-gray-300">
              <Users size={18} className="mr-2 text-primary" />
              <span>
                {event.registrations ? event.registrations.length : 0} / {event.maxParticipants} {t('events.participants')}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Link
            to={`/events/${event._id}`}
            className="text-primary hover:text-primary-light font-medium transition-colors"
          >
            {t('events.details')}
          </Link>
          <Link
            to={`/event-signup/${event._id}`}
            className={cn(
              "px-4 py-2 text-white font-medium rounded transition-colors",
              isEventFull()
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark"
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