import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Search, ShieldCheck, Truck, Clock, Award, ChevronRight, Settings, Users, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Reusable animated counter component
function AnimatedCounter({ value, title }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="text-center p-6 bg-industrial-800 rounded-lg border border-industrial-700">
      <h3 className="text-4xl md:text-5xl font-bold text-industrial-orange mb-2">
        {isInView ? (
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {value}
          </motion.span>
        ) : "0"}
      </h3>
      <p className="text-gray-400 text-base font-medium">{title}</p>
    </div>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { t } = useLanguage();

  const [leadForm, setLeadForm] = useState({ name: '', phone: '' });
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products');
        setFeatured(data.slice(0, 4));
      } catch (error) {
        console.error(error);
      }
    };
    fetchFeatured();
  }, []);

  // Handle click outside for search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      setIsSearching(true);
      setShowDropdown(true);
      try {
        const { data } = await api.post('/ai/search', { query });
        setSearchResults(data);
      } catch (error) {
        console.error("AI Search error:", error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Thank you! Our team will contact you shortly with the best price.");
    setLeadForm({ name: '', phone: '' });
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center pt-20 pb-12 md:pt-24 md:pb-16 lg:pt-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-fixed"></div>
        <div className="absolute inset-0 bg-industrial-900/75"></div>

        <div className="container mx-auto px-6 lg:px-12 xl:px-20 relative z-10 mt-12 md:mt-0">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden" animate="visible" variants={fadeIn}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-industrial-800/80 border border-industrial-700 text-industrial-orange text-sm font-bold mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-industrial-orange animate-pulse"></span>
                {t('hero.title') || 'PREMIUM INDUSTRIAL MANUFACTURING'}
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-white tracking-tight leading-tight">
                {t('hero.subtitle') ? t('hero.subtitle').split('.')[0] : 'High Quality Components'} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-industrial-orange to-orange-400">
                  {t('hero.subtitle') ? t('hero.subtitle').split('.')[1] : 'Manufacturer'}
                </span>
              </h1>
              <p className="text-base sm:text-xl text-gray-300 mb-6 md:mb-8 max-w-lg leading-relaxed">
                {t('hero.subtitle') || 'Precision machined parts, flanges & connectors you can trust. Built for durability, delivered with speed.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group">
                  {t('hero.cta')} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact" className="btn-secondary text-lg px-8 py-4 bg-industrial-800/50 backdrop-blur-sm">
                  {t('hero.ctaSecondary')}
                </Link>
              </div>
            </motion.div>

            {/* Right Content - Lead Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block justify-self-end w-full max-w-md"
            >
              <div className="glass-panel rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-industrial-orange/20 blur-[50px]"></div>
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Get the Best Price</h3>
                <p className="text-gray-400 mb-6 relative z-10">Leave your details and our experts will call you back within 15 minutes.</p>

                <form onSubmit={handleLeadSubmit} className="space-y-4 relative z-10">
                  <div>
                    <input
                      type="text" placeholder="Your Name"
                      className="input-field bg-industrial-900/50 border-industrial-700/50"
                      value={leadForm.name} onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <input
                      type="tel" placeholder="Phone Number"
                      className="input-field bg-industrial-900/50 border-industrial-700/50"
                      value={leadForm.phone} onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary py-3">Get Best Price</button>
                </form>

                <div className="mt-6 pt-6 border-t border-industrial-700/50 text-center relative z-10">
                  <p className="text-sm text-gray-400 mb-3">Or connect instantly</p>
                  <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '6369174670'}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/20 transition-colors font-bold">
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="bg-industrial-800 border-y border-industrial-700 relative z-20 shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 md:gap-6">
            {[
              { icon: <ShieldCheck className="text-industrial-orange" />, text: "Verified Quality" },
              { icon: <Truck className="text-industrial-orange" />, text: "Fast Global Delivery" },
              { icon: <Settings className="text-industrial-orange" />, text: "Custom Manufacturing" },
              { icon: <Award className="text-industrial-orange" />, text: "Lowest Pricing Guarantee" },
              { icon: <Clock className="text-industrial-orange" />, text: "24/7 AI Support" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 font-semibold text-gray-300">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. AI SMART SEARCH */}
      <section className="py-16 bg-industrial-900 relative">
        <div className="container mx-auto px-4 max-w-4xl relative z-30" ref={searchRef}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Find Exactly What You Need</h2>
            <p className="text-gray-400">Describe the part, material, or dimensions. Our AI will find the perfect match.</p>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-5 bg-industrial-800 border-2 border-industrial-700 rounded-xl text-lg text-white placeholder-gray-500 focus:outline-none focus:border-industrial-orange shadow-lg transition-colors"
              placeholder={t('hero.search') || "e.g., '12 inch stainless steel flange for high pressure'..."}
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => { if (searchQuery.length > 2) setShowDropdown(true); }}
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-industrial-orange"></div>
              </div>
            )}

            {/* Dropdown Results */}
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="absolute mt-2 w-full bg-industrial-800 border border-industrial-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto"
              >
                {searchResults.length > 0 ? (
                  <div className="p-2">
                    <p className="px-3 py-2 text-xs font-bold text-industrial-orange uppercase tracking-wider">AI Matches</p>
                    {searchResults.map((product) => (
                      <div key={product._id} className="flex items-center gap-4 p-3 hover:bg-industrial-700 rounded-lg cursor-pointer transition-colors" onClick={() => navigate(`/products`)}>
                        <div className="w-12 h-12 bg-industrial-900 rounded overflow-hidden flex-shrink-0">
                          {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">No img</div>}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-sm">{product.name}</h4>
                          <p className="text-xs text-gray-400">{product.type} • {product.size}</p>
                        </div>
                        <div className="font-bold text-industrial-orange">₹{product.price?.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                ) : !isSearching && searchQuery.length > 2 ? (
                  <div className="p-8 text-center text-gray-400">
                    <p>No direct matches found. Try modifying your search or <Link to="/contact" className="text-industrial-orange hover:underline">contact us</Link> for custom manufacturing.</p>
                  </div>
                ) : null}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 4. TOP CATEGORIES */}
      <section className="py-20 bg-industrial-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Top Categories</h2>
            <div className="w-24 h-1 bg-industrial-orange mx-auto rounded-full mb-4"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">Explore our wide range of industrial components, manufactured to exact specifications.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Industrial Flanges", img: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=800&q=80" },
              { title: "Pipe Connectors", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80" },
              { title: "Machined Blocks", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" },
              { title: "Custom Parts", img: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80" }
            ].map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => navigate('/products')}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex justify-between items-end">
                  <h3 className="text-xl font-bold text-white group-hover:text-industrial-orange transition-colors">{cat.title}</h3>
                  <div className="w-10 h-10 rounded-full bg-industrial-orange/90 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <ChevronRight className="text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS */}
      <section className="py-20 bg-industrial-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="mb-4 md:mb-0">
              <h2 className="text-4xl font-bold mb-4">{t('home.featured')}</h2>
              <div className="w-24 h-1 bg-industrial-orange rounded-full mb-4"></div>
              <p className="text-gray-400">{t('home.featuredSub')}</p>
            </div>
            <Link to="/products" className="group flex items-center text-industrial-orange font-bold hover:text-orange-400 transition-colors">
              {t('home.viewAll')} <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
            {featured.length === 0 && (
              <div className="col-span-full p-12 text-center text-gray-500 bg-industrial-800 rounded-xl border border-industrial-700">
                Loading featured products...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="py-20 bg-industrial-800">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Why Industry Leaders <span className="text-industrial-orange">Choose Us</span></h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Sri Krishna Engineering brings over a decade of expertise in precision manufacturing. We don't just supply parts; we provide engineered solutions that keep your assembly lines moving efficiently and safely.
              </p>

              <div className="space-y-6">
                {[
                  { icon: <Settings size={28} />, title: "Precision Engineering", desc: "Tolerance levels strictly monitored." },
                  { icon: <ShieldCheck size={28} />, title: "Durable Materials", desc: "High-grade steel and alloys used." },
                  { icon: <Users size={28} />, title: "Experienced Team", desc: "Expert engineers and machinists." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-industrial-700/50 border border-transparent hover:border-industrial-700 transition-colors">
                    <div className="w-14 h-14 rounded-lg bg-industrial-900 border border-industrial-700 flex items-center justify-center text-industrial-orange flex-shrink-0 shadow-lg">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="relative h-[350px] sm:h-[450px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-industrial-700"
            >
              <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Factory" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-industrial-900/40 mix-blend-multiply"></div>

              {/* Floating badge */}
              <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 glass-panel p-4 md:p-6 rounded-xl flex items-center gap-3 md:gap-4 animate-bounce-slow">
                <div className="w-16 h-16 rounded-full bg-industrial-orange flex items-center justify-center">
                  <Award size={32} className="text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-400 font-bold uppercase tracking-wider">Certified</div>
                  <div className="text-xl font-bold text-white">ISO 9001:2015</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. STATS / ACHIEVEMENTS */}
      <section className="py-20 bg-industrial-900 border-y border-industrial-700 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#EA580C 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatedCounter value="10+" title="Years Experience" />
            <AnimatedCounter value="500+" title="Global Clients" />
            <AnimatedCounter value="1,000+" title="Products Manufactured" />
            <AnimatedCounter value="24/7" title="Dedicated Support" />
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-20 bg-industrial-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
            <div className="w-24 h-1 bg-industrial-orange mx-auto rounded-full mb-4"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Rahul S.", company: "TechBuild Infra", quote: "The flanges we ordered were perfectly machined. Very satisfied with the quick delivery and AI chatbot support." },
              { name: "Michael T.", company: "HeavyMach Corp", quote: "Sri Krishna Engineering is our go-to for custom parts. Their team understands complex schematics effortlessly." },
              { name: "Priya M.", company: "Global Piping Solutions", quote: "Lowest prices without compromising quality. The B2B ordering platform they've built is incredibly smooth." }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-industrial-900 p-8 rounded-2xl border border-industrial-700 relative"
              >
                <div className="flex gap-1 text-industrial-orange mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="text-gray-300 italic mb-8 leading-relaxed">"{review.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-industrial-800 rounded-full flex items-center justify-center font-bold border border-industrial-700 text-industrial-orange">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{review.name}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{review.company}</p>
                  </div>
                </div>
                {/* Quote watermark */}
                <div className="absolute top-4 right-6 text-6xl text-industrial-800 font-serif opacity-50">"</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. BLOG / INSIGHTS PREVIEW */}
      <section className="py-20 bg-industrial-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Industry Insights</h2>
              <div className="w-24 h-1 bg-industrial-orange rounded-full mb-4"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group cursor-pointer bg-industrial-800 rounded-xl overflow-hidden border border-industrial-700 hover:border-industrial-orange/50 transition-colors">
              <div className="h-64 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" alt="Steel" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-industrial-orange text-white text-xs font-bold px-3 py-1 rounded uppercase">Market Trends</div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-industrial-orange transition-colors">Global Steel Price Trends & Impact on Manufacturing</h3>
                <p className="text-gray-400 mb-6 line-clamp-2">An analysis of raw material costs in Q3 and how modern machining facilities are adapting to provide cost-effective solutions.</p>
                <div className="text-sm text-gray-500 font-medium">May 24, 2026 • 5 min read</div>
              </div>
            </div>

            <div className="group cursor-pointer bg-industrial-800 rounded-xl overflow-hidden border border-industrial-700 hover:border-industrial-orange/50 transition-colors">
              <div className="h-64 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80" alt="Flanges" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-industrial-orange text-white text-xs font-bold px-3 py-1 rounded uppercase">Technical Guide</div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-industrial-orange transition-colors">How to Choose the Right Industrial Flange</h3>
                <p className="text-gray-400 mb-6 line-clamp-2">Slip-on, weld neck, or blind? A comprehensive guide to understanding flange types and their specific high-pressure applications.</p>
                <div className="text-sm text-gray-500 font-medium">May 18, 2026 • 8 min read</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-industrial-orange"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092334651-ddf7d0a293dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] mix-blend-multiply opacity-20 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Looking for Custom Manufacturing?</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Send us your CAD drawings or technical requirements. Our engineering team provides quotes within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-industrial-900 text-white hover:bg-industrial-800 text-lg font-bold py-4 px-10 rounded shadow-2xl transition-all hover:-translate-y-1">
              Request a Quote
            </Link>
            <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '6369174670'}`} target="_blank" rel="noopener noreferrer" className="bg-white text-industrial-900 hover:bg-gray-100 text-lg font-bold py-4 px-10 rounded shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
