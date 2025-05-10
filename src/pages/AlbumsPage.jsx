import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Plus, Image, Film, Calendar, User, Clock } from 'lucide-react';
import { getAlbums } from '../lib/apiService';
import { useAuth } from '../context/AuthContext';
import CreateAlbumModal from '../components/CreateAlbumModal';
import LoadingSpinner from '../components/LoadingSpinner';

const AlbumsPage = () => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const data = await getAlbums();
        setAlbums(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching albums:', err);
        setError(t('albums.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [t]);

  const handleAlbumCreated = (newAlbum) => {
    setAlbums([newAlbum, ...albums]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-100">
      <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{t('albums.title')}</h1>
        {isAdmin() && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2 rounded-lg shadow hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Plus size={20} />
            <span className="font-medium">{t('albums.createAlbum')}</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-lg text-center shadow">
          {error}
        </div>
      ) : albums.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-gray-50 text-gray-500 p-12 rounded-lg text-center shadow">
          <Image size={48} className="mb-4 text-gray-300" />
          <p className="text-xl font-semibold">{t('albums.noAlbums')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album) => (
            <Link
              key={album._id}
              to={`/albums/${album._id}`}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative w-full">
                {album.coverImage && album.coverImage.url ? (
                  <img
                    src={album.coverImage.url}
                    alt={album.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <Image size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{album.title}</h3>
                {album.description && (
                  <p className="text-gray-600 mb-3 text-sm line-clamp-2">{album.description}</p>
                )}
                <div className="flex flex-wrap gap-3 text-xs text-gray-600 mt-auto border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-gray-400" />
                    <span>{formatDate(album.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image size={14} className="text-blue-400" />
                    <span>{album.images ? album.images.length : 0} {album.images && album.images.length === 1 ? t('albums.image') : t('albums.images')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Film size={14} className="text-red-400" />
                    <span>{album.videos ? album.videos.length : 0} {album.videos && album.videos.length === 1 ? t('albums.video') : t('albums.videos')}</span>
                  </div>
                  {album.event && (
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-green-400" />
                      <span className="truncate max-w-[80px]">{album.event.title}</span>
                    </div>
                  )}
                  {album.createdBy && (
                    <div className="flex items-center gap-1">
                      <User size={14} className="text-purple-400" />
                      <span className="truncate max-w-[80px]">{album.createdBy.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateAlbumModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onAlbumCreated={handleAlbumCreated}
        />
      )}
      </div>
    </div>
  );
};

export default AlbumsPage;
