import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Trash2, 
  Upload, 
  Youtube, 
  Calendar, 
  User, 
  Clock,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { 
  getAlbumById, 
  uploadAlbumImages, 
  deleteAlbumImage, 
  addYouTubeVideo, 
  deleteAlbumVideo,
  updateAlbum,
  deleteAlbum
} from '../lib/apiService';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import LoadingSpinner from '../components/LoadingSpinner';
import AddYouTubeModal from '../components/AddYouTubeModal';

const AlbumDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('images');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const data = await getAlbumById(id);
        setAlbum(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching album:', err);
        setError(t('albums.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id, t]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploadLoading(true);
    try {
      await uploadAlbumImages(id, selectedFiles);
      // Refresh album data
      const updatedAlbum = await getAlbumById(id);
      setAlbum(updatedAlbum);
      setSelectedFiles([]);
      setSuccessMessage(t('albums.imageAdded'));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error uploading images:', err);
      setError(err.message || t('common.error'));
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm(t('albums.deleteImageConfirm'))) return;
    
    try {
      await deleteAlbumImage(id, imageId);
      // Refresh album data
      const updatedAlbum = await getAlbumById(id);
      setAlbum(updatedAlbum);
      setSuccessMessage(t('albums.imageDeleted'));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError(err.message || t('common.error'));
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm(t('albums.deleteVideoConfirm'))) return;
    
    try {
      await deleteAlbumVideo(id, videoId);
      // Refresh album data
      const updatedAlbum = await getAlbumById(id);
      setAlbum(updatedAlbum);
      setSuccessMessage(t('albums.videoDeleted'));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting video:', err);
      setError(err.message || t('common.error'));
    }
  };

  const handleAddVideo = async (videoData) => {
    try {
      await addYouTubeVideo(id, videoData);
      // Refresh album data
      const updatedAlbum = await getAlbumById(id);
      setAlbum(updatedAlbum);
      setSuccessMessage(t('albums.videoAdded'));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error adding video:', err);
      setError(err.message || t('common.error'));
    }
  };

  const handleSetCoverImage = async (imageUrl, imagePublicId) => {
    try {
      await updateAlbum(id, {
        coverImage: {
          url: imageUrl,
          publicId: imagePublicId
        }
      });
      // Refresh album data
      const updatedAlbum = await getAlbumById(id);
      setAlbum(updatedAlbum);
      setSuccessMessage(t('albums.coverImageUpdated'));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error setting cover image:', err);
      setError(err.message || t('common.error'));
    }
  };

  const handleDeleteAlbum = async () => {
    if (!window.confirm(t('albums.deleteAlbumConfirm'))) return;
    
    try {
      await deleteAlbum(id);
      navigate('/albums');
    } catch (err) {
      console.error('Error deleting album:', err);
      setError(err.message || t('common.error'));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20 flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="bg-gray-100 text-gray-700 p-8 rounded-md text-center">
          <p className="text-xl">{t('albums.notFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <Link to="/albums" className="flex items-center text-gray-600 hover:text-primary mb-2">
            <ArrowLeft size={18} className="mr-1" />
            {t('albums.back')}
          </Link>
          <h1 className="text-3xl font-bold">{album.title}</h1>
        </div>
        
        {isAdmin() && (
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={handleDeleteAlbum}
              className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <Trash2 size={16} />
              <span>{t('albums.deleteAlbum')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Album Info */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {album.description && (
              <p className="text-gray-700 mb-4">{album.description}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{t('albums.createdAt')}: {formatDate(album.createdAt)}</span>
              </div>
              {album.event && (
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{t('albums.event')}: {album.event.title}</span>
                </div>
              )}
              {album.createdBy && (
                <div className="flex items-center">
                  <User size={16} className="mr-1" />
                  <span>{t('albums.createdBy')}: {album.createdBy.name}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col md:items-end">
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center">
                <ImageIcon size={16} className="mr-1 text-blue-500" />
                <span>{album.images ? album.images.length : 0} {t('albums.images')}</span>
              </div>
              <div className="flex items-center">
                <Youtube size={16} className="mr-1 text-red-500" />
                <span>{album.videos ? album.videos.length : 0} {t('albums.videos')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={cn(
            "px-4 py-2 font-medium",
            activeTab === 'images'
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setActiveTab('images')}
        >
          {t('albums.images')}
        </button>
        <button
          className={cn(
            "px-4 py-2 font-medium",
            activeTab === 'videos'
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setActiveTab('videos')}
        >
          {t('albums.videos')}
        </button>
      </div>

      {/* Images Tab */}
      {activeTab === 'images' && (
        <div>
          {/* Upload Area (Admin Only) */}
          {isAdmin() && (
            <div className="mb-6">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center",
                  dragActive ? "border-primary bg-primary/5" : "border-gray-300",
                  uploadLoading && "opacity-50 pointer-events-none"
                )}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <p className="text-gray-600 mb-2">{t('albums.dragDropImages')}</p>
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                  >
                    {t('albums.uploadImages')}
                  </label>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-600">
                      {selectedFiles.length} {t('albums.images')} {t('common.selected')}
                    </p>
                    <button
                      onClick={handleUpload}
                      disabled={uploadLoading}
                      className={cn(
                        "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark",
                        uploadLoading && "opacity-70 cursor-not-allowed"
                      )}
                    >
                      {uploadLoading ? t('albums.uploadingImages') : t('common.upload')}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative h-20 bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Images Gallery */}
          {album.images && album.images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {album.images.map((image) => (
                <div key={image._id} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.title || album.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isAdmin() && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleSetCoverImage(image.url, image.publicId)}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                        title={t('albums.selectCoverImage')}
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteImage(image._id)}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                        title={t('common.delete')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  {album.coverImage && album.coverImage.publicId === image.publicId && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-md">
                      {t('albums.coverImage')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 text-gray-600 p-8 rounded-md text-center">
              <p>{t('albums.noMedia')}</p>
            </div>
          )}
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div>
          {/* Add YouTube Video Button (Admin Only) */}
          {isAdmin() && (
            <div className="mb-6">
              <button
                onClick={() => setIsYouTubeModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Youtube size={18} />
                <span>{t('albums.addYouTubeVideo')}</span>
              </button>
            </div>
          )}

          {/* Videos Gallery */}
          {album.videos && album.videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {album.videos.map((video) => {
                const videoId = getYouTubeVideoId(video.youtubeUrl);
                if (!videoId) return null;
                
                return (
                  <div key={video._id} className="relative group">
                    <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={video.title || album.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    {video.title && (
                      <p className="mt-2 text-gray-700">{video.title}</p>
                    )}
                    {isAdmin() && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDeleteVideo(video._id)}
                          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                          title={t('common.delete')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-100 text-gray-600 p-8 rounded-md text-center">
              <p>{t('albums.noMedia')}</p>
            </div>
          )}
        </div>
      )}

      {/* YouTube Modal */}
      {isYouTubeModalOpen && (
        <AddYouTubeModal
          isOpen={isYouTubeModalOpen}
          onClose={() => setIsYouTubeModalOpen(false)}
          onAddVideo={handleAddVideo}
        />
      )}
    </div>
  );
};

export default AlbumDetailPage;
