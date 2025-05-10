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
      let eventsArray = [];

      if (events && events.data && events.data.events && Array.isArray(events.data.events)) {
        eventsArray = events.data.events;
      } else if (Array.isArray(events)) {
        eventsArray = events;
      } else if (events && Array.isArray(events.events)) {
        eventsArray = events.events;
      } else if (events && typeof events === 'object' && !Array.isArray(events) && !events.data) {
        eventsArray = [events];
      }

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
      <div className="container mx-auto px-4 py-8 mt-20 bg-gray-100 min-h-screen">
        <div className="text-center">
          <p>{t('profile.notLoggedIn')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      <div className="absolute inset-0 pointer-events-none select-none opacity-10 z-0" style={{backgroundImage: 'url(/src/assets/wallpaper.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
      <div className="relative container mx-auto px-4 py-12 mt-20 z-10">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight drop-shadow-sm">{t('profile.title')}</h1>
        {message.text && (
          <div className={cn(
            "p-4 mb-6 rounded-lg shadow border",
            message.type === 'success' ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-xl border-l-8 border-teal-500 flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-teal-500 shadow-lg">
                  {profileData.profileImage ? (
                    <img
                      src={profileData.profileImage}
                      alt={profileData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={72} className="text-gray-400" />
                  )}
                </div>
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-2 right-2 bg-teal-600 text-black p-2 rounded-full cursor-pointer hover:bg-teal-700 transition-colors shadow-md border-2 border-black"
                >
                  <Camera size={20} />
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
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
              <p className="text-gray-600 text-base">{user.email}</p>
              <p className="text-gray-500 mt-1 capitalize text-sm">{t(`profile.role.${user.role}`)}</p>
              {!editMode && !changePasswordMode && (
                <div className="space-y-3 mt-8 w-full">
                  <button
                    onClick={() => setEditMode(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-black py-2 px-4 rounded-lg transition-colors shadow font-semibold text-base"
                  >
                    <Edit size={20} />
                    <span>{t('profile.editProfile')}</span>
                  </button>
                  <button
                    onClick={() => setChangePasswordMode(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors shadow font-semibold text-base border border-gray-200"
                  >
                    <Lock size={20} />
                    <span>{t('profile.changePassword')}</span>
                  </button>
                </div>
              )}
              {editMode && (
                <form onSubmit={handleProfileUpdate} className="space-y-4 w-full mt-6">
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
                      className="flex-1 flex items-center justify-center space-x-1 bg-teal-600 hover:bg-teal-700 text-black py-2 px-4 rounded-lg transition-colors shadow font-semibold"
                    >
                      <Check size={18} />
                      <span>{t('profile.save')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 flex items-center justify-center space-x-1 bg-gray-500 hover:bg-gray-600 text-black py-2 px-4 rounded-lg transition-colors shadow font-semibold"
                    >
                      <X size={18} />
                      <span>{t('profile.cancel')}</span>
                    </button>
                  </div>
                </form>
              )}
              {changePasswordMode && (
                <form onSubmit={handlePasswordUpdate} className="space-y-4 w-full mt-6">
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
                      className="flex-1 flex items-center justify-center space-x-1 bg-teal-600 hover:bg-teal-700 text-black py-2 px-4 rounded-lg transition-colors shadow font-semibold"
                    >
                      <Check size={18} />
                      <span>{t('profile.save')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={cancelPasswordChange}
                      className="flex-1 flex items-center justify-center space-x-1 bg-gray-500 hover:bg-gray-600 text-black py-2 px-4 rounded-lg transition-colors shadow font-semibold"
                    >
                      <X size={18} />
                      <span>{t('profile.cancel')}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
              <div className="flex items-center mb-8">
                <Calendar size={28} className="text-teal-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">{t('profile.myEvents')}</h2>
              </div>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : userEvents.length > 0 ? (
                <div className="grid gap-6">
                  {userEvents.map(event => (
                    <ProfileEventCard key={event._id || event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-2">{t('profile.noEvents')}</p>
                  <p className="text-sm text-gray-400">Register for events to see them listed here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
