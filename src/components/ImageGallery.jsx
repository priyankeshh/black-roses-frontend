import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const ImageGallery = ({ images, initialIndex = 0, onClose }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent scrolling when gallery is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);

  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      handlePrevious(e);
    } else if (e.key === 'ArrowRight') {
      handleNext(e);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex flex-col items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          onClick={onClose}
        >
          <X size={32} />
        </button>

        {/* Image counter */}
        <div className="absolute top-4 left-4 text-white text-sm z-10">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Main image */}
        <div className="relative max-w-full max-h-full flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={currentImage.url}
            alt={currentImage.title || `Image ${currentIndex + 1}`}
            className={cn(
              "max-h-[85vh] max-w-full object-contain transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Navigation buttons */}
        <button
          className="absolute left-4 p-2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full"
          onClick={handlePrevious}
          aria-label={t('common.previous')}
        >
          <ChevronLeft size={32} />
        </button>

        <button
          className="absolute right-4 p-2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full"
          onClick={handleNext}
          aria-label={t('common.next')}
        >
          <ChevronRight size={32} />
        </button>

        {/* Image title/caption removed as requested */}
      </div>
    </div>
  );
};

export default ImageGallery;
