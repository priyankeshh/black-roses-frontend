import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import logoImage from '../assets/logo.png';

const Header = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'nl' : 'en');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    if (mobileMenuOpen) {
      toggleMenu();
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed w-full z-50 bg-dark-300/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logoImage} alt="Black Roses Logo" className="h-12 w-12" />
          <span className="text-xl font-oswald">Black Roses</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={cn(
              "hover:text-primary transition-colors",
              isActive('/') && "text-primary"
            )}
          >
            {t('navigation.home')}
          </Link>
          <Link
            to="/events"
            className={cn(
              "hover:text-primary transition-colors",
              isActive('/events') && "text-primary"
            )}
          >
            {t('navigation.events')}
          </Link>

          <Link
            to="/contact"
            className={cn(
              "hover:text-primary transition-colors",
              isActive('/contact') && "text-primary"
            )}
          >
            {t('navigation.contact')}
          </Link>

          {/* Admin link - only shown to admin users */}
          {isAdmin() && (
            <Link
              to="/admin"
              className={cn(
                "hover:text-primary transition-colors",
                isActive('/admin') && "text-primary"
              )}
            >
              {t('navigation.admin')}
            </Link>
          )}

          {/* Authentication links */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:text-primary transition-colors"
            >
              <LogOut size={18} />
              <span>{t('navigation.logout')}</span>
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className={cn(
                  "flex items-center space-x-1 hover:text-primary transition-colors",
                  isActive('/login') && "text-primary"
                )}
              >
                <LogIn size={18} />
                <span>{t('navigation.login')}</span>
              </Link>
              <Link
                to="/register"
                className={cn(
                  "flex items-center space-x-1 hover:text-primary transition-colors",
                  isActive('/register') && "text-primary"
                )}
              >
                <UserPlus size={18} />
                <span>{t('navigation.register')}</span>
              </Link>
            </>
          )}

          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 hover:text-primary transition-colors"
          >
            <Globe size={18} />
            <span>{language.toUpperCase()}</span>
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-300/95">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className={cn(
                "py-2",
                isActive('/') && "text-primary"
              )}
              onClick={toggleMenu}
            >
              {t('navigation.home')}
            </Link>
            <Link
              to="/events"
              className={cn(
                "py-2",
                isActive('/events') && "text-primary"
              )}
              onClick={toggleMenu}
            >
              {t('navigation.events')}
            </Link>

            <Link
              to="/contact"
              className={cn(
                "py-2",
                isActive('/contact') && "text-primary"
              )}
              onClick={toggleMenu}
            >
              {t('navigation.contact')}
            </Link>

            {/* Admin link - only shown to admin users */}
            {isAdmin() && (
              <Link
                to="/admin"
                className={cn(
                  "py-2",
                  isActive('/admin') && "text-primary"
                )}
                onClick={toggleMenu}
              >
                {t('navigation.admin')}
              </Link>
            )}

            {/* Authentication links */}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 py-2 text-left"
              >
                <LogOut size={18} />
                <span>{t('navigation.logout')}</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className={cn(
                    "flex items-center space-x-1 py-2",
                    isActive('/login') && "text-primary"
                  )}
                  onClick={toggleMenu}
                >
                  <LogIn size={18} />
                  <span>{t('navigation.login')}</span>
                </Link>
                <Link
                  to="/register"
                  className={cn(
                    "flex items-center space-x-1 py-2",
                    isActive('/register') && "text-primary"
                  )}
                  onClick={toggleMenu}
                >
                  <UserPlus size={18} />
                  <span>{t('navigation.register')}</span>
                </Link>
              </>
            )}

            <button
              onClick={() => {
                toggleLanguage();
                toggleMenu();
              }}
              className="flex items-center space-x-1 py-2"
            >
              <Globe size={18} />
              <span>{t('navigation.language')}: {language.toUpperCase()}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;