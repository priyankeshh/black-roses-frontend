import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, registerForEvent } from '../lib/apiService';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const EventSignupPage = () => {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Extract the actual event ID from the URL parameter (which might include the title)
  const actualEventId = eventId.split('-')[0];

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    teamName: ''
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!actualEventId) return;

      try {
        setLoading(true);
        const data = await getEventById(actualEventId);

        if (data) {
          setEvent(data);
        } else {
          navigate('/events');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [actualEventId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!actualEventId) return;

    try {
      setFormSubmitting(true);

      const registrationData = {
        name: formData.name,
        email: formData.email,
        teamName: formData.teamName
      };

      const result = await registerForEvent(actualEventId, registrationData);

      if (result.success) {
        setFormStatus('success');
        setFormData({
          name: '',
          email: '',
          teamName: ''
        });

        // Redirect to events page after successful registration
        setTimeout(() => {
          navigate('/events');
        }, 3000);
      } else {
        throw new Error('Registration failed');
      }

    } catch (error) {
      console.error('Error submitting registration:', error);
      setFormStatus('error');
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">{t('eventSignup.title')}</h1>

          {event && (
            <div className="mb-8 p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-gray-700 mb-3">{event.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t('events.date')}</p>
                  <p className="font-medium">{new Date(event.eventDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('events.time')}</p>
                  <p className="font-medium">{event.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('events.location')}</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
            </div>
          )}

          {formStatus === 'success' ? (
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-start">
              <CheckCircle className="text-green-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
              <p>{t('eventSignup.success')}</p>
            </div>
          ) : formStatus === 'error' ? (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-start">
              <AlertTriangle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
              <p>{t('eventSignup.error')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                  {t('eventSignup.name')} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                  {t('eventSignup.email')} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label htmlFor="teamName" className="block text-gray-700 font-medium mb-1">
                  {t('eventSignup.teamName')} *
                </label>
                <input
                  type="text"
                  id="teamName"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70"
              >
                {formSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    {t('eventSignup.submit')}
                  </span>
                ) : (
                  t('eventSignup.submit')
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventSignupPage;
