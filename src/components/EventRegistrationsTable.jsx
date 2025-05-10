import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, Mail, Phone, User, Download, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../lib/utils';
import EventRegistrationStats from './EventRegistrationStats';
import EventRegistrationFilters from './EventRegistrationFilters';
import { exportRegistrationsToExcel } from '../utils/excelExport';

const EventRegistrationsTable = ({ event, onUpdateStatus }) => {
  const { t } = useTranslation();
  const [expandedRow, setExpandedRow] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    gear: 'all',
    wantsFood: null
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'registeredAt',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const toggleRow = (index) => {
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      setExpandedRow(index);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ?
      <ArrowUp size={14} className="ml-1" /> :
      <ArrowDown size={14} className="ml-1" />;
  };

  // Filter and sort registrations
  const filteredAndSortedRegistrations = useMemo(() => {
    if (!event || !event.registrations) return [];

    // First apply filters
    let result = [...event.registrations];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(reg =>
        reg.name.toLowerCase().includes(searchLower) ||
        reg.email.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter(reg => reg.status === filters.status);
    }

    // Gear filter
    if (filters.gear !== 'all') {
      result = result.filter(reg => reg.gear === filters.gear);
    }

    // Food filter
    if (filters.wantsFood !== null) {
      result = result.filter(reg => reg.wantsFood === filters.wantsFood);
    }

    // Then sort
    result.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle dates
      if (sortConfig.key === 'registeredAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle strings
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [event, filters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRegistrations.length / itemsPerPage);
  const paginatedRegistrations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedRegistrations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedRegistrations, currentPage]);

  const handleExportToExcel = () => {
    exportRegistrationsToExcel(event, t);
  };

  if (!event || !event.registrations || event.registrations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">{t('admin.noRegistrations')}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Statistics Panel */}
      <EventRegistrationStats registrations={event.registrations} />

      {/* Filters */}
      <EventRegistrationFilters filters={filters} setFilters={setFilters} />

      {/* Registrations Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-2 md:mb-0">
              <h3 className="text-lg font-semibold mr-3">{t('admin.registrations')}</h3>
              <span className="bg-primary text-black px-3 py-1 rounded-full text-sm">
                {filteredAndSortedRegistrations.length} / {event.registrations.length} {t('admin.total')}
              </span>
            </div>
            <button
              onClick={handleExportToExcel}
              className="flex items-center px-4 py-2 bg-green-600 text-black rounded hover:bg-green-700 transition-colors"
            >
              <Download size={16} className="mr-2" />
              {t('admin.exportToExcel')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    {t('admin.name')}
                    {getSortIcon('name')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">
                    {t('admin.email')}
                    {getSortIcon('email')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.phone')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    {t('admin.statusLabel')}
                    {getSortIcon('status')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('registeredAt')}
                >
                  <div className="flex items-center">
                    {t('admin.registeredAt')}
                    {getSortIcon('registeredAt')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRegistrations.map((registration, index) => (
                <React.Fragment key={registration._id || index}>
                  <tr
                    className={cn(
                      "hover:bg-gray-50 cursor-pointer",
                      expandedRow === index && "bg-gray-50"
                    )}
                    onClick={() => toggleRow(index)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User size={16} className="mr-2 text-gray-400" />
                        <div className="text-sm font-medium text-gray-900">{registration.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail size={16} className="mr-2 text-gray-400" />
                        <div className="text-sm text-gray-500">{registration.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Phone size={16} className="mr-2 text-gray-400" />
                        <div className="text-sm text-gray-500">{registration.phone || '-'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                        getStatusBadgeClass(registration.status)
                      )}>
                        {t(`admin.status.${registration.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(registration.registeredAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(event._id, registration._id, 'confirmed');
                        }}
                        className="text-green-600 hover:text-green-900 mr-3"
                        title={t('admin.confirm')}
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(event._id, registration._id, 'cancelled');
                        }}
                        className="text-red-600 hover:text-red-900"
                        title={t('admin.cancel')}
                      >
                        <X size={18} />
                      </button>
                    </td>
                  </tr>
                  {expandedRow === index && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-semibold mb-1">{t('admin.contactInfo')}</p>
                              <p><span className="font-medium">{t('admin.email')}:</span> {registration.email}</p>
                              <p><span className="font-medium">{t('admin.phone')}:</span> {registration.phone || '-'}</p>
                              <p><span className="font-medium">{t('admin.age')}:</span> {registration.age}</p>
                            </div>
                            <div>
                              <p className="font-semibold mb-1">{t('admin.additionalInfo')}</p>
                              <p><span className="font-medium">{t('admin.gear')}:</span> {registration.gear === 'own' ? t('eventSignup.ownGear') : t('eventSignup.rentalGear')}</p>
                              <p><span className="font-medium">{t('admin.wantsFood')}:</span> {registration.wantsFood ? t('common.yes') : t('common.no')}</p>
                              <p><span className="font-medium">{t('eventSignup.invitedBy')}:</span> {registration.invitedBy || '-'}</p>
                              <p><span className="font-medium">{t('admin.registeredAt')}:</span> {formatDate(registration.registeredAt)}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t('admin.previous')}
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t('admin.next')}
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  {t('admin.showing')} <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> {t('admin.to')}{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredAndSortedRegistrations.length)}
                  </span>{' '}
                  {t('admin.of')} <span className="font-medium">{filteredAndSortedRegistrations.length}</span> {t('admin.results')}
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">{t('admin.previous')}</span>
                    <ArrowLeft size={16} />
                  </button>

                  {/* Page numbers */}
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-primary border-primary text-black'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">{t('admin.next')}</span>
                    <ArrowRight size={16} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add missing ArrowLeft and ArrowRight components
const ArrowLeft = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const ArrowRight = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default EventRegistrationsTable;
