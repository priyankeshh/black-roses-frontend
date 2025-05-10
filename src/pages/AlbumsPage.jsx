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
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('albums.title')}</h1>
        {isAdmin() && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            <Plus size={18} />
            <span>{t('albums.createAlbum')}</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : albums.length === 0 ? (
        <div className="bg-gray-100 text-gray-700 p-8 rounded-md text-center">
          <p className="text-xl">{t('albums.noAlbums')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Link
              key={album._id}
              to={`/albums/${album._id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-200 relative">
                {album.coverImage && album.coverImage.url ? (
                  <img
                    src={album.coverImage.url}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <Image size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{album.title}</h3>
                {album.description && (
                  <p className="text-gray-600 mb-3 line-clamp-2">{album.description}</p>
                )}
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1 text-gray-500" />
                    <span>{formatDate(album.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Image size={16} className="mr-1 text-blue-500" />
                    <span>{album.images ? album.images.length : 0} {album.images && album.images.length === 1 ? t('albums.image') : t('albums.images')}</span>
                  </div>
                  <div className="flex items-center">
                    <Film size={16} className="mr-1 text-red-500" />
                    <span>{album.videos ? album.videos.length : 0} {album.videos && album.videos.length === 1 ? t('albums.video') : t('albums.videos')}</span>
                  </div>
                  {album.event && (
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1 text-green-500" />
                      <span className="truncate max-w-[100px]">{album.event.title}</span>
                    </div>
                  )}
                  {album.createdBy && (
                    <div className="flex items-center">
                      <User size={16} className="mr-1 text-purple-500" />
                      <span className="truncate max-w-[100px]">{album.createdBy.name}</span>
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
  );
};

export default AlbumsPage;
