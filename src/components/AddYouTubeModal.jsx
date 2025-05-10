import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Youtube } from 'lucide-react';
import { cn } from '../lib/utils';

const AddYouTubeModal = ({ isOpen, onClose, onAddVideo }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    youtubeUrl: '',
    title: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewId, setPreviewId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // If URL field is being updated, try to extract video ID for preview
    if (name === 'youtubeUrl') {
      const videoId = getYouTubeVideoId(value);
      setPreviewId(videoId);
      if (!videoId && value) {
        setError(t('albums.invalidYouTubeUrl'));
      } else {
        setError(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!previewId) {
      setError(t('albums.invalidYouTubeUrl'));
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await onAddVideo(formData);
      onClose();
    } catch (err) {
      console.error('Error adding YouTube video:', err);
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{t('albums.addYouTubeVideo')}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="youtubeUrl" className="block text-gray-700 font-medium mb-1">
              {t('albums.youtubeUrl')} *
            </label>
            <div className="flex">
              <div className="flex items-center bg-gray-100 px-3 rounded-l-md border border-r-0 border-gray-300">
                <Youtube size={20} className="text-red-600" />
              </div>
              <input
                type="text"
                id="youtubeUrl"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                required
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
              {t('albums.videoTitle')}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Video Preview */}
          {previewId && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">{t('common.preview')}:</p>
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${previewId}`}
                  title="YouTube Video Preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || !previewId}
              className={cn(
                "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark",
                (loading || !previewId) && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? t('common.loading') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddYouTubeModal;
