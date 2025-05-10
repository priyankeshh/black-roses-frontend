import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, CheckCircle, Clock, X, Utensils, Wrench, User } from 'lucide-react';

const EventRegistrationStats = ({ registrations }) => {
  const { t } = useTranslation();

  // Calculate statistics
  const totalRegistrations = registrations.length;

  // Status breakdown
  const statusCounts = {
    pending: registrations.filter(reg => reg.status === 'pending').length,
    confirmed: registrations.filter(reg => reg.status === 'confirmed').length,
    cancelled: registrations.filter(reg => reg.status === 'cancelled').length
  };

  // Gear type breakdown
  const gearCounts = {
    own: registrations.filter(reg => reg.gear === 'own').length,
    rental: registrations.filter(reg => reg.gear === 'rental').length
  };

  // Food preference
  const foodCount = registrations.filter(reg => reg.wantsFood).length;

  // Top invited by sources (get top 3)
  const invitedByCounts = {};
  registrations.forEach(reg => {
    if (reg.invitedBy && reg.invitedBy.trim()) {
      const source = reg.invitedBy.trim();
      invitedByCounts[source] = (invitedByCounts[source] || 0) + 1;
    }
  });

  // Convert to array, sort by count, and take top 3
  const topInvitedBy = Object.entries(invitedByCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">{t('admin.registrationStats')}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registrations */}
        <div className="bg-gray-50 rounded-lg p-4 flex items-center">
          <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-3">
            <Users className="text-primary" size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('admin.total')}</p>
            <p className="text-xl font-bold text-gray-800">{totalRegistrations}</p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-2">{t('admin.statusBreakdown')}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock size={16} className="text-yellow-500 mr-2" />
                <span className="text-sm text-gray-700">{t('admin.status.pending')}</span>
              </div>
              <span className="font-semibold text-gray-800">{statusCounts.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CheckCircle size={16} className="text-green-500 mr-2" />
                <span className="text-sm text-gray-700">{t('admin.status.confirmed')}</span>
              </div>
              <span className="font-semibold text-gray-800">{statusCounts.confirmed}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <X size={16} className="text-red-500 mr-2" />
                <span className="text-sm text-gray-700">{t('admin.status.cancelled')}</span>
              </div>
              <span className="font-semibold text-gray-800">{statusCounts.cancelled}</span>
            </div>
          </div>
        </div>

        {/* Gear & Food */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-2">{t('admin.preferences')}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Wrench size={16} className="text-blue-500 mr-2" />
                <span className="text-sm text-gray-700">{t('eventSignup.ownGear')}</span>
              </div>
              <span className="font-semibold text-gray-800">{gearCounts.own}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Wrench size={16} className="text-purple-500 mr-2" />
                <span className="text-sm text-gray-700">{t('eventSignup.rentalGear')}</span>
              </div>
              <span className="font-semibold text-gray-800">{gearCounts.rental}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Utensils size={16} className="text-orange-500 mr-2" />
                <span className="text-sm text-gray-700">{t('admin.wantsFood')}</span>
              </div>
              <span className="font-semibold text-gray-800">{foodCount}</span>
            </div>
          </div>
        </div>

        {/* Top Invited By */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-2">{t('admin.topInvitedBy')}</p>
          {topInvitedBy.length > 0 ? (
            <div className="space-y-2">
              {topInvitedBy.map(([source, count], index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <User size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700 truncate max-w-[150px]">{source}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">{t('admin.noInvitedByData')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationStats;
