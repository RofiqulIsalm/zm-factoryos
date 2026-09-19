import React, { useState } from 'react';
import { Link } from 'wouter';
import {
  ArrowUpRight, ArrowRight, ArrowLeft, Phone, Mail, Lock, X,
  Layers, Factory, Sparkles, ShieldCheck, Download, ChevronRight
} from 'lucide-react';
import { useGetCurrentUser } from '@workspace/api-client-react';
import { PublicFooter } from '@/components/public/PublicFooter';

interface GalleryPhoto {
  id: string;
  title: string;
  category: 'work' | 'factory' | 'product';
  categoryLabel: string;
  badge: string;
  image: string;
  specs: string;
  desc: string;
}

export function GalleryPage() {
  const { data: user } = useGetCurrentUser();
  const [activeCategory, setActiveCategory] = useState<'all' | 'work' | 'factory' | 'product'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const galleryPhotos: GalleryPhoto[] = [
    // ── SECTION & WORK PHOTOS ──────────────────────────────────────────────
    {
      id: 'work-screen-print',
      title: 'Silk Screen Printing Palette Setup',
      category: 'work',
      categoryLabel: 'Section Work',
      badge: 'Screen Print Division',
      image: '/images/gallery/gallery_screen_printing.png',
      specs: 'Plastisol & Discharge // Micro-Registration // 12 Colors',
      desc: 'Precision carousel screen printing executed on dark cotton t-shirts with high-opacity ink formulations and crisp raster lines.'
    },
    {
      id: 'work-sonic-patch',
      title: 'Sonic & NXP 3D Rubber Badge',
      category: 'work',
      categoryLabel: 'Section Work',
      badge: 'Rubber & Silicone Line',
      image: '/images/gallery/gallery_sonic_patch.png',
      specs: 'Multi-Color PVC // Stitch Channel // Wash-Proof Bond',
      desc: 'Molded high-relief 3D character badge engineered with vibrant color layers and soft-touch flexibility for export streetwear.'
    },
    {
      id: 'work-sublimation-roll',
      title: 'Roll-to-Roll Dye Sublimation Press',
      category: 'work',
      categoryLabel: 'Section Work',
      badge: 'Sublimation Unit',
      image: '/images/gallery/gallery_sublimation.png',
      specs: 'Continuous CMYK // Zero Hand-Feel // Color Gamut',
      desc: 'High-speed wide-format textile sublimation printing transferring rich full-bleed graphics onto polyester sportswear fabrics.'
    },
    {
      id: 'work-sonic-weld',
      title: 'Sonic Weld Structured Cap',
      category: 'work',
      categoryLabel: 'Section Work',
      badge: 'Sonic Weld Division',
      image: '/images/gallery/gallery_sonic_weld_cap.png',
      specs: 'Ultrasonic High-Frequency // 5-Panel Cap // Flat Visor',
      desc: 'High-frequency ultrasonic welding of raised vinyl emblems onto heavy twill caps with razor-sharp adhesion and zero needle puncture.'
    },
    {
      id: 'work-rubber-collection',
      title: 'Industrial Rubber Patches Collection',
      category: 'work',
      categoryLabel: 'Section Work',
      badge: 'Rubber Badges',
      image: '/images/gallery/gallery_rubber_patch.png',
      specs: 'Debossed & Embossed // Velcro Backing // Heat-Seal',
      desc: 'Custom silicone and rubber patches manufactured for activewear labels, backpacks, denim jeans, and protective workwear.'
    },
    {
      id: 'work-silicone-badge',
      title: 'High-Density Circular Silicone Patch',
      category: 'work',
      categoryLabel: 'Section Work',
      badge: 'Silicone Division',
      image: '/images/gallery/gallery_silicone_patch.png',
      specs: 'Eco-Silicone // Micro-Matte Finish // Heat Bond',
      desc: 'Specialized 3D silicone patch held to strict international standards with tactile relief and velvet-touch matte durability.'
    },
    {
      id: 'work-silicone-direct',
      title: 'Direct-to-Fabric 3D Silicone Relief',
      category: 'work',
      categoryLabel: 'Section Work',
      badge: 'Direct Silicone',
      image: '/images/gallery/gallery_silicone_weld.png',
      specs: 'Direct High-Frequency // Stretch Elastic // Anti-Crack',
      desc: 'Heat-pressed seamless silicone lettering applied directly to technical performance hoodies and compression wear.'
    },

    // ── FACTORY FLOOR & MACHINERY PHOTOS ───────────────────────────────────
    {
      id: 'factory-screen-floor',
      title: 'Main Screen Printing Production Floor',
      category: 'factory',
      categoryLabel: 'Factory Floor',
      badge: 'Floor View 01',
      image: '/images/factory_slide_1.jpg',
      specs: 'Automatic Oval Carousels // In-line Dryers // 50,000+ Daily',
      desc: 'Panoramic view of our primary printing division featuring synchronized automatic carousel machines and infrared conveyor drying tunnels.'
    },
    {
      id: 'factory-sublimation-unit',
      title: 'Sublimation & Heat Transfer Division',
      category: 'factory',
      categoryLabel: 'Factory Floor',
      badge: 'Floor View 02',
      image: '/images/factory_slide_2.jpg',
      specs: 'Calendar Heat Press // Roll Transfer // Temperature Controlled',
      desc: 'Dedicated climate-controlled sublimation and thermal transfer facility producing all-over prints for international sportswear buyers.'
    },
    {
      id: 'factory-embroidery-line',
      title: 'Computerized Multi-Head Embroidery & QC',
      category: 'factory',
      categoryLabel: 'Factory Floor',
      badge: 'Floor View 03',
      image: '/images/factory_slide_3.jpg',
      specs: 'Multi-Head Japanese Machines // 100% Quality Inspection Line',
      desc: 'High-precision embroidery suite coupled with certified quality control checking stations for loose thread removal and AQL inspection.'
    },
    {
      id: 'factory-nxp-weld-line',
      title: 'Roll Calendar Fusing & Finishing Line',
      category: 'factory',
      categoryLabel: 'Factory Floor',
      badge: 'Production Line 04',
      image: '/images/gallery/gallery_nxp_weld_floor.png',
      specs: 'Continuous Roll Calendar // Trained Technicians // 24/7 Operations',
      desc: 'Active floor workers operating continuous textile heat transfer and fusing machines under strict standard operating procedures.'
    },

    // ── PRODUCT SAMPLES & MERCHANDISE ─────────────────────────────────────
    {
      id: 'product-cap-line',
      title: 'Engineered Headwear & Cap Showcase',
      category: 'product',
      categoryLabel: 'Finished Product',
      badge: 'Cap Division',
      image: '/images/gallery/gallery_sonic_weld_cap.png',
      specs: 'Mickey Thompson M/T // Custom Sandwich Visor // Heavy Buckram',
      desc: 'Finished export cap samples highlighting custom sonic welding, structured crown buckram, and contrast eyelet embroidery.'
    },
    {
      id: 'product-apparel-tees',
      title: 'Custom Printed Export T-Shirts & Tops',
      category: 'product',
      categoryLabel: 'Finished Product',
      badge: 'Garment Sample',
      image: '/images/gallery/gallery_screen_printing.png',
      specs: '100% Combed Cotton // Soft-Hand Discharge // Wash Tested',
      desc: 'Retail-ready t-shirts finished with screen-printed chest graphics, heat-sealed neck tags, and individualized polybag packaging.'
    },
    {
      id: 'product-patches-set',
      title: 'Custom Tactical & Streetwear Badges',
      category: 'product',
      categoryLabel: 'Finished Product',
      badge: 'Accessories Sample',
      image: '/images/gallery/gallery_rubber_patch.png',
      specs: 'Assorted Pantone Colors // Heat-Seal Adhesive // Custom Cut',
      desc: 'Assortment of finished rubber and silicone badges packaged for global sportswear labels and domestic garment manufacturers.'
    },
    {
      id: 'product-jersey-line',
      title: 'Full-Coverage Sublimated Team Jerseys',
      category: 'product',
      categoryLabel: 'Finished Product',
      badge: 'Activewear Sample',
      image: '/images/gallery/gallery_sublimation.png',
      specs: 'Micro-Mesh Polyester // Anti-Bacterial // Moisture Wicking',
      desc: 'Export quality sports jerseys featuring vibrant all-over sublimation prints with zero ink stiffness and complete breathability.'
    },
  ];

  const filteredPhotos = activeCategory === 'all'
    ? galleryPhotos
    : galleryPhotos.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0e2a1d] text-white selection:bg-[#df3b28] selection:text-white font-sans antialiased">
      {/* ── 1. TOP CONTACT STRIP ────────────────────────────────────────────── */}
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
          </div>
        </div>
      </div>

      {/* ── 2. MAIN NAVIGATION ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0e2a1d]/95 backdrop-blur-md border-b border-white/10 shadow-lg">
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
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 mr-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#df3b28] text-white font-black text-base shadow-xs">
              Z
            </div>
            <span className="font-black text-sm tracking-tight text-white group-hover:text-emerald-300 transition-colors">
              ZM FactoryOS
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 text-xs font-bold tracking-wider uppercase text-white/80">
            <Link href="/#home" className="hover:text-emerald-300 transition-colors">
              Home
            </Link>
            <Link href="/#about" className="hover:text-emerald-300 transition-colors">
              About Us
            </Link>
            <Link href="/sections" className="hover:text-emerald-300 transition-colors">
              Section
            </Link>
            <Link href="/#products" className="hover:text-emerald-300 transition-colors">
              All Products
            </Link>
            <Link href="/#clients" className="hover:text-emerald-300 transition-colors">
              Clients
            </Link>
            <Link href="/gallery" className="text-emerald-300 font-black border-b-2 border-[#df3b28] pb-0.5">
              Gallery
            </Link>
            <Link href="/#blog" className="hover:text-emerald-300 transition-colors">
              Blog
            </Link>
            <Link href="/#profile" className="hover:text-emerald-300 transition-colors">
              Profile
            </Link>
            <Link href="/#contact" className="hover:text-emerald-300 transition-colors">
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/#inquiry"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-white/10 hover:bg-white/20 text-[11px] font-bold uppercase tracking-wider transition-all border border-white/15 text-white"
            >
              Request a quote
              <ArrowUpRight className="h-3.5 w-3.5 text-[#df3b28]" />
            </Link>

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
          <Link href="/#home">Home</Link>
          <Link href="/#about">About Us</Link>
          <Link href="/#section">Section</Link>
          <Link href="/#products">All Products</Link>
          <Link href="/#clients">Clients</Link>
          <Link href="/gallery" className="text-emerald-300 font-black">Gallery</Link>
          <Link href="/#blog">Blog</Link>
          <Link href="/#profile">Profile</Link>
          <Link href="/#contact">Contact Us</Link>
        </div>
      </header>

      {/* ── 3. HERO BANNER FOR DEDICATED GALLERY PAGE ───────────────────────── */}
      <section className="bg-[#0b2217] py-14 md:py-20 border-b border-white/10 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #34d399 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-white inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Home
            </Link>
            <span>/</span>
            <span className="text-[#df3b28]">Factory Gallery</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white leading-tight">
            Production Finishes & <br />
            <span className="text-emerald-400">Factory Floor Archives</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base sm:text-lg text-emerald-100/80 leading-relaxed">
            Comprehensive photo gallery showcasing section work photos, automatic printing machinery, continuous fusing lines, silicone badges, and export garment merchandise from ZM Printing & Design Ltd.
          </p>

          {/* Quick Counter Badges */}
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xs bg-[#102d1f] border border-white/10 text-emerald-300 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              15+ Production Finishes
            </span>
            <span className="px-3 py-1.5 rounded-xs bg-[#102d1f] border border-white/10 text-white/80">
              Dhaka Industrial Facility
            </span>
            <span className="px-3 py-1.5 rounded-xs bg-[#102d1f] border border-white/10 text-[#df3b28] font-bold">
              Full-Service Since 2008
            </span>
          </div>
        </div>
      </section>

      {/* ── 4. CATEGORY FILTER TABS ─────────────────────────────────────────── */}
      <section className="bg-[#0e2a1d] py-8 border-b border-white/10 sticky top-[61px] z-30 backdrop-blur-md bg-[#0e2a1d]/90">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Photos (15)' },
                { id: 'work', label: 'Section Work Photos' },
                { id: 'factory', label: 'Factory Floor & Machines' },
                { id: 'product', label: 'Product & Merchandise' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-4 py-2 rounded-xs text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-[#df3b28] text-white shadow-sm'
                      : 'bg-[#123625] text-white/70 hover:text-white hover:bg-[#184832] border border-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-emerald-400/80">
              Showing {filteredPhotos.length} Items
            </span>
          </div>
        </div>
      </section>

      {/* ── 5. FULL GALLERY PHOTO GRID ───────────────────────────────────────── */}
      <main className="py-16 md:py-24 bg-[#0a2016]">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group bg-[#102d1f] rounded-sm border border-white/10 hover:border-[#df3b28]/70 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
              >
                {/* Header Badge */}
                <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between bg-[#0e2a1d]/90">
                  <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    {photo.badge}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#df3b28] group-hover:animate-ping" />
                </div>

                {/* Image Container */}
                <div className="relative h-56 bg-[#091b12] overflow-hidden flex items-center justify-center">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/factory_slide_1.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102d1f] via-transparent to-transparent opacity-60 pointer-events-none" />
                  
                  {/* Category Pill Over Image */}
                  <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded-xs bg-[#0e2a1d]/90 border border-white/10 text-[9px] font-mono text-emerald-300 uppercase tracking-widest">
                    {photo.categoryLabel}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-base font-black text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
                      {photo.title}
                    </h3>
                    <p className="mt-2 text-xs text-emerald-100/70 line-clamp-2 leading-relaxed">
                      {photo.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400/80">
                      // CLICK TO ZOOM
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhoto(photo);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#df3b28] group-hover:text-white transition-colors"
                    >
                      <span>Show More</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Callout Banner */}
          <div className="mt-16 p-8 md:p-12 rounded-sm bg-[#102d1f] border border-white/15 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#df3b28]/10 blur-3xl pointer-events-none" />
            
            <div className="max-w-xl">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#df3b28]">
                NEED A CUSTOM SAMPLE OR SPECIFIC TECHNIQUE?
              </span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
                Get factory-direct pricing for your apparel line.
              </h3>
              <p className="mt-2 text-sm text-emerald-100/75">
                Send your vector artwork and target quantities. We formulate inks, create precision screens and molds, and provide sample turnarounds in 48 hours.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/#inquiry"
                className="px-6 py-3.5 rounded-sm bg-[#df3b28] hover:bg-[#c93220] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
              >
                <span>Start an Inquiry</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#home"
                className="px-5 py-3.5 rounded-sm border border-white/20 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ── 6. LIGHTBOX DETAIL MODAL ────────────────────────────────────────── */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#0e2a1d] border-2 border-emerald-500/30 rounded-sm shadow-2xl overflow-hidden text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#123625]">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-[#df3b28]" />
                <span className="font-mono text-xs uppercase tracking-widest text-emerald-300">
                  {selectedPhoto.badge}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-1 rounded-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div className="w-full h-72 sm:h-80 bg-[#091b12] rounded-sm overflow-hidden border border-white/15 mb-6 flex items-center justify-center">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/factory_slide_1.jpg';
                  }}
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">
                <span>{selectedPhoto.categoryLabel}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {selectedPhoto.title}
              </h3>

              <div className="mt-3 inline-block px-3 py-1 rounded-xs bg-emerald-950/80 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                {selectedPhoto.specs}
              </div>

              <p className="mt-4 text-sm text-emerald-100/85 leading-relaxed">
                {selectedPhoto.desc}
              </p>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs font-mono text-emerald-400/80">
                  ZM Printing & Design Ltd. // Factory Floor Spec
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(null)}
                    className="px-4 py-2 rounded-xs border border-white/20 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <Link
                    href="/#inquiry"
                    onClick={() => setSelectedPhoto(null)}
                    className="px-5 py-2 rounded-xs bg-[#df3b28] hover:bg-[#c93220] text-xs font-black uppercase tracking-wider text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Inquire for this Finish</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. FOOTER (FROM FACTORY WEBSITE) ───────────────────────────────── */}
      <PublicFooter />
    </div>
  );
}
