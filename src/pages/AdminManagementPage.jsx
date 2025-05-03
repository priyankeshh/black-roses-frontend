import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers, createAdminUser, updateUserRole, deleteUser } from '../lib/apiService';
import { UserPlus, Trash, Shield, ShieldOff, User } from 'lucide-react';

const AdminManagementPage = () => {
  const { t } = useTranslation();
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    // Redirect if not superAdmin
    if (user && !isSuperAdmin()) {
      navigate('/admin');
    }

    fetchUsers();
  }, [user, isSuperAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError('');
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(t('admin.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdminData({
      ...newAdminData,
      [name]: value
    });
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      setFormError('');
      setFormSuccess('');

      await createAdminUser(newAdminData);

      setFormSuccess(t('admin.userAdded'));
      setNewAdminData({
        name: '',
        email: '',
        password: ''
      });
      setShowAddForm(false);
      fetchUsers();
    } catch (error) {
      console.error('Error adding admin:', error);
      setFormError(error.message || t('admin.addError'));
    }
  };

  const handlePromoteUser = async (userId) => {
    try {
      await updateUserRole(userId, 'admin');
      fetchUsers();
    } catch (error) {
      console.error('Error promoting user:', error);
      setError(t('admin.updateError'));
    }
  };

  const handleDemoteAdmin = async (userId) => {
    try {
      await updateUserRole(userId, 'user');
      fetchUsers();
    } catch (error) {
      console.error('Error demoting admin:', error);
      if (error.message && error.message.includes('last admin')) {
        setError(t('admin.lastAdminError') || 'Cannot demote the last admin user. Promote another user to admin first.');
      } else {
        setError(t('admin.updateError'));
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm(t('admin.confirmDeleteUser'))) {
      try {
        await deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        setError(t('admin.deleteError'));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.manageUsers')}</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center"
        >
          <UserPlus size={18} className="mr-2" />
          {t('admin.addAdmin')}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p>{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            {t('common.retry')}
          </button>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{t('admin.addNewAdmin')}</h2>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 mb-4">
              <p>{formError}</p>
            </div>
          )}

          {formSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 mb-4">
              <p>{formSuccess}</p>
            </div>
          )}

          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newAdminData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={newAdminData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.password')}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={newAdminData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md transition-colors"
              >
                {t('common.save')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold">{t('admin.usersList')}</h2>
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
                  {t('admin.role')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User size={16} className="mr-2 text-gray-400" />
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'superAdmin'
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'admin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.role === 'user' && (
                      <button
                        onClick={() => handlePromoteUser(user._id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title={t('admin.promoteToAdmin')}
                      >
                        <Shield size={18} />
                      </button>
                    )}

                    {user.role === 'admin' && (
                      <button
                        onClick={() => handleDemoteAdmin(user._id)}
                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                        title={t('admin.demoteToUser')}
                      >
                        <ShieldOff size={18} />
                      </button>
                    )}

                    {user.role !== 'superAdmin' && (
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-900"
                        title={t('admin.deleteUser')}
                      >
                        <Trash size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManagementPage;
