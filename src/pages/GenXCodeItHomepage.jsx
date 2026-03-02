import React, { useState, useEffect } from 'react';
import { Menu, X, Code, Database, Cloud, Shield, Smartphone, Cpu, ChevronRight, Mail, Phone, MapPin, Linkedin, Twitter, Github } from 'lucide-react';

export default function GenXCodeItHomepage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Custom Software Development",
      description: "Tailored solutions built with cutting-edge technologies to transform your business vision into powerful, scalable applications."
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Solutions",
      description: "Seamless migration and optimization of your infrastructure with AWS, Azure, and Google Cloud for maximum efficiency and reliability."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android devices."
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Data Analytics & AI",
      description: "Harness the power of your data with advanced analytics, machine learning models, and AI-driven insights for smarter decisions."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Cybersecurity",
      description: "Comprehensive security solutions to protect your digital assets with penetration testing, threat monitoring, and compliance management."
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "IoT Solutions",
      description: "Connect and automate your devices with intelligent IoT ecosystems that drive operational efficiency and innovation."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        
        * {
          font-family: 'Space Mono', monospace;
        }
        
        h1, h2, h3, h4, h5, h6, .heading-font {
          font-family: 'Syne', sans-serif;
        }
        
        .gradient-orange {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff8c42 100%);
        }
        
        .gradient-orange-radial {
          background: radial-gradient(circle at 30% 50%, rgba(255, 107, 53, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 70% 50%, rgba(247, 147, 30, 0.1) 0%, transparent 50%);
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glow-orange {
          box-shadow: 0 0 30px rgba(255, 107, 53, 0.3), 0 0 60px rgba(247, 147, 30, 0.2);
        }
        
        .border-gradient {
          border-image: linear-gradient(135deg, #ff6b35, #f7931e) 1;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        .grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 107, 53, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 53, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        .service-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .service-card:hover {
          transform: translateY(-8px);
        }
        
        .nav-link {
          position: relative;
          transition: color 0.3s ease;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #ff6b35, #f7931e);
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/95 backdrop-blur-lg border-b border-orange-500/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-orange rounded-lg flex items-center justify-center glow-orange">
                <Code className="w-6 h-6 text-slate-950" />
              </div>
              <span className="text-2xl font-bold heading-font text-gradient">genXcodeit</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="nav-link text-slate-300 hover:text-orange-400">Home</a>
              <a href="#about" className="nav-link text-slate-300 hover:text-orange-400">About</a>
              <a href="#services" className="nav-link text-slate-300 hover:text-orange-400">Services</a>
              <a href="#contact" className="nav-link text-slate-300 hover:text-orange-400">Contact</a>
              <button className="gradient-orange px-6 py-2.5 rounded-lg text-slate-950 font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-orange-400 p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-6 space-y-4 border-t border-orange-500/20 mt-2 pt-6">
              <a href="#home" className="block text-slate-300 hover:text-orange-400 transition-colors">Home</a>
              <a href="#about" className="block text-slate-300 hover:text-orange-400 transition-colors">About</a>
              <a href="#services" className="block text-slate-300 hover:text-orange-400 transition-colors">Services</a>
              <a href="#contact" className="block text-slate-300 hover:text-orange-400 transition-colors">Contact</a>
              <button className="w-full gradient-orange px-6 py-2.5 rounded-lg text-slate-950 font-semibold">
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 grid-pattern opacity-30"></div>
        <div className="absolute inset-0 gradient-orange-radial"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-5 py-2 backdrop-blur-sm">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-orange-300 text-sm font-semibold tracking-wide">INNOVATING THE FUTURE</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold heading-font leading-tight">
              <span className="block text-slate-100">Building Digital</span>
              <span className="block text-gradient">Excellence</span>
            </h1>

            {/* Description */}
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed">
              We craft cutting-edge software solutions that empower businesses to thrive in the digital age. 
              From concept to deployment, we're your trusted technology partner.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="group gradient-orange px-8 py-4 rounded-lg text-slate-950 font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <span>Start Your Project</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-lg border-2 border-orange-500/50 text-orange-400 font-bold text-lg hover:bg-orange-500/10 transition-all duration-300 backdrop-blur-sm">
                View Our Work
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-16 max-w-4xl mx-auto">
              {[
                { number: "500+", label: "Projects Completed" },
                { number: "200+", label: "Happy Clients" },
                { number: "50+", label: "Team Members" },
                { number: "10+", label: "Years Experience" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-gradient heading-font">{stat.number}</div>
                  <div className="text-slate-400 text-sm mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-24 lg:py-32 bg-slate-900/50">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="text-orange-400 font-bold text-sm tracking-wider uppercase border-b-2 border-orange-500 pb-1">About Us</span>
              </div>
              
              <h2 className="text-4xl lg:text-6xl font-bold heading-font text-slate-100 leading-tight">
                Transforming Ideas Into 
                <span className="text-gradient"> Digital Reality</span>
              </h2>

              <p className="text-lg text-slate-400 leading-relaxed">
                Founded in 2014, genXcodeit has been at the forefront of digital innovation, helping businesses 
                navigate the complexities of modern technology. Our team of expert developers, designers, and 
                strategists work collaboratively to deliver solutions that drive real business results.
              </p>

              <p className="text-lg text-slate-400 leading-relaxed">
                We believe in the power of technology to transform businesses and improve lives. Our commitment 
                to excellence, innovation, and client success has made us a trusted partner for companies ranging 
                from startups to Fortune 500 enterprises.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center space-x-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-orange-300 font-semibold text-sm">Agile Methodology</span>
                </div>
                <div className="flex items-center space-x-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-orange-300 font-semibold text-sm">24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-orange-300 font-semibold text-sm">Quality Assured</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-orange-500/20 backdrop-blur-sm">
                <div className="space-y-6">
                  {[
                    { title: "Innovation First", desc: "Staying ahead with latest technologies" },
                    { title: "Client-Centric", desc: "Your success is our priority" },
                    { title: "Expert Team", desc: "Seasoned professionals with proven track records" },
                    { title: "Scalable Solutions", desc: "Built to grow with your business" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 group">
                      <div className="w-12 h-12 gradient-orange rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-orange-500/50 transition-all duration-300">
                        <ChevronRight className="w-6 h-6 text-slate-950" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-100 heading-font">{item.title}</h4>
                        <p className="text-slate-400 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 gradient-orange rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 gradient-orange rounded-full blur-2xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-24 lg:py-32">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-block mb-4">
              <span className="text-orange-400 font-bold text-sm tracking-wider uppercase border-b-2 border-orange-500 pb-1">Our Services</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold heading-font text-slate-100 leading-tight mb-6">
              Comprehensive Solutions For 
              <span className="text-gradient"> Every Need</span>
            </h2>
            <p className="text-lg text-slate-400">
              We offer a full spectrum of IT services designed to accelerate your digital transformation 
              and drive sustainable growth.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="service-card group bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-orange-500/20 hover:border-orange-500/50 backdrop-blur-sm relative overflow-hidden"
              >
                {/* Background Glow Effect */}
                <div className="absolute inset-0 gradient-orange opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-16 h-16 gradient-orange rounded-xl flex items-center justify-center mb-6 group-hover:shadow-xl group-hover:shadow-orange-500/50 transition-all duration-300">
                    <div className="text-slate-950">{service.icon}</div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-100 heading-font mb-4 group-hover:text-gradient transition-all duration-300">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Learn More Link */}
                  <a href="#" className="inline-flex items-center space-x-2 text-orange-400 font-semibold group-hover:space-x-3 transition-all duration-300">
                    <span>Learn More</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-bl-full"></div>
              </div>
            ))}
          </div>

          {/* CTA Below Services */}
          <div className="text-center mt-16">
            <button className="gradient-orange px-8 py-4 rounded-lg text-slate-950 font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105">
              Discuss Your Project
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative bg-slate-900/80 border-t border-orange-500/20 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-orange rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-slate-950" />
                </div>
                <span className="text-2xl font-bold heading-font text-gradient">genXcodeit</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Empowering businesses through innovative technology solutions and exceptional digital experiences.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center justify-center hover:bg-orange-500/20 transition-all duration-300">
                  <Linkedin className="w-5 h-5 text-orange-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center justify-center hover:bg-orange-500/20 transition-all duration-300">
                  <Twitter className="w-5 h-5 text-orange-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center justify-center hover:bg-orange-500/20 transition-all duration-300">
                  <Github className="w-5 h-5 text-orange-400" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-orange-400 font-bold text-lg mb-6 heading-font">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#home" className="text-slate-400 hover:text-orange-400 transition-colors">Home</a></li>
                <li><a href="#about" className="text-slate-400 hover:text-orange-400 transition-colors">About Us</a></li>
                <li><a href="#services" className="text-slate-400 hover:text-orange-400 transition-colors">Services</a></li>
                <li><a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">Portfolio</a></li>
                <li><a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">Careers</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-orange-400 font-bold text-lg mb-6 heading-font">Services</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">Software Development</a></li>
                <li><a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">Cloud Solutions</a></li>
                <li><a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">Mobile Apps</a></li>
                <li><a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">Data Analytics</a></li>
                <li><a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">Cybersecurity</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-orange-400 font-bold text-lg mb-6 heading-font">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                  <span className="text-slate-400">123 Tech Boulevard, Silicon Valley, CA 94025</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <span className="text-slate-400">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <span className="text-slate-400">hello@genxcodeit.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-orange-500/20">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-slate-500 text-sm">
                © 2024 genXcodeit. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-slate-500 hover:text-orange-400 transition-colors">Privacy Policy</a>
                <a href="#" className="text-slate-500 hover:text-orange-400 transition-colors">Terms of Service</a>
                <a href="#" className="text-slate-500 hover:text-orange-400 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}