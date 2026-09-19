import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import {
  ArrowUpRight, ArrowRight, Check, ChevronDown, ChevronUp, Lock, Send,
  ShieldCheck, Sparkles, Building2, Phone, Mail, Award, Factory, Download,
  Users, Clock, BadgePercent, X
} from 'lucide-react';
import { useGetCurrentUser } from '@workspace/api-client-react';
import { PublicFooter } from '@/components/public/PublicFooter';

const FACTORY_ALL_PRODUCTS = [
  { name: 'T-Shirts & Tops', cap: 'Plastisol / Waterbase' },
  { name: 'Hoodies & Fleece', cap: 'High-Density / Puff' },
  { name: 'Sportswear Jerseys', cap: 'All-over Sublimation' },
  { name: 'Polo Shirts', cap: 'Chest Embroidery' },
  { name: 'Rubber Patches', cap: '3D Silicone Badges' },
  { name: 'Woven Labels', cap: 'Heat Transfer Neck Tags' },
  { name: 'Sonic Weld Jackets', cap: 'Seamless Outerwear' },
  { name: 'Structured Caps', cap: 'Sonic Welded Patches' },
  { name: 'Reflective Wear', cap: 'Safety Workwear' },
  { name: 'Varsity Jackets', cap: 'Chenille Applique' },
  { name: 'Zipper Pullers', cap: 'Custom Moulded TPU' },
  { name: 'Drawcords & Trims', cap: 'Silicone Dipped Ends' },
];

const DEMO_CLIENT_LOGOS = [
  {
    id: 'twins-tc',
    name: 'Twins TC',
    render: () => (
      <div className="w-28 h-24 sm:w-36 sm:h-28 shrink-0 bg-[#071d38] rounded-md border border-white/15 flex items-center justify-center p-2 shadow-md hover:scale-105 transition-all">
        <svg viewBox="0 0 100 90" className="h-14 sm:h-16 w-auto drop-shadow">
          <text x="50" y="65" textAnchor="middle" fill="#d3202a" stroke="#ffffff" strokeWidth="2.5" fontWeight="900" fontSize="54" fontFamily="serif">TC</text>
        </svg>
      </div>
    ),
  },
  {
    id: 'minnesota-m',
    name: 'Minnesota M',
    render: () => (
      <div className="w-28 h-24 sm:w-36 sm:h-28 shrink-0 bg-[#071d38] rounded-md border border-white/15 flex items-center justify-center p-2 shadow-md hover:scale-105 transition-all">
        <svg viewBox="0 0 100 90" className="h-14 sm:h-16 w-auto drop-shadow">
          <text x="50" y="68" textAnchor="middle" fill="#d3202a" stroke="#ffffff" strokeWidth="3" fontWeight="900" fontSize="62" fontFamily="serif">M</text>
        </svg>
      </div>
    ),
  },
  {
    id: 'cap-streetwear',
    name: 'CAP Brand',
    render: () => (
      <div className="w-28 h-24 sm:w-36 sm:h-28 shrink-0 bg-white rounded-md border border-black/10 flex items-center justify-center gap-1 p-2 shadow-md hover:scale-105 transition-all">
        <svg viewBox="0 0 40 30" className="h-7 w-auto">
          <path d="M5 20 C5 10, 20 8, 30 14 C35 16, 38 18, 38 20 Z" fill="#0088cc" />
          <path d="M5 20 C15 22, 28 22, 38 20" stroke="#005588" strokeWidth="2" fill="none" />
          <circle cx="20" cy="11" r="2" fill="#005588" />
        </svg>
        <span className="font-black text-2xl tracking-tighter text-[#0b3866] font-sans">cap</span>
      </div>
    ),
  },
  {
    id: 'culture-cbd',
    name: 'Culture CBD',
    render: () => (
      <div className="w-28 h-24 sm:w-36 sm:h-28 shrink-0 bg-white rounded-md border border-black/10 flex flex-col items-center justify-center p-2 shadow-md hover:scale-105 transition-all">
        <svg viewBox="0 0 30 16" className="h-4 w-auto mb-0.5">
          <path d="M3 13 C3 7, 15 5, 23 9 C26 10, 28 11, 28 13 Z" fill="#222" />
        </svg>
        <span className="font-black text-xs sm:text-sm tracking-tight text-black uppercase leading-none font-sans">CULTURE</span>
        <span className="font-black text-sm sm:text-base tracking-widest text-black uppercase leading-none font-sans">CBD</span>
      </div>
    ),
  },
  {
    id: 'ny-yankees',
    name: 'NY Yankees',
    render: () => (
      <div className="w-28 h-24 sm:w-36 sm:h-28 shrink-0 bg-white rounded-md border border-black/10 flex items-center justify-center p-2 shadow-md hover:scale-105 transition-all">
        <svg viewBox="0 0 80 80" className="h-14 sm:h-16 w-auto">
          <text x="50" y="62" textAnchor="middle" fill="#0c2340" fontWeight="900" fontSize="56" fontFamily="serif">NY</text>
        </svg>
      </div>
    ),
  },
  {
    id: 'ny-classic',
    name: 'NY Classic',
    render: () => (
      <div className="w-28 h-24 sm:w-36 sm:h-28 shrink-0 bg-[#f4f6f8] rounded-md border border-black/10 flex items-center justify-center p-2 shadow-md hover:scale-105 transition-all">
        <svg viewBox="0 0 80 80" className="h-14 sm:h-16 w-auto">
          <text x="50" y="62" textAnchor="middle" fill="#0c2340" fontWeight="900" fontSize="54" fontFamily="serif">NY</text>
        </svg>
      </div>
    ),
  },
  {
    id: 'la-athletics',
    name: 'LA Athletics',
    render: () => (
      <div className="w-28 h-24 sm:w-36 sm:h-28 shrink-0 bg-white rounded-md border border-black/10 flex items-center justify-center p-2 shadow-md hover:scale-105 transition-all">
        <svg viewBox="0 0 80 80" className="h-14 sm:h-16 w-auto">
          <text x="50" y="62" textAnchor="middle" fill="#005a9c" fontWeight="900" fontSize="56" fontFamily="sans-serif">LA</text>
        </svg>
      </div>
    ),
  },
  {
    id: 'apex-athletics',
    name: 'Apex Athletics',
    render: () => (
      <div className="w-28 h-24 sm:w-36 sm:h-28 shrink-0 bg-[#0d1e34] rounded-md border border-white/15 flex flex-col items-center justify-center p-2 shadow-md hover:scale-105 transition-all">
        <span className="font-black text-base sm:text-lg tracking-wider text-white font-sans leading-none">APEX</span>
        <span className="text-[8px] font-mono tracking-widest text-[#df3b28] font-bold uppercase mt-1">ATHLETICS</span>
      </div>
    ),
  },
  {
    id: 'vortex-teamwear',
    name: 'Vortex Teamwear',
    render: () => (
      <div className="w-28 h-24 sm:w-36 sm:h-28 shrink-0 bg-white rounded-md border border-black/10 flex flex-col items-center justify-center p-2 shadow-md hover:scale-105 transition-all">
        <span className="font-black text-base sm:text-lg tracking-widest text-[#111827] italic font-sans leading-none">VORTEX</span>
        <span className="text-[7px] font-mono tracking-widest text-emerald-600 font-bold uppercase mt-1">TEAMWEAR</span>
      </div>
    ),
  },
  {
    id: 'champion-league',
    name: 'Champion League',
    render: () => (
      <div className="w-28 h-24 sm:w-36 sm:h-28 shrink-0 bg-[#0c1829] rounded-md border border-white/15 flex items-center justify-center p-2 shadow-md hover:scale-105 transition-all">
        <svg viewBox="0 0 100 80" className="h-12 sm:h-14 w-auto">
          <path d="M20 20 L50 10 L80 20 L80 50 C80 65 50 75 50 75 C50 75 20 65 20 50 Z" fill="none" stroke="#ffffff" strokeWidth="4" />
          <text x="50" y="52" textAnchor="middle" fill="#df3b28" fontWeight="900" fontSize="32" fontFamily="sans-serif">C</text>
        </svg>
      </div>
    ),
  },
  {
    id: 'north-54',
    name: 'North 54 Outerwear',
    render: () => (
      <div className="w-28 h-24 sm:w-36 sm:h-28 shrink-0 bg-white rounded-md border border-black/10 flex flex-col items-center justify-center p-2 shadow-md hover:scale-105 transition-all">
        <span className="font-black text-xs sm:text-sm tracking-wider text-black font-sans leading-none">NORTH 54</span>
        <span className="text-[7px] font-mono tracking-widest text-[#0e2a1d]/60 uppercase mt-1">OUTERWEAR</span>
      </div>
    ),
  },
  {
    id: 'bulldogs-varsity',
    name: 'Bulldogs Varsity',
    render: () => (
      <div className="w-28 h-24 sm:w-36 sm:h-28 shrink-0 bg-[#071d38] rounded-md border border-white/15 flex flex-col items-center justify-center p-2 shadow-md hover:scale-105 transition-all">
        <span className="font-black text-lg sm:text-xl tracking-tight text-white font-serif leading-none">B</span>
        <span className="text-[7px] font-mono tracking-widest text-[#df3b28] uppercase font-bold mt-1">VARSITY</span>
      </div>
    ),
  },
];

