import { useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Target, Lightbulb, Settings, ShieldCheck, Truck, Users, PenTool, CheckCircle, Package } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Reusable animated counter component
const AnimatedCounter = ({ value, title }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center p-6 bg-industrial-800 rounded-xl border border-industrial-700 shadow-xl"
    >
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">{value}</div>
      <div className="text-sm uppercase tracking-wider text-industrial-orange font-bold">{title}</div>
    </motion.div>
  );
};

export default function About() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-industrial-900 pt-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-32 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-fixed opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-industrial-900 via-industrial-900/90 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-block px-4 py-1 rounded-full bg-industrial-orange/20 border border-industrial-orange text-industrial-orange font-bold text-sm mb-6">
              {t('about.title')}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t('about.subtitle') || 'Engineering the Future of Industry'}
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Delivering precision-engineered industrial components with unmatched quality, reliability, and innovation since 2012.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-primary py-3 px-8 text-lg font-bold">{t('contact.title') || 'Request a Quote'}</Link>
              <Link to="/products" className="bg-industrial-800 hover:bg-industrial-700 text-white border border-industrial-600 py-3 px-8 rounded font-bold transition-colors text-lg">{t('nav.products') || 'View Products'}</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. COMPANY OVERVIEW & 3. MISSION / VISION */}
      <section className="py-20 border-b border-industrial-700">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">A Decade of Manufacturing Excellence</h2>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                Sri Krishna Engineering is a premier manufacturer of high-quality industrial components, specializing in heavy-duty flanges, precision connectors, and custom machined parts. 
              </p>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Operating out of our state-of-the-art facility in Kuniyamuthur, we combine decades of metallurgical expertise with modern CNC technology to serve the oil & gas, automotive, and heavy machinery sectors globally.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mt-10">
                <div className="bg-industrial-800 p-6 rounded-xl border-l-4 border-industrial-orange">
                  <Target className="text-industrial-orange mb-3" size={32} />
                  <h3 className="text-xl font-bold text-white mb-2">Our Mission</h3>
                  <p className="text-gray-400 text-sm">To deliver high-quality industrial components with precision and reliability that empower our clients' success.</p>
                </div>
                <div className="bg-industrial-800 p-6 rounded-xl border-l-4 border-white">
                  <Lightbulb className="text-white mb-3" size={32} />
                  <h3 className="text-xl font-bold text-white mb-2">Our Vision</h3>
                  <p className="text-gray-400 text-sm">To become the world's most trusted manufacturing partner, setting the benchmark for industrial standards.</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative h-[600px]">
              <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80" alt="Factory Interior" className="w-full h-full object-cover rounded-2xl shadow-2xl border border-industrial-700" />
              <div className="absolute inset-0 bg-industrial-orange/10 rounded-2xl mix-blend-overlay"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-20 bg-industrial-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Partner With Us</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">We don't just supply parts; we engineer solutions that keep your assembly lines moving efficiently.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Settings size={32} />, title: "Precision Manufacturing", desc: "Tolerance levels strictly monitored utilizing advanced CNC and VMC machines." },
              { icon: <ShieldCheck size={32} />, title: "Quality Assurance", desc: "Rigorous multi-stage testing ensures every component meets international ISO standards." },
              { icon: <PenTool size={32} />, title: "Custom Solutions", desc: "We manufacture highly specialized parts based on your unique CAD blueprints." },
              { icon: <Truck size={32} />, title: "Fast Delivery", desc: "Optimized logistics network guaranteeing on-time delivery across the globe." },
              { icon: <Users size={32} />, title: "Experienced Team", desc: "Our workforce consists of veteran engineers and certified metallurgical experts." },
              { icon: <Package size={32} />, title: "Bulk Capacity", desc: "Scalable production lines capable of handling massive B2B wholesale orders effortlessly." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-industrial-900 p-8 rounded-xl border border-industrial-700 hover:border-industrial-orange transition-colors group"
              >
                <div className="w-14 h-14 bg-industrial-800 rounded-lg flex items-center justify-center text-industrial-orange mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. STATS */}
      <section className="py-16 border-y border-industrial-700 bg-industrial-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#EA580C 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatedCounter value="10+" title="Years Experience" />
            <AnimatedCounter value="500+" title="B2B Clients" />
            <AnimatedCounter value="1M+" title="Parts Delivered" />
            <AnimatedCounter value="24/7" title="Technical Support" />
          </div>
        </div>
      </section>

      {/* 6. OUR PROCESS */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Manufacturing Process</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">From blueprint to final delivery, our streamlined workflow ensures zero defects.</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-start gap-8 md:gap-4 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-industrial-800 -z-10"></div>
            
            {[
              { step: "01", title: "Requirement Analysis", icon: <PenTool /> },
              { step: "02", title: "Design & Planning", icon: <Settings /> },
              { step: "03", title: "Manufacturing", icon: <Settings /> },
              { step: "04", title: "Quality Check", icon: <ShieldCheck /> },
              { step: "05", title: "Global Delivery", icon: <Truck /> }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center w-full md:w-1/5 relative"
              >
                <div className="w-24 h-24 bg-industrial-900 border-2 border-industrial-orange rounded-full flex flex-col items-center justify-center mb-6 shadow-xl relative z-10">
                  <span className="text-gray-500 text-xs font-bold mb-1">STEP</span>
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-industrial-orange/10"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Looking for a Reliable Manufacturing Partner?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Let's discuss how Sri Krishna Engineering can optimize your supply chain with premium quality components.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact" className="btn-primary py-4 px-10 text-lg font-bold">Request a Custom Quote</Link>
              <a href="tel:+919876543210" className="bg-industrial-800 text-white hover:bg-industrial-700 py-4 px-10 rounded text-lg font-bold transition-colors border border-industrial-600">Call Us Now</a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
