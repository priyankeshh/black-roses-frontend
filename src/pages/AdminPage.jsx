import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertTriangle, Upload, Plus, List, Users } from 'lucide-react';
import { createEvent as createEventAPI, uploadImage } from '../lib/apiService';
import AdminEventManager from '../components/AdminEventManager';
import AdminManagementPage from './AdminManagementPage';
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
  const { t } = useTranslation();
  const { isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('manage'); // 'create', 'manage', or 'users'

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    imageUrl: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    try {
      setUploadingImage(true);
      const imageData = await uploadImage(imageFile, 'event');
      setFormData({
        ...formData,
        imageUrl: imageData.url
      });
      return imageData.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setFormSubmitting(true);

      // Upload image first if there's one selected
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await handleImageUpload();
        if (!imageUrl) {
          throw new Error('Image upload failed');
        }
      }

      // Ensure we're using the correct field names expected by the backend
      const eventData = {
        title: formData.title,
        description: formData.description,
        eventDate: formData.date, // Map to eventDate as expected by the backend
        time: formData.time,
        location: formData.location,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        imageUrl: imageUrl
      };

      console.log('Submitting event data:', eventData);
      const result = await createEventAPI(eventData);

      if (result.success) {
        setFormStatus('success');
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          maxParticipants: '',
          imageUrl: ''
        });

        // Reset image states
        setImageFile(null);
        setImagePreview('');

        // Reset form status after 3 seconds
        setTimeout(() => {
          setFormStatus('idle');
        }, 3000);
      } else {
        throw new Error('Event creation failed');
      }

    } catch (error) {
      console.error('Error creating event:', error);
      setFormStatus('error');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{t('admin.title')}</h1>
          <div className="w-24 h-1 bg-teal-500 mx-auto"></div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-3 px-6 font-medium text-sm focus:outline-none ${
                activeTab === 'manage'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('manage')}
            >
              <List size={18} className="inline-block mr-2" />
              {t('admin.manageEvents')}
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm focus:outline-none ${
                activeTab === 'create'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('create')}
            >
              <Plus size={18} className="inline-block mr-2" />
              {t('admin.createEvent')}
            </button>
            {isSuperAdmin() && (
              <button
                className={`py-3 px-6 font-medium text-sm focus:outline-none ${
                  activeTab === 'users'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('users')}
              >
                <Users size={18} className="inline-block mr-2" />
                {t('admin.manageUsers')}
              </button>
            )}
          </div>
        </div>

        {activeTab === 'manage' ? (
          <div className="max-w-5xl mx-auto">
            <AdminEventManager />
          </div>
        ) : activeTab === 'users' ? (
          <div className="max-w-5xl mx-auto">
            <AdminManagementPage />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">{t('admin.createEvent')}</h2>

              {formStatus === 'success' ? (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-start mb-6">
                  <CheckCircle className="text-green-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                  <p>{t('admin.success')}</p>
                </div>
              ) : formStatus === 'error' ? (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-start mb-6">
                  <AlertTriangle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                  <p>{t('admin.error')}</p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
                    {t('admin.eventTitle')} *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
                    {t('admin.eventDescription')} *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-gray-700 font-medium mb-1">
                      {t('admin.eventDate')} *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-gray-700 font-medium mb-1">
                      {t('admin.eventTime')} *
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-gray-700 font-medium mb-1">
                      {t('admin.eventLocation')} *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="maxParticipants" className="block text-gray-700 font-medium mb-1">
                    {t('admin.maxParticipants')}
                  </label>
                  <input
                    type="number"
                    id="maxParticipants"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label htmlFor="image" className="block text-gray-700 font-medium mb-1">
                    {t('admin.eventImage')}
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="image"
                      className="cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md flex items-center transition-colors"
                    >
                      <Upload size={18} className="mr-2" />
                      {t('admin.uploadImage')}
                    </label>
                    {uploadingImage && (
                      <div className="ml-3">
                        <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>

                  {imagePreview && (
                    <div className="mt-3">
                      <div className="relative w-40 h-40 rounded-md overflow-hidden border border-gray-300">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70"
                >
                  {formSubmitting ? (
                    <span className="flex items-center justify-center">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      {t('admin.submit')}
                    </span>
                  ) : (
                    t('admin.submit')
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
