import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { getEvents } from '../lib/apiService';

const HomePage = () => {
  const { t } = useTranslation();
  const [latestEvent, setLatestEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const events = await getEvents();

        if (events && events.length > 0) {
          // Sort events by date (ascending)
          const sortedEvents = [...events].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

          // Get the first upcoming event as the latest event
          const now = new Date();
          const upcoming = sortedEvents.filter(event => new Date(event.eventDate) >= now);

          if (upcoming.length > 0) {
            setLatestEvent(upcoming[0]);
            // Get up to 3 more upcoming events for the events section
            setUpcomingEvents(upcoming.slice(0, 4));
          } else {
            // If no upcoming events, just use the most recent one
            setLatestEvent(sortedEvents[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <HeroSection />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-2">{t('home.latestEvent')}</h2>
            <div className="w-24 h-1 bg-teal-500 mx-auto"></div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : latestEvent ? (
            <motion.div
              className="max-w-3xl mx-auto bg-gray-100 rounded-lg overflow-hidden shadow-md"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div
                className="h-64 bg-cover bg-center"
                style={{ backgroundImage: `url('${latestEvent.imageUrl || 'https://images.pexels.com/photos/7861965/pexels-photo-7861965.jpeg'}')` }}
              ></div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">{latestEvent.title}</h3>
                <p className="text-gray-700 mb-4">{latestEvent.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="text-gray-500 text-sm">{t('events.date')}</p>
                    <p className="font-semibold">{new Date(latestEvent.eventDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="text-gray-500 text-sm">{t('events.time')}</p>
                    <p className="font-semibold">{latestEvent.time}</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="text-gray-500 text-sm">{t('events.location')}</p>
                    <p className="font-semibold">{latestEvent.location}</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Link
                    to={`/event-signup/${latestEvent._id}`}
                    className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded transition-colors"
                  >
                    {t('events.signup')}
                    <ChevronRight size={20} className="ml-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="text-center text-gray-600"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <p>{t('home.noEvents')}</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-2">{t('home.upcomingEvents')}</h2>
              <div className="w-24 h-1 bg-teal-500 mx-auto"></div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
            >
              {upcomingEvents.map((event) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-md">
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url('${event.imageUrl || 'https://images.pexels.com/photos/7861965/pexels-photo-7861965.jpeg'}')` }}
                    ></div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                      <div className="flex items-center text-gray-600 mb-4">
                        <Calendar size={18} className="mr-2 text-teal-600" />
                        <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                      </div>
                      <Link
                        to={`/event-signup/${event._id}`}
                        className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded transition-colors"
                      >
                        {t('events.signup')}
                        <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center">
              <Link
                to="/events"
                className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded transition-colors"
              >
                {t('home.viewAllEvents')}
                <ChevronRight size={20} className="ml-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-3xl font-bold mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Black Roses Airsoft Team
            </motion.h2>
            <motion.p
              className="text-lg mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Join one of the most elite airsoft teams in the Belgium. We focus on tactical gameplay, teamwork, and sportsmanship.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Link
                to="/contact"
                className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded transition-colors"
              >
                Join Our Team
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
