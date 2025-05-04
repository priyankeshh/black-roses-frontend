import './i18n/i18n';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import EventSignupPage from './pages/EventSignupPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import { useTranslation } from 'react-i18next';

function App() {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    i18n.changeLanguage('en'); // Set the default language here
  }, [i18n]);

  return (
    <ErrorBoundary>
      <LanguageProvider i18n={i18n}>
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <ErrorBoundary>
                <Header />
              </ErrorBoundary>
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={
                    <ErrorBoundary>
                      <HomePage />
                    </ErrorBoundary>
                  } />
                  <Route path="/events/:eventId" element={
                    <ErrorBoundary>
                      <EventDetailPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/event-signup/:eventId" element={
                    <ErrorBoundary>
                      <EventSignupPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/contact" element={
                    <ErrorBoundary>
                      <ContactPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/login" element={
                    <ErrorBoundary>
                      <LoginPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/register" element={
                    <ErrorBoundary>
                      <RegisterPage />
                    </ErrorBoundary>
                  } />
                  <Route
                    path="/admin"
                    element={
                      <ErrorBoundary>
                        <ProtectedRoute requireAdmin={true}>
                          <AdminPage />
                        </ProtectedRoute>
                      </ErrorBoundary>
                    }
                  />
                  <Route path="*" element={
                    <ErrorBoundary>
                      <NotFoundPage />
                    </ErrorBoundary>
                  } />
                </Routes>
              </main>
              <ErrorBoundary>
                <Footer />
              </ErrorBoundary>
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;