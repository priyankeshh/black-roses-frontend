import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './en';
import nlTranslation from './nl';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      nl: {
        translation: nlTranslation
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;