export function LandingPage() {
  const { data: user } = useGetCurrentUser();
  const [activeStep, setActiveStep] = useState<number>(3);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // ── Gallery State & Items (From Factory Website Showcase) ──────────────────
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'print' | 'patch' | 'weld'>('all');
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<{
    id: string;
    title: string;
    badge: string;
    category: string;
    image: string;
    specs: string;
    desc: string;
  } | null>(null);

  const galleryItems = [
    {
      id: 'screen-printing',
      title: 'Screen Printing',
      badge: 'High-Volume Print',
      category: 'print',
      image: '/images/gallery/gallery_screen_printing.png',
      specs: 'Plastisol, Waterbase, Rubber & Discharge // Up to 12 Colors',
      desc: 'Automatic and manual oval carousels engineered for precision micro-registration on t-shirts, polo shirts, and export knitwear.'
    },
    {
      id: 'sonic-nxp-patch',
      title: 'Rabar Patch, Sonic & NXP',
      badge: '3D Embossed Patch',
      category: 'patch',
      image: '/images/gallery/gallery_sonic_patch.png',
      specs: 'Multi-Color PVC & Soft Silicone // Heat-Bonded / Stitch Channel',
      desc: 'High-relief 3D character and brand insignias with multi-layer colored rubber. Wash-proof bonding engineered for streetwear and kids outerwear.'
    },
    {
      id: 'sublimation',
      title: 'Sublimation',
      badge: 'Continuous Roll Print',
      category: 'print',
      image: '/images/gallery/gallery_sublimation.png',
      specs: 'Full CMYK Digital // Zero Hand-Feel // Anti-Fade Gamut',
      desc: 'Industrial wide-format roll-to-roll dye sublimation printing for polyester jerseys, cycling wear, activewear, and custom flags.'
    },
    {
      id: 'sonic-weld',
      title: 'Sonic Weld',
      badge: 'Headwear & Caps',
      category: 'weld',
      image: '/images/gallery/gallery_sonic_weld_cap.png',
      specs: 'Ultrasonic High-Frequency // 5 & 6-Panel Structured Caps',
      desc: 'Specialized ultrasonic high-frequency welding of raised logos and graphics onto structured caps, snapbacks, and technical headwear without needle punctures.'
    },
    {
      id: 'nxp-weld',
      title: 'Nxp Weld',
      badge: 'Heat Transfer Line',
      category: 'weld',
      image: '/images/gallery/gallery_nxp_weld_floor.png',
      specs: 'Continuous Roll Calendar // High-Pressure Thermo-Bonding',
      desc: 'Continuous calendared heat transfer welding division operated by certified technicians for large-scale garment embellishment and roll fusing.'
    },
    {
      id: 'rubber-patch',
      title: 'Rubber Patch',
      badge: 'Tactile Brand Badges',
      category: 'patch',
      image: '/images/gallery/gallery_rubber_patch.png',
      specs: 'Embossed & Debossed // Heat-Seal & Velcro Backing',
      desc: 'Industrial rubber badges, zipper pulls, and garment labels for outdoor jackets, denim apparel, tactical wear, and luggage accessories.'
    },
    {
      id: 'silicone-patch',
      title: 'Silicone Patch',
      badge: 'Premium 3D Silicone',
      category: 'patch',
      image: '/images/gallery/gallery_silicone_patch.png',
      specs: 'Eco-Friendly Silicone // Razor-Sharp 3D Edges // Wash & Heat Resistant',
      desc: 'Luxury high-density silicone patches with micro-matte finish and velvety touch. Completely odorless, stretchable, and resistant to extreme wash cycles.'
    },
    {
      id: 'silicone-weld',
      title: 'Silicone Weld',
      badge: 'Direct Garment 3D',
      category: 'weld',
      image: '/images/gallery/gallery_silicone_weld.png',
      specs: 'Direct-to-Fabric Welding // Seamless 3D Relief // Stretchable',
      desc: 'Direct high-frequency silicone welding applied onto cut panels or assembled garments for high-end activewear logos and chest branding.'
    },
  ];

  const filteredGallery = galleryFilter === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === galleryFilter);


  // ── Backside Factory Photo Slider ──────────────────────────────────────────
  const slides = [
    {
      image: '/images/factory_slide_1.jpg',
      title: 'Automatic Screen Printing Floor',
      dept: 'Screen Printing Division',
    },
    {
      image: '/images/factory_slide_2.jpg',
      title: 'Roll-to-Roll Dye Sublimation',
      dept: 'Sublimation & Heat Transfer',
    },
    {
      image: '/images/factory_slide_3.jpg',
      title: 'Computerized Embroidery & QC',
      dept: 'Embroidery & Finishing Line',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Changes automatically every 6 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  // ── Quote Inquiry Form ─────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    capability: '',
    quantity: '',
    details: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setIsSubmitted(true);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0e2a1d] text-white selection:bg-[#df3b28] selection:text-white font-sans antialiased">
      {/* ── 1. TOP CONTACT STRIP (From Factory Website) ──────────────────────── */}
      <div className="bg-[#bee7d2] text-[#0e2a1d] py-2 px-6 md:px-10 border-b border-[#0e2a1d]/15 text-xs">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-xs bg-[#df3b28] text-white font-black text-sm">
              ZM
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-[#0e2a1d]">
                ZM Printing & Design Ltd.
              </span>
              <span className="hidden sm:inline text-[11px] text-[#0e2a1d]/75 ml-2 font-medium">
                One Stop Solution of all kind garments printing & accessories
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-emerald-800" />
              <span>Dept:</span>
              <a href="tel:+8801818724417" className="font-bold hover:text-[#df3b28]">+88 01818724417</a>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-emerald-800" />
              <span>Dept:</span>
              <a href="tel:+8801322881470" className="font-bold hover:text-[#df3b28]">+88 01322881470</a>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="h-3 w-3 text-emerald-800" />
              <a href="mailto:zmprinting02@gmail.com" className="font-bold hover:text-[#df3b28]">zmprinting02@gmail.com</a>
            </div>
            <div className="hidden lg:flex items-center gap-1.5">
              <Mail className="h-3 w-3 text-emerald-800" />
              <a href="mailto:info@zmprintingbd.com" className="font-bold hover:text-[#df3b28]">info@zmprintingbd.com</a>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. MAIN NAVIGATION (Options: Home, Section, All Products, Clients, Gallery, Blog, About Us, Profile, Contact Us) ── */}
      <header className="sticky top-0 z-50 bg-[#0e2a1d]/95 backdrop-blur-md border-b border-white/10 shadow-lg">
        {user && (
          <div className="bg-[#143d2b] border-b border-emerald-500/20 px-6 py-1 text-center text-xs text-emerald-300 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Logged in as <strong>{user.name}</strong> ({user.role})</span>
            <Link href="/md" className="underline font-bold text-white ml-2 hover:text-emerald-200">
              Open FactoryOS Dashboard →
            </Link>
          </div>
        )}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 md:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 mr-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#df3b28] text-white font-black text-base shadow-xs">
              Z
            </div>
            <span className="font-black text-sm tracking-tight text-white group-hover:text-emerald-300 transition-colors">
              ZM FactoryOS
            </span>
          </Link>

          {/* Menus matching user's factory website */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-bold tracking-wider uppercase text-white/80">
            <button onClick={() => scrollTo('home')} className="hover:text-emerald-300 transition-colors">
              Home
            </button>
            <button onClick={() => scrollTo('about')} className="hover:text-emerald-300 transition-colors">
              About Us
            </button>
            <Link href="/sections" className="hover:text-emerald-300 transition-colors">
              Section
            </Link>
            <button onClick={() => scrollTo('products')} className="hover:text-emerald-300 transition-colors">
              All Products
            </button>
            <button onClick={() => scrollTo('clients')} className="hover:text-emerald-300 transition-colors">
              Clients
            </button>
            <Link href="/gallery" className="hover:text-emerald-300 transition-colors">
              Gallery
            </Link>
            <button onClick={() => scrollTo('blog')} className="hover:text-emerald-300 transition-colors">
              Blog
            </button>
            <button onClick={() => scrollTo('profile')} className="hover:text-emerald-300 transition-colors">
              Profile
            </button>
            <button onClick={() => scrollTo('contact')} className="hover:text-emerald-300 transition-colors">
              Contact Us
            </button>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => scrollTo('inquiry')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-white/10 hover:bg-white/20 text-[11px] font-bold uppercase tracking-wider transition-all border border-white/15 text-white"
            >
              Request a quote
              <ArrowUpRight className="h-3.5 w-3.5 text-[#df3b28]" />
            </button>

            <Link
              href={user ? "/md" : "/sign-in"}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-sm bg-[#df3b28] hover:bg-[#c93220] text-white text-[11px] font-black uppercase tracking-wider transition-all shadow-sm"
            >
              <Lock className="h-3 w-3" />
              <span>{user ? "FactoryOS" : "Sign In"}</span>
            </Link>
          </div>
        </div>

        {/* Mobile menu row */}
        <div className="flex lg:hidden overflow-x-auto py-2 px-6 border-t border-white/10 gap-4 text-[11px] font-bold uppercase tracking-wider text-white/70 whitespace-nowrap">
          <button onClick={() => scrollTo('home')}>Home</button>
          <button onClick={() => scrollTo('about')}>About Us</button>
          <Link href="/sections">Section</Link>
          <button onClick={() => scrollTo('products')}>All Products</button>
          <button onClick={() => scrollTo('clients')}>Clients</button>
          <Link href="/gallery">Gallery</Link>
          <button onClick={() => scrollTo('blog')}>Blog</button>
          <button onClick={() => scrollTo('profile')}>Profile</button>
          <button onClick={() => scrollTo('contact')}>Contact Us</button>
        </div>
      </header>

      {/* ── 3. MAIN HERO SECTION WITH BACKSIDE FACTORY PHOTO SLIDER ─────────── */}
      <section
        id="home"
        className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 border-b border-white/10 min-h-[640px] md:min-h-[720px] flex items-center"
      >
        {/* ── BACKSIDE SLIDER WITH REAL FACTORY PHOTOS ──────────────────────── */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentSlide === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
              style={{ transitionProperty: 'opacity, transform' }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
          ))}

          {/* Dark Forest Green Gradient & Vignette Overlay for Crisp Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e2a1d]/95 via-[#0e2a1d]/85 to-[#0a2016]/95" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0e2a1d]/85 via-transparent to-[#0e2a1d]" />
        </div>


        {/* ── FOREGROUND HERO CONTENT (Preserved Exactly As Requested) ───────── */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 w-full">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/70 px-3.5 py-1 text-[11px] font-mono uppercase tracking-widest text-emerald-300 backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#df3b28]" />
              01 / INDUSTRIAL PRINT & ACCESSORIES FACILITY
            </div>

            <h1 className="mt-8 text-5xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl leading-[0.95] drop-shadow-sm">
              Precision garment printing.
              <br />
              <span className="text-[#34d399]">Engineered for scale.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg text-emerald-100/85 font-normal leading-relaxed drop-shadow-xs">
              ZM Printing & Design Ltd. delivers end-to-end screen printing, silicone high-density, sublimation, digital heat transfer, and specialty embellishments for apparel brands and export manufacturers across Dhaka and global markets.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollTo('inquiry')}
                className="inline-flex items-center gap-2 rounded-sm bg-[#df3b28] px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white hover:bg-[#c93220] transition-all shadow-[4px_4px_0_rgba(0,0,0,0.3)] hover:translate-x-0.5 hover:translate-y-0.5"
              >
                Start an Inquiry
                <ArrowUpRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => scrollTo('process')}
                className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-[#0e2a1d]/60 backdrop-blur-xs px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
              >
                How It Moves
                <ArrowRight className="h-4 w-4 text-emerald-400" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400/90 sm:ml-4">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Floor View: {slides[currentSlide].dept}
              </div>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-white/15 pt-8 bg-[#0e2a1d]/60 backdrop-blur-xs rounded-sm p-4">
            <div>
              <p className="font-mono text-3xl md:text-4xl font-black text-white">50,000+</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">Daily Print Capacity</p>
            </div>
            <div>
              <p className="font-mono text-3xl md:text-4xl font-black text-white">100%</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">In-house QC Passed</p>
            </div>
            <div>
              <p className="font-mono text-3xl md:text-4xl font-black text-white">48h</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">Fast Sample Turnaround</p>
            </div>
            <div>
              <p className="font-mono text-3xl md:text-4xl font-black text-white">Dhaka</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">Manufacturing Base</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. ABOUT US & EXECUTIVE WELCOME (MENU: "ABOUT US", HOME 2ND SECTION) ─────────── */}
      <section id="about" className="bg-[#0b2217] py-20 md:py-24 border-b border-white/10 relative overflow-hidden">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #34d399 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
          {/* Section Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/70 px-3 py-0.5 text-[11px] font-mono uppercase tracking-widest text-emerald-300">
              <span className="text-[#df3b28]">02 /</span> ABOUT US & WELCOME
            </div>
            <h2 className="mt-3 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-tight">
              Welcome To <span className="text-[#df3b28]">ZM Printing & Design Ltd.</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm font-mono text-emerald-400 uppercase tracking-wider">
              One Stop Solution of all kind garments printing & accessories
            </p>
          </div>

          {/* Top Main Box: MD / Executive Photo + Welcome Message */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#102d1f] border border-white/10 p-6 md:p-10 rounded-sm shadow-xl relative overflow-hidden mb-10">
            {/* Ambient glow accent */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#df3b28]/10 blur-3xl pointer-events-none" />

            {/* Left: MD Photo with styled frame */}
            <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
              <div className="relative group w-full max-w-md">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-[#df3b28] to-emerald-500 rounded-sm opacity-30 group-hover:opacity-60 transition duration-300 blur-xs" />
                <div className="relative rounded-sm overflow-hidden border-2 border-white/20 bg-[#0e2a1d] shadow-2xl">
                  <img
                    src="/images/about_md_founder.png"
                    alt="Managing Director - ZM Printing & Design Ltd."
                    className="w-full h-auto object-cover object-center transform group-hover:scale-102 transition duration-500"
                  />
                  <div className="bg-[#0e2a1d]/95 border-t border-white/10 p-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">Managing Director</p>
                      <p className="text-[10px] font-mono text-emerald-300">Executive Leadership</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-xs bg-[#df3b28] text-white font-mono text-[9px] font-bold uppercase tracking-widest">
                      SINCE 2008
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Welcome & History Content */}
            <div className="lg:col-span-7">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-2">
                // About ZM Printing
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Industry leader in cap manufacturing & garment printing since 2008.
              </h3>
              
              <p className="mt-4 text-sm sm:text-base text-emerald-100/85 leading-relaxed font-normal">
                We have the pleasure to announce that <strong>ZM Printing Industries Limited</strong> has remained the industry leader in cap manufacturing and garment embellishments since its commencement in <strong>2008</strong>. It started its business with a simple pledge to offer a full-service, all-in-one manufacturing facility.
              </p>
              
              <p className="mt-3 text-sm sm:text-base text-emerald-100/75 leading-relaxed">
                Our primary objectives since the beginning of operations were to focus on enhancing highest quality headwear, precision screen printing, silicone 3D embossing, sublimation, and export-grade garment accessories. Supported by our internal operating system, <strong>FactoryOS</strong>, every order is tracked with uncompromising precision from sampling to final shipment.
              </p>

              {/* Quick Specs Highlight */}
              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="font-mono text-xl sm:text-2xl font-black text-white">2008</p>
                  <p className="font-mono text-[10px] uppercase text-emerald-300/80">Commencement Year</p>
                </div>
                <div>
                  <p className="font-mono text-xl sm:text-2xl font-black text-white">Full Service</p>
                  <p className="font-mono text-[10px] uppercase text-emerald-300/80">In-House Facility</p>
                </div>
                <div>
                  <p className="font-mono text-xl sm:text-2xl font-black text-white">Global Std</p>
                  <p className="font-mono text-[10px] uppercase text-emerald-300/80">Buyer Compliance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 4 Pillar Cards (from old website: Customer Satisfaction, In Time Delivery, Competitive Price, Quality Product) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="bg-[#123625] border border-white/10 p-6 rounded-sm flex flex-col justify-between hover:border-[#df3b28]/60 transition-colors group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#df3b28]/20 border border-[#df3b28]/40 flex items-center justify-center text-[#df3b28] group-hover:scale-110 transition-transform">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/80">01</span>
                </div>
                <h4 className="text-base font-black text-white uppercase tracking-tight mb-2 group-hover:text-emerald-300 transition-colors">
                  Customer Satisfaction
                </h4>
                <p className="text-xs text-emerald-100/75 leading-relaxed">
                  With a brilliant team of engineers driving everything we do, ZM Printing & Design Ltd. offers the best possible service experience powered by superior technology.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                <span>// CLIENT-FIRST</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#123625] border border-white/10 p-6 rounded-sm flex flex-col justify-between hover:border-emerald-400/60 transition-colors group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/80">02</span>
                </div>
                <h4 className="text-base font-black text-white uppercase tracking-tight mb-2 group-hover:text-emerald-300 transition-colors">
                  In Time Delivery
                </h4>
                <p className="text-xs text-emerald-100/75 leading-relaxed">
                  Our factory provides a friendly and organized environment with modern machinery, skilled workers, and fresh positive airflow to ensure punctual delivery on every run.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                <span>// ON SCHEDULE</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#123625] border border-white/10 p-6 rounded-sm flex flex-col justify-between hover:border-amber-400/60 transition-colors group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <BadgePercent className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/80">03</span>
                </div>
                <h4 className="text-base font-black text-white uppercase tracking-tight mb-2 group-hover:text-amber-300 transition-colors">
                  Competitive Price
                </h4>
                <p className="text-xs text-emerald-100/75 leading-relaxed">
                  After successfully delivering quality products, you will partner with us again. That is why uncompromising quality and transparent factory pricing is our core goal.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                <span>// FAIR VALUE</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#123625] border border-white/10 p-6 rounded-sm flex flex-col justify-between hover:border-cyan-400/60 transition-colors group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/80">04</span>
                </div>
                <h4 className="text-base font-black text-white uppercase tracking-tight mb-2 group-hover:text-cyan-300 transition-colors">
                  Quality Product
                </h4>
                <p className="text-xs text-emerald-100/75 leading-relaxed">
                  We offer top-quality garment printing & embellishment. Our team has the specialized expertise and technical skills required to ensure professional results for your brand.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                <span>// ZERO DEFECT</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SECTION: FACTORY PRINTING UNITS (MENU: "SECTION") ────────────── */}
      <section id="section" className="bg-[#0e2a1d] py-20 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          
          {/* Header matching Image 2 & factory context */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                <span className="text-[#df3b28]">03 /</span> FACTORY DEPARTMENTS & UNITS
              </p>
              <h2 className="mt-2 text-4xl sm:text-5xl font-black tracking-tight text-white">
                The detail is the difference.
              </h2>
              <p className="mt-2 text-sm text-emerald-100/75 max-w-xl">
                A small look at the textures, contrasts, and finishing moments that give a garment its voice across our dedicated industrial printing divisions.
              </p>
            </div>
            
            <Link
              href="/sections"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-[#df3b28] hover:bg-[#c93220] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md group shrink-0"
            >
              <span>Explore Company's All Sections</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* ── EXACT EDITORIAL POSTER COLLAGE GRID (Recreated with Big Names & Crisp Info) ── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 select-none">
            
            {/* ── BLOCK 1: TALL LEFT CARD (5 cols, full height / 2 rows) - SILK SCREEN PRINTING ── */}
            <Link
              href="/sections"
              className="md:col-span-5 relative overflow-hidden bg-[#9eb8a7] text-[#0e2a1d] rounded-sm min-h-[460px] md:min-h-[540px] p-6 flex flex-col justify-between shadow-lg group border border-white/10 hover:border-emerald-400/50 transition-all cursor-pointer"
            >
              {/* White crescent moon accent peeking from right edge */}
              <div className="absolute right-0 top-[50%] -translate-y-1/2 w-32 h-32 rounded-full bg-[#f4f7f4] pointer-events-none opacity-90" />

              {/* Bold diagonal red stripe across the block */}
              <div className="absolute -inset-x-24 top-1/4 h-36 bg-[#df3b28] transform -rotate-[32deg] shadow-xl flex items-center justify-center pointer-events-none group-hover:scale-105 transition-transform duration-500" />

              {/* Top Tag & Code */}
              <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                <span className="bg-[#0e2a1d] text-white px-2.5 py-1 rounded-xs text-[11px] font-bold shadow-xs">
                  SEC-01
                </span>
                <span className="font-bold text-[#0e2a1d] uppercase tracking-wider text-[11px] bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-xs shadow-xs">
                  High Volume
                </span>
              </div>

              {/* Main Section Name - Big, Bold & Beautiful */}
              <div className="relative z-10 my-auto py-6">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase drop-shadow-md leading-[1.05]">
                  Silk Screen <br />
                  Printing
                </p>
                <div className="w-12 h-1 bg-white mt-3 mb-4 rounded-full" />
                
                {/* Short, high-value key information */}
                <div className="space-y-1.5 text-xs sm:text-sm font-semibold text-white drop-shadow-xs">
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                    <span>Automatic Oval Carousels</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                    <span>Plastisol, Waterbase & Discharge</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                    <span>Up to 12 Colors Micro-Registration</span>
                  </p>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="relative z-10 flex items-center justify-between border-t border-[#0e2a1d]/20 pt-3 text-[#0e2a1d]">
                <span className="text-xs font-black uppercase tracking-wider group-hover:text-[#df3b28] transition-colors">
                  Explore Silk Screen Works
                </span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform text-[#0e2a1d]" />
              </div>
            </Link>

            {/* ── RIGHT 7 COLUMNS: 2x2 GRID (Blocks 2, 3, 4, 5) ── */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* ── BLOCK 2: TOP-LEFT (Cobalt Blue // SONIC WELDING) ── */}
              <Link
                href="/sections"
                className="relative overflow-hidden bg-[#1e40af] text-white rounded-sm min-h-[250px] p-5 flex flex-col justify-between shadow-lg group border border-white/10 hover:border-blue-300/50 transition-all cursor-pointer"
              >
                {/* Diagonal hazard stripes pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(96,165,250,0.25)_25%,rgba(96,165,250,0.25)_50%,transparent_50%,transparent_75%,rgba(96,165,250,0.25)_75%)] bg-[length:36px_36px] pointer-events-none opacity-50" />

                {/* Top header */}
                <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                  <span className="bg-black/40 text-white px-2.5 py-0.5 rounded-xs text-[10px] font-bold">
                    SEC-05
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-xs text-blue-100">
                    Precision Stitch
                  </span>
                </div>

                {/* Big Section Name */}
                <div className="relative z-10 my-auto py-2">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase leading-tight group-hover:text-blue-200 transition-colors">
                    Sonic Welding
                  </h3>
                  {/* Short Key Information */}
                  <div className="mt-2 space-y-1 text-xs text-blue-100/90 font-medium">
                    <p className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-blue-300 shrink-0" />
                      <span>Acoustic High-Frequency Sealing</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-blue-300 shrink-0" />
                      <span>Seamless Waterproof Badges & Caps</span>
                    </p>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-2.5 text-xs text-blue-100 font-bold">
                  <span>View Sonic Works</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform text-white" />
                </div>
              </Link>

              {/* ── BLOCK 3: TOP-RIGHT (Mustard Yellow // 3D SILICONE & RUBBER) ── */}
              <Link
                href="/sections"
                className="relative overflow-hidden bg-[#eab308] text-[#0e2a1d] rounded-sm min-h-[250px] p-5 flex flex-col justify-between shadow-lg group border border-white/10 hover:border-yellow-200/60 transition-all cursor-pointer"
              >
                {/* Tactile circular patches */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none group-hover:scale-105 transition-transform duration-300 opacity-90">
                  <div className="w-16 h-16 rounded-full bg-[#0e2a1d] shadow-lg flex items-center justify-center text-white text-[10px] font-bold font-mono">
                    3D
                  </div>
                  <div className="w-11 h-11 rounded-full bg-[#df3b28] shadow-md" />
                </div>

                {/* Top header */}
                <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                  <span className="bg-[#0e2a1d] text-white px-2.5 py-0.5 rounded-xs text-[10px] font-bold">
                    SEC-02
                  </span>
                  <span className="bg-[#0e2a1d]/15 text-[#0e2a1d] px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase">
                    Premium 3D
                  </span>
                </div>

                {/* Big Section Name */}
                <div className="relative z-10 my-auto py-2 max-w-[65%]">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0e2a1d] uppercase leading-tight group-hover:text-black transition-colors">
                    3D Silicone & Rubber
                  </h3>
                  {/* Short Key Information */}
                  <div className="mt-2 space-y-1 text-xs text-[#0e2a1d]/85 font-semibold">
                    <p className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-[#0e2a1d] shrink-0" />
                      <span>Embossed Rubber Badges</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-[#0e2a1d] shrink-0" />
                      <span>Wash-Proof Activewear Grip</span>
                    </p>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="relative z-10 flex items-center justify-between border-t border-[#0e2a1d]/20 pt-2.5 text-xs text-[#0e2a1d] font-bold">
                  <span>View Silicone Works</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform text-[#0e2a1d]" />
                </div>
              </Link>

              {/* ── BLOCK 4: BOTTOM-LEFT (Mint Pinstripe // DTF HEAT TRANSFER) ── */}
              <Link
                href="/sections"
                className="relative overflow-hidden bg-[#a8c5b5] text-[#0e2a1d] rounded-sm min-h-[250px] p-5 flex flex-col justify-between shadow-lg group border border-white/10 hover:border-emerald-300/50 transition-all cursor-pointer"
              >
                {/* Fine vertical pinstripe texture */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_6px,rgba(14,42,29,0.08)_6px,rgba(14,42,29,0.08)_7px)] pointer-events-none" />

                {/* Top header */}
                <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                  <span className="bg-[#0e2a1d] text-white px-2.5 py-0.5 rounded-xs text-[10px] font-bold">
                    SEC-04
                  </span>
                  <span className="bg-[#0e2a1d]/15 text-[#0e2a1d] px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase">
                    High Precision
                  </span>
                </div>

                {/* Big Section Name */}
                <div className="relative z-10 my-auto py-2">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0e2a1d] uppercase leading-tight group-hover:text-black transition-colors">
                    DTF Heat Transfer
                  </h3>
                  {/* Short Key Information */}
                  <div className="mt-2 space-y-1 text-xs text-[#0e2a1d]/85 font-semibold">
                    <p className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-[#0e2a1d] shrink-0" />
                      <span>1200 DPI Photo-Realistic Detail</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-[#0e2a1d] shrink-0" />
                      <span>Stretchable Tagless Neck Labels</span>
                    </p>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="relative z-10 flex items-center justify-between border-t border-[#0e2a1d]/20 pt-2.5 text-xs text-[#0e2a1d] font-bold">
                  <span>View DTF Works</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform text-[#0e2a1d]" />
                </div>
              </Link>

              {/* ── BLOCK 5: BOTTOM-RIGHT (Crimson Red // DYE SUBLIMATION) ── */}
              <Link
                href="/sections"
                className="relative overflow-hidden bg-[#c5221f] text-white rounded-sm min-h-[250px] p-5 flex flex-col justify-between shadow-lg group border border-white/10 hover:border-red-300/50 transition-all cursor-pointer"
              >
                {/* Two diagonal speed stripes across the block */}
                <div className="absolute -inset-x-10 top-1/4 h-5 bg-[#3d0f0d] transform -rotate-[22deg] pointer-events-none shadow-md opacity-70" />
                <div className="absolute -inset-x-10 bottom-1/3 h-2 bg-[#fca5a5] transform -rotate-[22deg] pointer-events-none shadow-xs opacity-80" />

                {/* Top header */}
                <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                  <span className="bg-black/40 text-white px-2.5 py-0.5 rounded-xs text-[10px] font-bold">
                    SEC-03
                  </span>
                  <span className="bg-black/20 text-red-100 px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase">
                    Full Fabric
                  </span>
                </div>

                {/* Big Section Name */}
                <div className="relative z-10 my-auto py-2">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase leading-tight group-hover:text-red-100 transition-colors">
                    Dye Sublimation
                  </h3>
                  {/* Short Key Information */}
                  <div className="mt-2 space-y-1 text-xs text-red-100/90 font-medium">
                    <p className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-red-300 shrink-0" />
                      <span>Roll-to-Roll Calendar Press</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-red-300 shrink-0" />
                      <span>Zero Hand-Feel Sports Jerseys</span>
                    </p>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-2.5 text-xs text-white font-bold">
                  <span>View Sublimation Works</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform text-white" />
                </div>
              </Link>

            </div>
          </div>

          {/* ── HIGH IMPACT BANNER LINKING TO COMPANY'S ALL SECTIONS PAGE (100% ENGLISH) ── */}
          <div className="mt-10 p-6 sm:p-8 rounded-sm bg-[#123625] border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 mb-1.5">
                <span className="h-2 w-2 rounded-full bg-[#df3b28] animate-ping" />
                <span className="font-bold">// ALL PRODUCTION DEPARTMENTS & CAPABILITIES</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Want to inspect all factory sections and specialized works?
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/75 mt-1 max-w-2xl">
                Visit our dedicated <strong>Company's All Sections</strong> directory page. Inspect the full breakdown of specialized techniques, machinery hardware, daily capacities, and testing standards executed across all factory departments.
              </p>
            </div>
            
            <Link
              href="/sections"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-sm bg-[#df3b28] hover:bg-[#c93220] text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shrink-0 group"
            >
              <span>Explore All Section Works</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* ── 6. ALL PRODUCTS (MENU: "ALL PRODUCTS") ───────────────────────────── */}
      <section id="products" className="bg-[#bee7d2] text-[#0e2a1d] py-20 border-b border-black/10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-[#0e2a1d]/80">
              <span className="text-[#df3b28]">04 /</span> EMBELLISHMENTS & PRODUCTS
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tighter text-[#0e2a1d] sm:text-5xl">
              All Products & Solutions
            </h2>
            <p className="mt-3 text-base text-[#0e2a1d]/75">
              From casual cotton t-shirts to heavy fleece hoodies and technical sportswear jerseys.
            </p>
          </div>
        </div>

        {/* ── Auto-Sliding Marquee Track (Exact Same Cards as Screenshot) ───── */}
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-4 animate-marquee py-2" style={{ animationDuration: '30s' }}>
            {[...FACTORY_ALL_PRODUCTS, ...FACTORY_ALL_PRODUCTS].map((p, i) => (
              <div
                key={i}
                className="w-[190px] sm:w-[210px] shrink-0 bg-[#f7faf8] p-5 rounded-sm border border-[#0e2a1d]/10 shadow-sm flex flex-col justify-between"
              >
                <div className="h-2 w-6 bg-[#df3b28] mb-4" />
                <div>
                  <h4 className="font-black text-sm text-[#0e2a1d] leading-tight mb-1">{p.name}</h4>
                  <p className="font-mono text-[10px] text-[#0e2a1d]/60">{p.cap}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. PROCESS: HOW IT MOVES ─────────────────────────────────────────── */}
      <section id="process" className="bg-[#0e2a1d] py-20 md:py-28 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start mb-16">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                <span className="text-[#df3b28]">05 /</span> HOW IT MOVES
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tighter text-white sm:text-6xl md:text-7xl leading-[1.0]">
                Less chasing.
                <br />
                More making.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-8">
              <p className="text-base md:text-lg text-emerald-100/75 leading-relaxed font-normal">
                A production partner should make the next step feel obvious. We keep the conversation practical, direct and grounded in the garment.
              </p>
            </div>
          </div>

          <div className="divide-y divide-white/10 border-t border-b border-white/10">
            {[
              {
                id: 1,
                num: '01',
                title: 'Share the brief',
                desc: 'Tell us about the garment, artwork, quantity and finish you have in mind.',
              },
              {
                id: 2,
                num: '02',
                title: 'Sample & refine',
                desc: 'We align on the right print route and details before production begins.',
              },
              {
                id: 3,
                num: '03',
                title: 'Make it production-ready',
                desc: 'Our team turns the agreed direction into a clean, repeatable run.',
              },
              {
                id: 4,
                num: '04',
                title: 'Pack & deliver',
                desc: 'Finished pieces are checked, prepared and handed over ready for the next step.',
              },
            ].map((step) => {
              const isActive = activeStep === step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`cursor-pointer transition-all duration-300 ${
                    isActive
                      ? 'bg-[#153a29] rounded-sm my-1 py-7 px-6 md:px-8 border-l-4 border-l-[#df3b28]'
                      : 'hover:bg-white/[0.03] py-7 px-4 md:px-6'
                  }`}
                >
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <span className="font-mono text-sm font-bold text-emerald-400">
                        {step.num}
                      </span>
                    </div>

                    <div className="col-span-10 sm:col-span-4 lg:col-span-4">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                        {step.title}
                      </h3>
                    </div>

                    <div className="col-span-11 sm:col-span-6 lg:col-span-6 pl-2 sm:pl-0">
                      <p className="text-sm md:text-base text-emerald-100/70 font-normal leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="col-span-1 text-right">
                      <ArrowRight
                        className={`h-5 w-5 transition-transform ${
                          isActive ? 'text-[#df3b28] translate-x-1' : 'text-[#df3b28]/60'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. CLIENTS (MENU: "CLIENTS") ─────────────────────────────────────── */}
      <section id="clients" className="bg-[#0a2016] py-20 border-b border-white/10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                <span className="text-[#df3b28]">06 /</span> OUR PARTNERS
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tighter text-white sm:text-5xl">
                Trusted by Clothing Makers
              </h2>
            </div>
            <p className="max-w-md text-sm text-emerald-100/70">
              We serve exporters, emerging streetwear labels, corporate merchandise managers, and international brands.
            </p>
          </div>
        </div>

        {/* ── Auto-Sliding Client Logos Track ───────────────────────────────── */}
        <div className="relative w-full overflow-hidden">
          {/* Edge gradient masks */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#0a2016] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#0a2016] to-transparent z-10" />

          <div className="flex gap-5 animate-marquee py-3" style={{ animationDuration: '32s' }}>
            {[...DEMO_CLIENT_LOGOS, ...DEMO_CLIENT_LOGOS].map((client, idx) => (
              <div key={`${client.id}-${idx}`} className="shrink-0">
                {client.render()}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8.5. OUR ACCOMPLISHMENT (METRICS & PERFORMANCE FROM PHOTO) ─────── */}
      <section id="accomplishment" className="relative bg-[#06150e] py-20 md:py-24 border-b border-white/10 overflow-hidden">
        {/* Background dark workspace overlay with industrial depth */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none mix-blend-luminosity"
          style={{ backgroundImage: `url('/images/factory_slide_1.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06150e] via-[#06150e]/95 to-[#06150e] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#22c55e]">
              Our Accomplishment
            </h2>
            <div className="h-1 w-16 bg-[#df3b28] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                id: 'quality',
                label: 'Quality',
                percent: 90,
                color: '#df3b28',
              },
              {
                id: 'price',
                label: 'Competetive Price',
                percent: 75,
                color: '#df3b28',
              },
              {
                id: 'delivery',
                label: 'In Time Delivery',
                percent: 85,
                color: '#df3b28',
              },
            ].map((item, idx) => {
              const radius = 56;
              const circumference = 2 * Math.PI * radius; // ~351.85
              const strokeDashoffset = circumference - (item.percent / 100) * circumference;

              return (
                <div
                  key={idx}
                  className="bg-[#155d34] border border-[#1f7a46]/60 rounded-sm p-8 flex flex-col items-center justify-between text-center shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Circular Progress Ring */}
                  <div className="relative w-36 h-36 flex items-center justify-center my-4">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
                      {/* Background circle track */}
                      <circle
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="transparent"
                        stroke="#0d3f23"
                        strokeWidth="11"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth="11"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    {/* Centered percentage */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl font-black text-[#df3b28] tracking-tight">
                        {item.percent}%
                      </span>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="mt-4">
                    <h3 className="text-base sm:text-lg font-black text-[#df3b28] tracking-wide">
                      {item.label}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 9. GALLERY: WORK IN THE WORLD (MENU: "GALLERY") ──────────────────── */}
      <section id="gallery" className="bg-[#0b2217] py-20 md:py-28 border-b border-white/10 relative">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                <span className="text-[#df3b28]">07 /</span> FACTORY GALLERY & FINISHES
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tighter text-white sm:text-6xl md:text-7xl leading-[1.0]">
                The detail is
                <br />
                <span className="text-emerald-400">the difference.</span>
              </h2>
            </div>
            <div className="flex flex-col items-start md:items-end gap-4">
              <p className="max-w-md text-sm sm:text-base text-emerald-100/75 leading-relaxed md:text-right">
                Explore signature print techniques, multi-layer rubber and silicone badges, wide-format sublimation, and sonic weld finishes from the factory floor.
              </p>
              {/* Text Link & Button to Dedicated Gallery Page */}
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 rounded-xs bg-[#df3b28] hover:bg-[#c93220] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-all shadow-md hover:translate-x-0.5"
              >
                <span>View Full Gallery Page (15+ Photos)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Exactly ONE LINE of 4 Curated Gallery Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedGalleryItem(item)}
                className="group bg-[#102d1f] rounded-sm border border-white/10 hover:border-[#df3b28]/70 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
              >
                {/* Header Tag */}
                <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between bg-[#0e2a1d]/90">
                  <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    {item.badge}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#df3b28] group-hover:animate-ping" />
                </div>

                {/* Image Container with hover zoom */}
                <div className="relative h-48 bg-[#091b12] overflow-hidden flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/factory_slide_1.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102d1f] via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                {/* Content Details */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-base font-black text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-emerald-100/70 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Red Show More Button Matching Screenshot */}
                  <div className="mt-5 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGalleryItem(item);
                      }}
                      className="w-full py-2.5 px-4 rounded-xs bg-[#df3b28] hover:bg-[#c93220] text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs group-hover:shadow-[0_0_15px_rgba(223,59,40,0.4)] cursor-pointer"
                    >
                      <span>Show More</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prominent Text Callout to Dedicated Gallery Page */}
          <div className="mt-10 p-6 md:p-8 rounded-sm bg-[#102d1f] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-[#df3b28]/20 border border-[#df3b28]/40 flex items-center justify-center text-[#df3b28] shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[#df3b28] font-bold">
                  // WANT TO SEE MORE FINISHES & FACTORY PHOTOS?
                </p>
                <h4 className="text-base sm:text-lg font-black text-white mt-0.5">
                  Explore our dedicated gallery with section work photos, floor machinery & products.
                </h4>
              </div>
            </div>

            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xs bg-[#df3b28] hover:bg-[#c93220] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer"
            >
              <span>Go to Gallery Page</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* ── Interactive Lightbox / Detail Modal ─────────────────────────────── */}
        {selectedGalleryItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedGalleryItem(null)}
          >
            <div
              className="relative w-full max-w-2xl bg-[#0e2a1d] border-2 border-emerald-500/30 rounded-sm shadow-2xl overflow-hidden text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#123625]">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-[#df3b28]" />
                  <span className="font-mono text-xs uppercase tracking-widest text-emerald-300">
                    {selectedGalleryItem.badge}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedGalleryItem(null)}
                  className="p-1 rounded-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 md:p-8">
                <div className="w-full h-64 sm:h-72 bg-[#091b12] rounded-sm overflow-hidden border border-white/15 mb-6 flex items-center justify-center">
                  <img
                    src={selectedGalleryItem.image}
                    alt={selectedGalleryItem.title}
                    className="w-full h-full object-contain object-center"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/factory_slide_1.jpg';
                    }}
                  />
                </div>

                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {selectedGalleryItem.title}
                </h3>

                <div className="mt-3 inline-block px-3 py-1 rounded-xs bg-emerald-950/80 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                  {selectedGalleryItem.specs}
                </div>

                <p className="mt-4 text-sm text-emerald-100/85 leading-relaxed">
                  {selectedGalleryItem.desc}
                </p>

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs font-mono text-emerald-400/80">
                    ZM Printing & Design Ltd. // Factory Floor Spec
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedGalleryItem(null)}
                      className="px-4 py-2 rounded-xs border border-white/20 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGalleryItem(null);
                        scrollTo('inquiry');
                      }}
                      className="px-5 py-2 rounded-xs bg-[#df3b28] hover:bg-[#c93220] text-xs font-black uppercase tracking-wider text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Inquire for this Finish</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── 10. BLOG (MENU: "BLOG") ──────────────────────────────────────────── */}
      <section id="blog" className="bg-[#0b2217] py-20 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                <span className="text-[#df3b28]">08 /</span> FACTORY DISPATCHES
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tighter text-white sm:text-5xl">
                Floor Updates & News
              </h2>
            </div>
            <p className="max-w-md text-sm text-emerald-100/70">
              Technical notes, machinery installations, and sustainable textile finishing practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                date: 'September 2026',
                tag: 'Machinery Expansion',
                title: 'Installation of New High-Precision Automatic Oval Printing Carousel',
                excerpt: 'Expanding daily print output by 15,000 units while enhancing micro-registration for intricate multi-color raster art.',
              },
              {
                date: 'August 2026',
                tag: 'Sustainability',
                title: 'Oeko-Tex Standard Chemical Formulations Across All Waterbase Inks',
                excerpt: 'Committed to zero hazardous discharges, meeting global compliance guidelines for European and North American buyers.',
              },
              {
                date: 'July 2026',
                tag: 'Fabric Innovation',
                title: 'Advanced Silicone 3D Embossing on Heavyweight Terry and Fleece',
                excerpt: 'Testing new bonding temperatures to achieve soft-touch high-relief logos with maximum wash resistance.',
              },
            ].map((post, i) => (
              <div key={i} className="p-6 rounded-sm bg-[#123122] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-3">
                    <span>{post.date}</span>
                    <span className="bg-[#0e2a1d] px-2 py-0.5 rounded-sm border border-white/10 text-[10px]">{post.tag}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">{post.title}</h3>
                  <p className="text-xs text-emerald-100/70 leading-relaxed mb-4">{post.excerpt}</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 inline-flex items-center gap-1 hover:text-white transition-colors">
                  Read article <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── 11. PROFILE (MENU: "PROFILE") ────────────────────────────────────── */}
      <section id="profile" className="bg-[#bee7d2] text-[#0e2a1d] py-20 border-b border-black/10">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#0e2a1d]/80">
                <span className="text-[#df3b28]">09 /</span> COMPANY PROFILE
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tighter text-[#0e2a1d] sm:text-5xl">
                Factory Profile & Specs
              </h2>
            </div>
            <button
              onClick={() => scrollTo('contact')}
              className="inline-flex items-center gap-2 rounded-sm bg-[#df3b28] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-sm"
            >
              <Download className="h-4 w-4" />
              Request Profile Deck
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#f7faf8] p-6 rounded-sm border border-[#0e2a1d]/10">
              <Building2 className="h-6 w-6 text-[#df3b28] mb-3" />
              <h4 className="font-black text-base text-[#0e2a1d]">Company Name</h4>
              <p className="text-xs text-[#0e2a1d]/70 mt-1">ZM Printing & Design Ltd.</p>
              <p className="text-[11px] font-mono text-[#0e2a1d]/60 mt-3">Trade License & Export Registered</p>
            </div>

            <div className="bg-[#f7faf8] p-6 rounded-sm border border-[#0e2a1d]/10">
              <Factory className="h-6 w-6 text-[#df3b28] mb-3" />
              <h4 className="font-black text-base text-[#0e2a1d]">Daily Capacity</h4>
              <p className="text-xs text-[#0e2a1d]/70 mt-1">50,000+ Print Units</p>
              <p className="text-[11px] font-mono text-[#0e2a1d]/60 mt-3">Multiple Shifts Continuous</p>
            </div>

            <div className="bg-[#f7faf8] p-6 rounded-sm border border-[#0e2a1d]/10">
              <Award className="h-6 w-6 text-[#df3b28] mb-3" />
              <h4 className="font-black text-base text-[#0e2a1d]">Compliance Standards</h4>
              <p className="text-xs text-[#0e2a1d]/70 mt-1">Eco Inks, Oeko-Tex Ready</p>
              <p className="text-[11px] font-mono text-[#0e2a1d]/60 mt-3">AQL 1.5 Quality Assurance</p>
            </div>

            <div className="bg-[#f7faf8] p-6 rounded-sm border border-[#0e2a1d]/10">
              <ShieldCheck className="h-6 w-6 text-[#df3b28] mb-3" />
              <h4 className="font-black text-base text-[#0e2a1d]">FactoryOS Powered</h4>
              <p className="text-xs text-[#0e2a1d]/70 mt-1">Internal ERP & Live Tracking</p>
              <p className="text-[11px] font-mono text-[#0e2a1d]/60 mt-3">Zero Missing Handovers</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 12. INQUIRY FORM (MENU: "CONTACT US") ────────────────────────────── */}
      <section id="inquiry" className="bg-[#edf2ea] text-[#0e2a1d] py-20 md:py-28 border-b border-black/10">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12 items-start">
            <div className="lg:col-span-5">
              <p className="font-mono text-xs uppercase tracking-widest text-[#0e2a1d]/80">
                <span className="text-[#df3b28]">10 /</span> YOUR NEXT RUN
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tighter text-[#0e2a1d] sm:text-6xl md:text-7xl leading-[1.0]">
                Bring us the
                <br />
                rough idea.
              </h2>
              <p className="mt-6 text-base md:text-lg text-[#0e2a1d]/80 leading-relaxed font-normal">
                You do not need perfect artwork or all the answers. A few details are enough to begin a useful conversation.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  'Brands building a new collection',
                  'Manufacturers planning a production run',
                  'Teams and custom apparel buyers',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0e2a1d] text-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span className="text-sm font-bold text-[#0e2a1d]">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 rounded-sm border border-[#0e2a1d]/15 bg-[#0e2a1d]/5 p-5">
                <p className="font-mono text-xs uppercase tracking-widest text-[#0e2a1d]/70">Direct Factory Lines:</p>
                <div className="mt-2 space-y-1">
                  <a href="tel:+8801818724417" className="block text-base font-extrabold text-[#0e2a1d] hover:text-[#df3b28]">
                    +88 01818724417
                  </a>
                  <a href="tel:+8801322881470" className="block text-base font-extrabold text-[#0e2a1d] hover:text-[#df3b28]">
                    +88 01322881470
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-sm bg-[#fbfdfa] p-8 md:p-10 shadow-xl border border-[#0e2a1d]/10">
                <div className="flex items-center justify-between border-b border-[#0e2a1d]/10 pb-5 mb-6">
                  <h3 className="text-2xl font-black tracking-tight text-[#0e2a1d]">
                    Start with the brief.
                  </h3>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#0e2a1d]/60 bg-[#0e2a1d]/5 px-2.5 py-1 rounded-sm">
                    FAST FACTORY RESPONSE
                  </span>
                </div>

                {isSubmitted ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-4">
                      <Check className="h-7 w-7 stroke-[3]" />
                    </div>
                    <h4 className="text-2xl font-black text-[#0e2a1d]">Brief Received!</h4>
                    <p className="mt-2 text-sm text-[#0e2a1d]/70 max-w-md mx-auto">
                      Thank you, <strong>{formData.name}</strong>. Our production team will review your run specs and contact you at <strong>{formData.email}</strong> within 1 business day.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', capability: '', quantity: '', details: '' });
                      }}
                      className="mt-6 inline-flex items-center gap-2 rounded-sm bg-[#0e2a1d] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#0e2a1d]/70 mb-1.5">
                          YOUR NAME
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Name / company"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full rounded-sm border border-[#0e2a1d]/20 bg-white px-4 py-3 text-sm text-[#0e2a1d] outline-none transition focus:border-[#df3b28] focus:ring-1 focus:ring-[#df3b28]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#0e2a1d]/70 mb-1.5">
                          EMAIL ADDRESS
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="you@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full rounded-sm border border-[#0e2a1d]/20 bg-white px-4 py-3 text-sm text-[#0e2a1d] outline-none transition focus:border-[#df3b28] focus:ring-1 focus:ring-[#df3b28]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#0e2a1d]/70 mb-1.5">
                          WHAT DO YOU NEED?
                        </label>
                        <select
                          value={formData.capability}
                          onChange={(e) => setFormData({ ...formData, capability: e.target.value })}
                          className="w-full rounded-sm border border-[#0e2a1d]/20 bg-white px-4 py-3 text-sm text-[#0e2a1d] outline-none transition focus:border-[#df3b28] focus:ring-1 focus:ring-[#df3b28]"
                        >
                          <option value="">Select a capability</option>
                          <option value="screen-printing">Screen Printing (Plastisol, Waterbase, Pigment)</option>
                          <option value="high-density">High Density & 3D Silicone Print</option>
                          <option value="sublimation">Sublimation Printing (All-over & Panel)</option>
                          <option value="heat-transfer">Digital Heat Transfer / DTF</option>
                          <option value="embroidery">Embroidery & Woven Patches</option>
                          <option value="full-package">Full Package Garment Production</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#0e2a1d]/70 mb-1.5">
                          APPROX. QUANTITY
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 250 pieces"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          className="w-full rounded-sm border border-[#0e2a1d]/20 bg-white px-4 py-3 text-sm text-[#0e2a1d] outline-none transition focus:border-[#df3b28] focus:ring-1 focus:ring-[#df3b28]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#0e2a1d]/70 mb-1.5">
                        A LITTLE ABOUT THE RUN
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Garment type, artwork, finish, timing or anything useful..."
                        value={formData.details}
                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                        className="w-full rounded-sm border border-[#0e2a1d]/20 bg-white px-4 py-3 text-sm text-[#0e2a1d] outline-none transition focus:border-[#df3b28] focus:ring-1 focus:ring-[#df3b28] resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-sm bg-[#df3b28] hover:bg-[#c93220] px-7 py-3.5 text-sm font-black uppercase tracking-wider text-white transition-all shadow-[2px_2px_0_rgba(0,0,0,0.2)]"
                      >
                        Send Inquiry
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="font-mono text-[10px] text-[#0e2a1d]/60 leading-relaxed pt-2">
                      This form gives you instant confirmation in the browser. For a direct factory conversation, use the contact details below.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 13. FAQS ─────────────────────────────────────────────────────────── */}
      <section id="faq" className="bg-[#0b2217] text-white py-20 md:py-28 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12 items-start">
            <div className="lg:col-span-5">
              <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                <span className="text-[#df3b28]">11 /</span> GOOD TO KNOW
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tighter text-white sm:text-6xl md:text-7xl leading-[1.0]">
                Straight
                <br />
                answers
                <br />
                before we
                <br />
                start.
              </h2>
              <p className="mt-6 text-base md:text-lg text-emerald-100/80 leading-relaxed font-normal">
                Still deciding what to ask? That is okay. Reach out with the context you have and we will take it from there.
              </p>
            </div>

            <div className="lg:col-span-7 divide-y divide-white/10 border-t border-b border-white/10">
              {[
                {
                  id: 0,
                  q: 'What can I include in a quote request?',
                  a: 'Send the garment type, approximate quantity, artwork or reference, preferred finish and your target timeline. The more context you share, the more useful our first response can be.',
                },
                {
                  id: 1,
                  q: 'Do you handle more than one printing method?',
                  a: 'Yes. We operate dedicated production lines for silk screen, silicone / high-density, sublimation, digital heat transfer, foil, flock, discharge, and specialty garment finishes all under one roof.',
                },
                {
                  id: 2,
                  q: 'Can you work with brands and clothing manufacturers?',
                  a: 'Absolutely. We partner with local Bangladeshi RMG exporters, emerging fashion startups, indie apparel labels, and global buying houses requiring reliable sample developments and bulk volume execution.',
                },
                {
                  id: 3,
                  q: 'How do I reach the factory directly?',
                  a: 'You can call our floor operations desk directly at +88 01818724417 or +88 01322881470, or email zmprinting02@gmail.com / info@zmprintingbd.com. Factory visits and sample reviews are welcomed by appointment.',
                },
              ].map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div key={faq.id} className="py-6">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="flex w-full items-center justify-between text-left group"
                    >
                      <span className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors pr-4">
                        {faq.q}
                      </span>
                      <span className="text-[#df3b28] shrink-0">
                        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </span>
                    </button>
                    {isOpen && (
                      <p className="mt-4 text-sm md:text-base text-emerald-100/75 leading-relaxed font-normal">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 12. THANK YOU SECTION (CENTERED & COMPACT FOR SINGLE VIEW WITH FOOTER) ── */}
      <section id="thank-you" className="bg-[#0e2a1d] text-white py-14 md:py-20 border-b border-white/10 text-center">
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400 mb-3">
            <span className="text-[#df3b28]">12 /</span> APPRECIATION
          </p>

          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-black tracking-tight text-white mb-4 leading-none">
            Thank You.
          </h2>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-emerald-100/80 leading-relaxed font-normal">
            We sincerely appreciate you exploring our factory operations, machinery, and craft. Wishing you boundless success, rapid growth, and creative brilliance in all your apparel collections. We look forward to building a lasting, world-class manufacturing partnership together.
          </p>
        </div>
      </section>

      {/* ── 14. FOOTER (FROM FACTORY WEBSITE) ────────────────────────────────── */}
      <div id="contact">
        <PublicFooter />
      </div>
    </div>
  );
}
