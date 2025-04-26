import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { submitContactForm } from '../lib/dataService';

const ContactPage = () => {
  const { t } = useTranslation();

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setFormSubmitting(true);

      const contactData = {
        name: formData.name,
        email: formData.email,
        message: formData.message
      };

      const result = await submitContactForm(contactData);

      if (result.success) {
        setFormStatus('success');
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        throw new Error('Form submission failed');
      }

    } catch (error) {
      console.error('Error submitting message:', error);
      setFormStatus('error');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('contact.title')}</h1>
          <div className="w-24 h-1 bg-teal-500 mx-auto"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <motion.div
              className="bg-white rounded-lg shadow-md p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6">{t('contact.title')}</h2>

              {formStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md flex items-center">
                  <CheckCircle className="mr-2" size={20} />
                  <p>{t('contact.success')}</p>
                </div>
              )}

              {formStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md flex items-center">
                  <AlertTriangle className="mr-2" size={20} />
                  <p>{t('contact.error')}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    {t('contact.name')}
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

                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    {t('contact.email')}
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

                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    {t('contact.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-70"
                >
                  {formSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    t('contact.submit')
                  )}
                </button>
              </form>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow-md p-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">{t('contact.joinTitle')}</h2>
                <p className="text-gray-600 mb-4">{t('contact.joinText')}</p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="text-teal-600 mt-1 mr-4" size={20} />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">info@blackroses.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="text-teal-600 mt-1 mr-4" size={20} />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">+31 6 12345678</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="text-teal-600 mt-1 mr-4" size={20} />
                    <div>
                      <p className="font-medium">{t('contact.locationTitle')}</p>
                      <p className="text-gray-600">{t('contact.location')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-64 rounded-lg overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d155959.8008443514!2d4.763878075121092!3d52.3547943869085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c63fb5949a7755%3A0x6600fd4cb7c0af8d!2sAmsterdam!5e0!3m2!1sen!2snl!4v1688371500938!5m2!1sen!2snl"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Black Roses Location"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
