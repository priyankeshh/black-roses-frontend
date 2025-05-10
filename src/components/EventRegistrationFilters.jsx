import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, X } from 'lucide-react';

const EventRegistrationFilters = ({ filters, setFilters }) => {
  const { t } = useTranslation();

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e) => {
    setFilters({ ...filters, status: e.target.value });
  };

  const handleGearChange = (e) => {
    setFilters({ ...filters, gear: e.target.value });
  };

  const handleFoodChange = (e) => {
    setFilters({ ...filters, wantsFood: e.target.checked });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      gear: 'all',
      wantsFood: null
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <h3 className="text-lg font-semibold mb-2 md:mb-0">{t('admin.filterRegistrations')}</h3>
        <button
          onClick={clearFilters}
          className="flex items-center text-sm text-gray-600 hover:text-primary transition-colors"
        >
          <X size={16} className="mr-1" />
          {t('admin.clearFilters')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder={t('admin.searchNameEmail')}
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.statusLabel')}
          </label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={handleStatusChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="all">{t('admin.allStatuses')}</option>
            <option value="pending">{t('admin.status.pending')}</option>
            <option value="confirmed">{t('admin.status.confirmed')}</option>
            <option value="cancelled">{t('admin.status.cancelled')}</option>
          </select>
        </div>

        {/* Gear Filter */}
        <div>
          <label htmlFor="gear-filter" className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.gear')}
          </label>
          <select
            id="gear-filter"
            value={filters.gear}
            onChange={handleGearChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="all">{t('admin.allGearTypes')}</option>
            <option value="own">{t('eventSignup.ownGear')}</option>
            <option value="rental">{t('eventSignup.rentalGear')}</option>
          </select>
        </div>

        {/* Food Filter */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="food-filter"
            checked={filters.wantsFood === true}
            onChange={handleFoodChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="food-filter" className="ml-2 block text-sm text-gray-700">
            {t('admin.wantsFood')}
          </label>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationFilters;
