import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import logoImage from '../assets/logo.png';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-lg"
          style={{
            backgroundImage: "url('/src/assets/wallpaper.jpg')",
            filter: "brightness(0.4) blur(2px)",
            transform: "scale(1.1)" /* Prevents blur edges from showing */
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 z-10">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Logo on top */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <img
              src={logoImage}
              alt="Black Roses Logo"
              className="w-48 h-48 md:w-64 md:h-64"
            />
          </motion.div>

          {/* Text content below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-oswald mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {t('home.welcome')}
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              We are an elite airsoft team based in the Belgium. Our team focuses on tactical gameplay, teamwork, and sportsmanship.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <a
                href="#events"
                className={cn(
                  "inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark",
                  "text-white font-oswald rounded-md transition-colors duration-300"
                )}
              >
                {t('home.cta')}
                <ChevronRight size={20} className="ml-2" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

