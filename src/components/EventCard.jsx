import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const EventCard = ({ event }) => {
  const { t } = useTranslation();

  return (
    <div className={cn(
      "bg-dark-100 shadow-md rounded-lg overflow-hidden border border-dark-200",
      "transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    )}>
      <div 
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/7861965/pexels-photo-7861965.jpeg')" }}
      ></div>
      <div className="p-6">
        <h3 className="text-xl font-oswald mb-2">{event.title}</h3>
        <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300">
            <Calendar size={18} className="mr-2 text-primary" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Clock size={18} className="mr-2 text-primary" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <MapPin size={18} className="mr-2 text-primary" />
            <span>{event.location}</span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Link 
            to={`/events/${event.id}`}
            className="text-primary hover:text-primary-light font-medium transition-colors"
          >
            {t('events.details')}
          </Link>
          <Link 
            to={`/event-signup/${event.id}`}
            className={cn(
              "px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded",
              "transition-colors"
            )}
          >
            {t('events.signup')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;