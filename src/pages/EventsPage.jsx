import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import EventCard from '../components/EventCard';
import { getEvents } from '../lib/apiService';

const EventsPage = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEvents({ upcoming: true });

        if (data) {
          // Sort events by date (ascending)
          const sortedEvents = [...data].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
          setEvents(sortedEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(t('events.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [t]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="pt-24 pb-16 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-black">{t('events.title')}</h1>
          <div className="w-24 h-1 bg-teal-500 mx-auto"></div>
        </div>

        {loading ? (
          <div className="flex justify-center my-12">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
            >
              {t('common.retry')}
            </button>
          </div>
        ) : events.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {events.map((event) => (
              <motion.div key={event._id} variants={item}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            <p className="text-xl">{t('events.noEvents')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
