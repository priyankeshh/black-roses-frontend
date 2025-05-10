import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, registerForEvent, checkEventRegistration } from '../lib/apiService';
import { CheckCircle, AlertTriangle, Calendar, Clock, MapPin, Info } from 'lucide-react';

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
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    gear: 'own',
    wantsFood: false,
    invitedBy: ''
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!actualEventId) return;

      try {
        setLoading(true);
        const data = await getEventById(actualEventId);

        if (data) {
          // Make sure data is an object with the required fields
          if (data._id && data.title && data.eventDate) {
            setEvent(data);
          } else {
            console.error('Invalid event data format:', data);
            navigate('/events');
          }
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

  const handleInputChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };

    setFormData(newFormData);

    // If email field is changed and has a valid format, check if already registered
    if (name === 'email' && value && value.includes('@') && actualEventId) {
      try {
        const isRegistered = await checkEventRegistration(actualEventId, value);
        setAlreadyRegistered(isRegistered);
      } catch (error) {
        console.error('Error checking registration:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setFormSubmitting(true);

      // Check if already registered before submitting
      const isRegistered = await checkEventRegistration(actualEventId, formData.email);

      if (isRegistered) {
        setAlreadyRegistered(true);
        setFormStatus('already-registered');
        return;
      }

      const result = await registerForEvent(actualEventId, formData);
      if (result.success) {
        setFormStatus('success');
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      console.error('Error registering for event:', error);

      // Check if the error is because user is already registered
      if (error.message && error.message.includes('already registered')) {
        setAlreadyRegistered(true);
        setFormStatus('already-registered');
      } else {
        setFormStatus('error');
      }
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
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-800">
                  <Calendar size={18} className="mr-2 text-teal-600" />
                  <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-800">
                  <Clock size={18} className="mr-2 text-teal-600" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-gray-800">
                  <MapPin size={18} className="mr-2 text-teal-600" />
                  <span>{event.location}</span>
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
          ) : formStatus === 'already-registered' || alreadyRegistered ? (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 flex items-start">
              <Info className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
              <p>{t('eventSignup.alreadyRegistered') || 'You are already registered for this event.'}</p>
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
                <label htmlFor="age" className="block text-gray-700 font-medium mb-1">
                  {t('eventSignup.age')} *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="18"
                  value={formData.age}
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
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    alreadyRegistered ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                />
                {alreadyRegistered && (
                  <p className="mt-1 text-sm text-blue-600 flex items-center">
                    <Info size={14} className="mr-1" />
                    {t('eventSignup.emailAlreadyRegistered') || 'This email is already registered for this event.'}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
                  {t('eventSignup.phone')} *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  {t('eventSignup.gear')} *
                </label>
                <div className="flex space-x-4 mt-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="own-gear"
                      name="gear"
                      value="own"
                      checked={formData.gear === 'own'}
                      onChange={handleInputChange}
                      required
                      className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    <label htmlFor="own-gear" className="text-gray-700">
                      {t('eventSignup.ownGear')}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="rental-gear"
                      name="gear"
                      value="rental"
                      checked={formData.gear === 'rental'}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    <label htmlFor="rental-gear" className="text-gray-700">
                      {t('eventSignup.rentalGear')}
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="wantsFood"
                    name="wantsFood"
                    checked={formData.wantsFood}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 mr-2"
                  />
                  <label htmlFor="wantsFood" className="text-gray-700">
                    {t('eventSignup.wantsFood')}
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="invitedBy" className="block text-gray-700 font-medium mb-1">
                  {t('eventSignup.invitedBy')}
                </label>
                <input
                  type="text"
                  id="invitedBy"
                  name="invitedBy"
                  value={formData.invitedBy}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder={t('eventSignup.invitedByPlaceholder')}
                />
              </div>

              <button
                type="submit"
                disabled={formSubmitting || alreadyRegistered}
                className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-black font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70"
              >
                {formSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></span>
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
