import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import { MapPin, Phone, Mail, Clock, MessageCircle, ChevronDown, Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requirement: '',
    quantity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // AI Smart Suggestion logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.requirement.length > 10) {
        fetchSuggestions(formData.requirement);
      } else {
        setSuggestions([]);
      }
    }, 1000); // 1s debounce
    return () => clearTimeout(timer);
  }, [formData.requirement]);

  const fetchSuggestions = async (text) => {
    try {
      setIsSuggesting(true);
      const { data } = await api.post('/ai/suggest-products', { requirement: text });
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Failed to get suggestions", error);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      requirement: prev.requirement + ` (Interested in: ${suggestion})`
    }));
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.requirement) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/contact', formData);
      toast.success(data.message || 'Enquiry submitted successfully!');
      setFormData({ name: '', email: '', phone: '', requirement: '', quantity: '' });
      setSuggestions([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    { q: "Do you provide custom manufacturing?", a: "Yes, we specialize in custom manufacturing based on CAD blueprints and specific client requirements. Please attach your designs when requesting a quote." },
    { q: "What is your standard delivery time?", a: "Standard catalog items are shipped within 48 hours. Custom orders typically take 2-4 weeks depending on the complexity and volume." },
    { q: "Do you accept bulk/wholesale orders?", a: "Absolutely. Our facility is equipped for high-volume B2B manufacturing, and we offer scaled pricing for bulk orders." },
    { q: "Do you ship internationally?", a: "Yes, we have a robust global logistics network and ship to over 50 countries worldwide." }
  ];

  return (
    <div className="min-h-screen bg-industrial-900 pt-20">
      
      {/* 1. HERO SECTION */}
      <section className="bg-industrial-800 border-b border-industrial-700 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-industrial-orange/5 blur-[100px] rounded-full"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
          >
            {t('contact.title') || 'Contact Us'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Whether you need a custom quote, technical support, or bulk order pricing, our team of experts is ready to assist you.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* 2. CONTACT FORM (MAIN SECTION) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-industrial-800 p-8 md:p-10 rounded-2xl border border-industrial-700 shadow-2xl relative"
            >
              <h2 className="text-3xl font-bold text-white mb-2">Request a Quote</h2>
              <p className="text-gray-400 mb-8">Fill out the details below. Our AI assistant will help categorize your request for faster processing.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">{t('contact.name') || 'Full Name'} *</label>
                    <input 
                      type="text" required
                      className="input-field" placeholder="John Doe"
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">{t('contact.email') || 'Email Address'} *</label>
                    <input 
                      type="email" required
                      className="input-field" placeholder="john@company.com"
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">{t('contact.phone') || 'Phone Number'}</label>
                    <input 
                      type="tel" 
                      className="input-field" placeholder="+1 (555) 000-0000"
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Estimated Quantity</label>
                    <input 
                      type="number" min="1"
                      className="input-field" placeholder="e.g. 500"
                      value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Product Requirement *</label>
                  <textarea 
                    required rows="4"
                    className="input-field resize-none" 
                    placeholder="Describe the part, material, size, and application..."
                    value={formData.requirement} onChange={e => setFormData({...formData, requirement: e.target.value})}
                  ></textarea>
                  
                  {/* AI Smart Assistant Overlay */}
                  <AnimatePresence>
                    {(isSuggesting || suggestions.length > 0) && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mt-3 p-4 bg-industrial-900 border border-industrial-700 rounded-lg flex items-start gap-3"
                      >
                        <Sparkles className="text-industrial-orange mt-1 flex-shrink-0" size={18} />
                        <div className="flex-1">
                          <span className="text-sm text-gray-400 block mb-2">
                            {isSuggesting ? "AI is analyzing your request..." : "Did you mean to include one of these products?"}
                          </span>
                          {!isSuggesting && suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {suggestions.map((sug, i) => (
                                <button 
                                  key={i} type="button"
                                  onClick={() => handleSuggestionClick(sug)}
                                  className="text-xs bg-industrial-800 hover:bg-industrial-orange border border-industrial-700 hover:border-industrial-orange text-gray-300 hover:text-white px-3 py-1.5 rounded transition-colors"
                                >
                                  + Add "{sug}"
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full btn-primary py-4 text-lg font-bold flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <><Loader2 className="animate-spin" size={20}/> Submitting...</> : (t('contact.send') || "Submit Enquiry")}
                </button>
              </form>
            </motion.div>

            {/* 3. CONTACT INFO & 5. QUICK OPTIONS */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="flex flex-col gap-8"
            >
              <div className="bg-industrial-800 p-8 rounded-2xl border border-industrial-700 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-industrial-900 rounded-full flex items-center justify-center text-industrial-orange flex-shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Headquarters</h4>
                      <p className="text-gray-400">Sri Krishna Engineering<br/>Kuniyamuthur, Coimbatore<br/>Tamil Nadu, India</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-industrial-900 rounded-full flex items-center justify-center text-industrial-orange flex-shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Direct Line</h4>
                      <p className="text-gray-400">+91 98765 43210</p>
                      <p className="text-gray-400">+91 98765 43211</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-industrial-900 rounded-full flex items-center justify-center text-industrial-orange flex-shrink-0">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Email Address</h4>
                      <p className="text-gray-400">sales@srikrishnaeng.com</p>
                      <p className="text-gray-400">support@srikrishnaeng.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-industrial-900 rounded-full flex items-center justify-center text-industrial-orange flex-shrink-0">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Working Hours</h4>
                      <p className="text-gray-400">Manufacturing: 24/7</p>
                      <p className="text-gray-400">Sales Desk: Mon-Sat, 9AM-6PM</p>
                    </div>
                  </div>
                </div>

                {/* Quick Options */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-industrial-700">
                  <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 py-3 rounded-lg font-bold transition-colors">
                    <MessageCircle size={20}/> WhatsApp
                  </a>
                  <a href="tel:+919876543210" className="flex items-center justify-center gap-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 py-3 rounded-lg font-bold transition-colors">
                    <Phone size={20}/> Call Now
                  </a>
                </div>
              </div>

              {/* 4. GOOGLE MAP EMBED */}
              <div className="h-64 rounded-2xl overflow-hidden border border-industrial-700 shadow-xl bg-industrial-800">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.924040941199!2d76.9497!3d10.9575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85b0000000001%3A0x0!2sKuniyamuthur%2C%20Coimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Location Map"
                ></iframe>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-20 bg-industrial-800 border-y border-industrial-700">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400">Everything you need to know before placing an order.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-industrial-900 border border-industrial-700 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-industrial-800/50 transition-colors"
                >
                  <span className="font-bold text-lg text-white">{faq.q}</span>
                  <ChevronDown className={`text-industrial-orange transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-gray-400 leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-6">Need Urgent Support?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Our emergency response team is available 24/7 to handle critical manufacturing breakdowns.</p>
          <a href="tel:+919876543210" className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white py-4 px-10 rounded text-xl font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            <Phone size={24} /> Emergency Call
          </a>
        </div>
      </section>

    </div>
  );
}
