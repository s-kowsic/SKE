import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Logged in successfully');
      navigate('/products');
    } catch (error) {
      toast.error(`${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-industrial-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-industrial-700">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">{t('auth.login')}</h2>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">{t('auth.email')}</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">{t('auth.password')}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
        </div>
        <button type="submit" className="w-full btn-primary">{t('auth.loginBtn')}</button>
        <p className="mt-4 text-center text-gray-400 text-sm">
          {t('auth.noAccount')} <Link to="/register" className="text-industrial-orange hover:underline">{t('nav.register')}</Link>
        </p>
      </form>
    </div>
  );
}
