import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-16 bg-gray-100 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">{t('notFound.title')}</h2>
        <p className="text-lg text-gray-600 mb-8">{t('notFound.message')}</p>
        <Link
          to="/"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-black font-semibold py-3 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          {t('notFound.backHome')}
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
