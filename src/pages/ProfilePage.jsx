import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getUserEvents, updateUserProfile, uploadImage, changePassword } from '../lib/apiService';
import { User, Calendar, Camera, Lock, Edit, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';
import ProfileEventCard from '../components/ProfileEventCard';
import ImageCropper from '../components/ImageCropper';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profileImage: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [imageToEdit, setImageToEdit] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        profileImage: user.profileImage || ''
      });
      fetchUserEvents();
    }
  }, [user]);

  const fetchUserEvents = async () => {
    try {
      setLoading(true);
      const events = await getUserEvents();
      console.log('Received events from API:', events);

      // Log the first event to see its structure
      if (events && events.length > 0) {
        console.log('First event structure:', JSON.stringify(events[0], null, 2));
      }

      // Handle different data structures that might come from the API
      let eventsArray = [];

      if (events && events.data && events.data.events && Array.isArray(events.data.events)) {
        // This is the structure we're seeing in the console
        eventsArray = events.data.events;
        console.log('Found events in data.events:', eventsArray);
      } else if (Array.isArray(events)) {
        eventsArray = events;
      } else if (events && Array.isArray(events.events)) {
        eventsArray = events.events;
      } else if (events && typeof events === 'object' && !Array.isArray(events) && !events.data) {
        eventsArray = [events];
      }

      console.log('Setting user events:', eventsArray);
      setUserEvents(eventsArray);
    } catch (error) {
      console.error('Error fetching user events:', error);
      setUserEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setMessage({ type: '', text: '' });
      const result = await updateUserProfile(profileData);
      if (result.success) {
        updateUser(result.data);
        setMessage({ type: 'success', text: t('profile.updateSuccess') });
        setEditMode(false);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || t('profile.updateError') });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: t('profile.passwordsDoNotMatch') });
      return;
    }

    try {
      setMessage({ type: '', text: '' });
      const result = await changePassword(passwordData);
      if (result.success) {
        setMessage({ type: 'success', text: t('profile.passwordUpdateSuccess') });
        setChangePasswordMode(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || t('profile.passwordUpdateError') });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a URL for the image to display in the cropper
    const imageUrl = URL.createObjectURL(file);
    setImageToEdit(imageUrl);
    setShowCropper(true);
  };

  const handleCropComplete = async (croppedFile) => {
    try {
      setUploadingImage(true);
      setMessage({ type: '', text: '' });
      setShowCropper(false);

      const imageData = await uploadImage(croppedFile, 'profile');

      if (imageData && imageData.url) {
        const updatedProfile = {
          ...profileData,
          profileImage: imageData.url
        };

        const result = await updateUserProfile(updatedProfile);

        if (result.success) {
          setProfileData(updatedProfile);
          updateUser({
            ...user,
            profileImage: imageData.url
          });
          setMessage({ type: 'success', text: t('profile.imageUploadSuccess') });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || t('profile.imageUploadError') });
    } finally {
      setUploadingImage(false);
      // Clean up the object URL to avoid memory leaks
      if (imageToEdit) {
        URL.revokeObjectURL(imageToEdit);
        setImageToEdit(null);
      }
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    if (imageToEdit) {
      URL.revokeObjectURL(imageToEdit);
      setImageToEdit(null);
    }
  };

  const cancelEdit = () => {
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      profileImage: user.profileImage || ''
    });
    setEditMode(false);
  };

  const cancelPasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setChangePasswordMode(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="text-center">
          <p>{t('profile.notLoggedIn')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20 min-h-screen text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">{t('profile.title')}</h1>

      {message.text && (
        <div className={cn(
          "p-4 mb-6 rounded-lg",
          message.type === 'success' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}>
          {message.text}
        </div>
      )}

      {showCropper && imageToEdit && (
        <ImageCropper
          image={imageToEdit}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-teal-500">
                  {profileData.profileImage ? (
                    <img
                      src={profileData.profileImage}
                      alt={profileData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-gray-400" />
                  )}
                </div>
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full cursor-pointer hover:bg-teal-700 transition-colors shadow-md"
                >
                  <Camera size={18} />
                  <input
                    type="file"
                    id="profile-image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>
              </div>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600 mt-1 capitalize">{t(`profile.role.${user.role}`)}</p>
            </div>

            {!editMode && !changePasswordMode && (
              <div className="space-y-3">
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors shadow-sm"
                >
                  <Edit size={18} />
                  <span>{t('profile.editProfile')}</span>
                </button>
                <button
                  onClick={() => setChangePasswordMode(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors shadow-sm"
                >
                  <Lock size={18} />
                  <span>{t('profile.changePassword')}</span>
                </button>
              </div>
            )}

            {editMode && (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    {t('profile.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    {t('profile.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded transition-colors shadow-sm"
                  >
                    <Check size={18} />
                    <span>{t('profile.save')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 flex items-center justify-center space-x-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors shadow-sm"
                  >
                    <X size={18} />
                    <span>{t('profile.cancel')}</span>
                  </button>
                </div>
              </form>
            )}

            {changePasswordMode && (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                    {t('profile.currentPassword')}
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                    {t('profile.newPassword')}
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                    {t('profile.confirmPassword')}
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    minLength={6}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded transition-colors shadow-sm"
                  >
                    <Check size={18} />
                    <span>{t('profile.save')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={cancelPasswordChange}
                    className="flex-1 flex items-center justify-center space-x-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors shadow-sm"
                  >
                    <X size={18} />
                    <span>{t('profile.cancel')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* User Events */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="flex items-center mb-6">
              <Calendar size={24} className="text-teal-600 mr-2" />
              <h2 className="text-xl font-bold">{t('profile.myEvents')}</h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : userEvents.length > 0 ? (
              <div className="space-y-6">
                {userEvents.map(event => (
                  <EventCard key={event._id || event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                <p className="mb-2">{t('profile.noEvents')}</p>
                <p className="text-sm text-gray-500">Register for events to see them listed here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
