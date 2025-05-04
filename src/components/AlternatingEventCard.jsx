import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const AlternatingEventCard = ({ event, index }) => {
  const { t } = useTranslation();
  const isEven = index % 2 === 0;
  const isPast = new Date(event.eventDate) < new Date();

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
    <div
      className={cn(
        "mb-12 rounded-lg overflow-hidden border border-dark-200 bg-dark-100 shadow-md",
        "transition-all duration-300 hover:shadow-lg",
        isPast && "opacity-60"
      )}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section - Left on odd indexes, Right on even indexes */}
        <div
          className={cn(
            "md:w-1/2 h-64 relative overflow-hidden",
            isEven ? "md:order-2" : "md:order-1"
          )}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${event.imageUrl || 'https://images.pexels.com/photos/7861965/pexels-photo-7861965.jpeg'}')`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
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

        {/* Content Section - Right on odd indexes, Left on even indexes */}
        <div
          className={cn(
            "md:w-1/2 p-6",
            isEven ? "md:order-1" : "md:order-2"
          )}
        >
          <h3 className="text-2xl font-oswald mb-3 text-[#e0e0e0]">{event.title}</h3>
          <p className="text-gray-400 mb-4">{event.description}</p>

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
            <div className="flex items-center text-gray-300">
              <Users size={18} className="mr-2 text-primary" />
              <span>
                {event.registrations ? event.registrations.length : 0}
                {event.maxParticipants ? ` / ${event.maxParticipants}` : ''} {t('events.participants')}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <Link
              to={`/events/${event._id}-${event.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-primary hover:text-primary-light font-medium transition-colors"
            >
              {t('events.details')}
            </Link>
            {!isPast && (
              <Link
                to={`/event-signup/${event._id}-${event.title.toLowerCase().replace(/\s+/g, '-')}`}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternatingEventCard;
