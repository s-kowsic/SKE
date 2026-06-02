import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Loader2, Save } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setFormData({
          name: data.name || '',
          email: data.email || '',
          password: '',
          confirmPassword: ''
        });
      } catch (error) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setSaving(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        ...(formData.password && { password: formData.password })
      };
      
      const { data } = await api.put('/users/profile', updateData);
      
      toast.success('Profile updated successfully!');
      
      // Clear passwords from form
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-industrial-orange w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">{t('profile.title')}</h1>
      
      <div className="bg-industrial-800 rounded-2xl border border-industrial-700 p-6 md:p-10 shadow-xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-industrial-orange/5 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-industrial-700 relative z-10">
          <div className="w-20 h-20 bg-industrial-900 rounded-full flex items-center justify-center text-3xl font-bold text-industrial-orange border border-industrial-700">
            {formData.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{formData.name}</h2>
            <p className="text-gray-400 capitalize">{user?.role || 'Customer'} Account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400">{t('profile.fullName')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-industrial-900 border border-industrial-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-industrial-orange focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400">{t('profile.email')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-industrial-900 border border-industrial-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-industrial-orange focus:outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-industrial-700">
            <h3 className="text-lg font-bold text-white mb-4">{t('profile.changePassword')}</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400">{t('profile.newPassword')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-industrial-900 border border-industrial-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-industrial-orange focus:outline-none transition-colors"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400">{t('profile.confirmPassword')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-industrial-900 border border-industrial-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-industrial-orange focus:outline-none transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-3 px-8 rounded-xl flex items-center gap-2 text-lg font-bold"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {saving ? t('profile.saving') : t('profile.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
