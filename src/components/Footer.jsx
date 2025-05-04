import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import logoImage from '../assets/logo.png';
import { cn } from '../lib/utils';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex flex-col items-start">
              <img src={logoImage} alt="Black Roses Logo" className="h-16 w-16 mb-4" />
              <h3 className="text-xl font-oswald mb-2 text-[#e0e0e0]">Black Roses</h3>
              <p className="text-gray-400 text-sm">
                An elite airsoft team based in the Belgium.
              </p>
            </div>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-lg font-oswald mb-4 text-[#e0e0e0]">Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
                  {t('navigation.home')}
                </Link>
              </li>
    

              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">
                  {t('navigation.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-lg font-oswald mb-4 text-[#e0e0e0]">{t('contact.locationTitle')}</h4>
            <p className="text-gray-400 mb-2">{t('contact.location')}</p>
            <p className="text-gray-400">info@blackroses.com</p>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-lg font-oswald mb-4 text-[#e0e0e0]">{t('footer.follow')}</h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-100 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Black Roses. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;