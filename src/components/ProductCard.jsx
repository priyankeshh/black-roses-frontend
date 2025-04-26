import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react';
import { cn } from '../lib/utils';

const ProductCard = ({ product }) => {
  const { t } = useTranslation();

  return (
    <div className={cn(
      "bg-dark-100 rounded-lg overflow-hidden shadow-md",
      "transition-all duration-300 hover:shadow-lg"
    )}>
      <div className="h-56 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-oswald mb-1">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-oswald text-primary">€{product.price.toFixed(2)}</span>
          <button
            className={cn(
              "flex items-center px-3 py-2 bg-primary text-white rounded",
              "hover:bg-primary-dark transition-colors"
            )}
          >
            <ShoppingCart size={16} className="mr-1" />
            {t('shop.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;