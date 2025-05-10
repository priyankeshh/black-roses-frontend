import * as XLSX from 'xlsx';

/**
 * Export event registrations to Excel
 * @param {Object} event - The event object containing registrations
 * @param {Function} t - Translation function
 * @returns {void}
 */
export const exportRegistrationsToExcel = (event, t) => {
  if (!event || !event.registrations || event.registrations.length === 0) {
    console.error('No registrations to export');
    return;
  }

  // Format registrations for Excel
  const formattedData = event.registrations.map((reg, index) => {
    return {
      [t('admin.index')]: index + 1,
      [t('admin.name')]: reg.name,
      [t('admin.email')]: reg.email,
      [t('admin.phone')]: reg.phone || '-',
      [t('admin.statusLabel')]: t(`admin.status.${reg.status}`),
      [t('admin.gear')]: reg.gear === 'own' ? t('eventSignup.ownGear') : t('eventSignup.rentalGear'),
      [t('admin.wantsFood')]: reg.wantsFood ? t('common.yes') : t('common.no'),
      [t('admin.invitedBy')]: reg.invitedBy || '-',
      [t('admin.registeredAt')]: new Date(reg.registeredAt).toLocaleString(),
      [t('admin.age')]: reg.age
    };
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Set column widths
  const columnWidths = [
    { wch: 5 },  // Index
    { wch: 20 }, // Name
    { wch: 25 }, // Email
    { wch: 15 }, // Phone
    { wch: 12 }, // Status
    { wch: 15 }, // Gear
    { wch: 10 }, // Food
    { wch: 20 }, // Invited By
    { wch: 20 }, // Registered At
    { wch: 5 },  // Age
  ];
  worksheet['!cols'] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, event.title.substring(0, 30));

  // Generate filename
  const fileName = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_registrations_${new Date().toISOString().split('T')[0]}.xlsx`;

  // Export to file
  XLSX.writeFile(workbook, fileName);
};
