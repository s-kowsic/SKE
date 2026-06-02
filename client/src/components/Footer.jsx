import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-industrial-900 pt-16 pb-8 border-t border-industrial-700 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-industrial-orange/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="text-2xl font-bold text-industrial-orange tracking-wider inline-block mb-6">
              SRI KRISHNA <span className="text-white">ENG.</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-industrial-800 border border-industrial-700 flex items-center justify-center text-gray-400 hover:bg-industrial-orange hover:text-white hover:border-industrial-orange transition-all duration-300">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-industrial-800 border border-industrial-700 flex items-center justify-center text-gray-400 hover:bg-industrial-orange hover:text-white hover:border-industrial-orange transition-all duration-300">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4a10.8 10.8 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 22 4z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-industrial-800 border border-industrial-700 flex items-center justify-center text-gray-400 hover:bg-industrial-orange hover:text-white hover:border-industrial-orange transition-all duration-300">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-industrial-800 border border-industrial-700 flex items-center justify-center text-gray-400 hover:bg-industrial-orange hover:text-white hover:border-industrial-orange transition-all duration-300">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-industrial-orange transition-colors flex items-center group"><ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" /> {t('nav.home')}</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-industrial-orange transition-colors flex items-center group"><ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" /> {t('footer.aboutUs')}</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-industrial-orange transition-colors flex items-center group"><ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" /> {t('footer.contactSupport')}</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-industrial-orange transition-colors flex items-center group"><ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" /> {t('footer.myAccount')}</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-industrial-orange transition-colors flex items-center group"><ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" /> {t('footer.faq')}</a></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">{t('footer.topCategories')}</h3>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-gray-400 hover:text-industrial-orange transition-colors flex items-center group"><ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" /> {t('footer.industrialFlanges')}</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-industrial-orange transition-colors flex items-center group"><ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" /> {t('footer.pipeConnectors')}</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-industrial-orange transition-colors flex items-center group"><ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" /> {t('footer.machinedBlocks')}</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-industrial-orange transition-colors flex items-center group"><ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" /> {t('footer.fastenersBolts')}</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-industrial-orange transition-colors flex items-center group"><ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" /> {t('footer.customParts')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">{t('footer.contactUs')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-industrial-orange mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">123 Industrial Park, Block 4<br />Bangalore, KA 560001, India</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-industrial-orange mr-3 flex-shrink-0" />
                <span className="text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-industrial-orange mr-3 flex-shrink-0" />
                <span className="text-gray-400">sales@srikrishnaeng.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-industrial-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">{t('footer.privacyPolicy')}</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">{t('footer.termsOfService')}</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">{t('footer.shippingInfo')}</a>
          </div>
        </div>
      </div>
      
    </footer>
  );
}
