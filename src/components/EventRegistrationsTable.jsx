import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, Mail, Phone, User } from 'lucide-react';
import { cn } from '../lib/utils';

const EventRegistrationsTable = ({ event, onUpdateStatus }) => {
  const { t } = useTranslation();
  const [expandedRow, setExpandedRow] = useState(null);

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

  if (!event || !event.registrations || event.registrations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">{t('admin.noRegistrations')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{t('admin.registrations')}</h3>
          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
            {event.registrations.length} {t('admin.total')}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.name')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.email')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.phone')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.status')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.registeredAt')}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {event.registrations.map((registration, index) => (
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
                      {console.log("t(`admin.status.${registration.status}`):", t(`admin.status.${registration.status}`))}
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
                            {registration.phoneNumber && (
                              <p><span className="font-medium">{t('admin.phone')}:</span> {registration.phoneNumber}</p>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold mb-1">{t('admin.additionalInfo')}</p>
                            <p><span className="font-medium">{t('admin.gear')}:</span> {registration.gear || '-'}</p>
                            <p><span className="font-medium">{t('admin.wantsFood')}:</span> {registration.wantsFood ? t('common.yes') : t('common.no')}</p>
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
    </div>
  );
};

export default EventRegistrationsTable;
