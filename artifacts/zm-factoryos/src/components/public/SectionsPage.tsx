import React, { useState, useMemo } from 'react';
import { Link } from 'wouter';
import {
  ArrowUpRight, ArrowRight, ArrowLeft, Phone, Mail, Lock, CheckCircle2,
  Layers, Factory, Sparkles, ShieldCheck, ChevronRight, Cpu, Scissors,
  Flame, Gauge, RefreshCw, FileText, Check, ExternalLink, Search,
  Shirt, Eye, Award, Clock3, Zap, CheckCircle, X, SlidersHorizontal,
  Workflow, Building2, HelpCircle
} from 'lucide-react';
import { useGetCurrentUser } from '@workspace/api-client-react';
import { PublicFooter } from '@/components/public/PublicFooter';

export interface FactorySectionDetail {
  id: string;
  code: string;
  badge: string;
  title: string;
  category: 'printing' | 'silicone' | 'sublimation' | 'dtf' | 'sonic' | 'qc';
  categoryLabel: string;
  tagline: string;
  overview: string;
  dailyCapacity: string;
  turnaround: string;
  leadTime: string;
  minOrder: string;
  image: string;
  accentColor: string;
  posterOverlay: {
    word: string;
    sub: string;
    themeColor: string;
    badgeStyle: string;
  };
  worksDone: {
    name: string;
    desc: string;
    highlight?: string;
    specMetric?: string;
  }[];
  machinery: string[];
  materialsSupported: string[];
  qualityChecks: string[];
  certifications: string[];
}

export const FACTORY_SECTIONS: FactorySectionDetail[] = [
  {
    id: 'silk-screen',
    code: 'SEC-01',
    badge: 'High Volume Production',
    title: 'Silk Screen Printing Division',
    category: 'printing',
    categoryLabel: 'Screen Print',
    accentColor: '#df3b28',
    tagline: 'High-speed automatic oval carousels for premium export apparel embellishments.',
    overview: 'Equipped with synchronized multi-color automatic oval carousels and conveyor drying tunnels. Specially engineered for massive volume export runs with microscopic color registration, flawless batch-to-batch consistency, and superior hand-feel.',
    dailyCapacity: '35,000 - 50,000 Pcs / Day',
    turnaround: '24 - 48 Hours for Sampling',
    leadTime: '3 - 5 Days for Bulk Order',
    minOrder: '500 Pcs per Colorway',
    image: '/images/gallery/gallery_screen_printing.png',
    posterOverlay: {
      word: 'PRINTING',
      sub: '01 / INK & MESH // FORM',
      themeColor: '#df3b28',
      badgeStyle: 'bg-[#df3b28] text-white',
    },
    worksDone: [
      {
        name: 'Plastisol Printing (High Opacity)',
        desc: 'Vibrant, thick-film ink with high opacity on dark cotton & polyester blends. Highly flexible and resistant to wash cracking.',
        highlight: 'Standard & Soft-Hand Formulations',
        specMetric: 'Wash Life: 50+ Cycles'
      },
      {
        name: 'Eco-Friendly Waterbase & Pigment',
        desc: 'Breathable inks that soak directly into fabric fibers with zero hand-feel stiffness. 100% skin-safe and OEKO-TEX certified.',
        highlight: '100% Breathable & Eco-Friendly',
        specMetric: 'Zero Hand-Feel Softness'
      },
      {
        name: 'Discharge Printing (Dark Cotton)',
        desc: 'Chemically strips existing fabric dye and deposits custom pigments into the yarn, resulting in ultra-soft vintage textures.',
        highlight: 'Vintage & Zero-Stiffness Finish',
        specMetric: 'Bleed-Free Molecular Dye'
      },
      {
        name: '3D High-Density & Puff Expansion',
        desc: 'Raised architectural 3D tactile typography with sharp beveled edges or foam-activated puff expansion creating bold dimensional pop.',
        highlight: 'Sharply Beveled 3D Edges',
        specMetric: 'Up to 2.5mm 3D Height'
      },
      {
        name: 'Metallic Gold, Silver & Glitter Foil',
        desc: 'Reflective metallic flakes and heat-pressed hot-stamping foils providing radiant luxury finishes for high-end fashion wear.',
        highlight: 'Mirror & Shimmer Effect',
        specMetric: 'High-Lustre Mirror Finish'
      },
      {
        name: 'Photo-Realistic CMYK Process Print',
        desc: 'Simulated process and 4-color halftone printing for photorealistic portraits, continuous gradients, and fine artistic illustration.',
        highlight: 'Micro-Dot Halftone Precision',
        specMetric: '65 LPI Micro Halftones'
      },
      {
        name: 'Glow-in-the-Dark & Photochromic',
        desc: 'Phosphorescent pigments charging under ambient light and glowing intensely in dark settings for athletic and streetwear.',
        highlight: 'Safety & Streetwear Application',
        specMetric: 'Long-Duration Luminescence'
      },
      {
        name: 'Reflective Safety & High-Vis Inks',
        desc: 'Micro-glass sphere inks returning direct light beams for athletic night running gear and certified industrial protective workwear.',
        highlight: 'EN ISO 20471 Compliant',
        specMetric: 'High-Retroreflection Class'
      }
    ],
    machinery: [
      'Automatic Oval Screen Printing Carousels (16-Palette, 12-Color Sync)',
      'Infrared & Gas Conveyor Curing Tunnels (8-Meter Multi-Zone Heat)',
      'Pneumatic Flash Cure Dryers with Optical Sensors',
      'Computer-to-Screen (CTS) Direct UV Laser Exposure Unit',
      'Swiss Precision Squeegee Sharpeners & Tension Gauge Meters'
    ],
    materialsSupported: [
      '100% Combed Cotton Single Jersey',
      'CVC & TC Blends (Polyester / Cotton)',
      'Heavyweight 400+ GSM French Terry & Fleece',
      'Rib Knit, Pique & Interlock Active Knits',
      'Organic Cotton & Modal Blends'
    ],
    qualityChecks: [
      '40°C Standard Industrial Wash Fastness (ISO 105-C06)',
      'Crockmeter Dry & Wet Friction Rub Testing (ISO 105-X12)',
      'Stretch & Elongation Recovery Crack Analysis',
      'X-Rite Spectrophotometer Delta-E Color Accuracy'
    ],
    certifications: ['OEKO-TEX Standard 100', 'GOTS Approved Chemical Formulations', 'ZDHC Level 3 Compliant']
  },
  {
    id: 'silicone-3d',
    code: 'SEC-02',
    badge: 'Tactile Luxury & Activewear',
    title: '3D High-Density & Silicone Unit',
    category: 'silicone',
    categoryLabel: 'Silicone & 3D',
    accentColor: '#f59e0b',
    tagline: 'Embossed rubber badges, razor-sharp silicone lettering, and technical activewear patches.',
    overview: 'Specialized clean-room molding unit utilizing high-grade Liquid Silicone Rubber (LSR). Engineered for supreme stretch rebound, extreme thermal resistance, and velvety luxury tactile relief.',
    dailyCapacity: '18,000 - 25,000 Badges & Prints / Day',
    turnaround: '48 Hours for Steel / Brass Mold Sampling',
    leadTime: '4 - 6 Days for Mass Production',
    minOrder: '300 Pcs',
    image: '/images/gallery/gallery_silicone_active.jpg',
    posterOverlay: {
      word: 'SILICON',
      sub: '02 / TACTILE RELIEF // 3D EMBOSS',
      themeColor: '#f59e0b',
      badgeStyle: 'bg-[#f59e0b] text-black font-black',
    },
    worksDone: [
      {
        name: 'Direct-to-Fabric 3D Silicone Lettering',
        desc: 'Liquid silicone directly vulcanized onto technical compression fabrics and hoodies with razor-sharp 1mm to 3mm vertical relief.',
        highlight: 'Zero Cracking on 300% Stretch',
        specMetric: '300% Stretch Elasticity'
      },
      {
        name: 'Multi-Tiered Silicone Badges & Emblems',
        desc: 'Custom CNC-molded multi-level silicone emblems with perimeter stitch channels or thermo-adhesive backings for outerwear jackets.',
        highlight: 'Multi-Color Precision Infill',
        specMetric: 'Multi-Level 3D Depth'
      },
      {
        name: 'Heat-Transfer Silicone Labels',
        desc: 'Pre-cured silicone lettering on release carrier films ready for instant heat bonding with velvet-matte anti-slip surface touch.',
        highlight: 'Skin-Friendly Hypoallergenic',
        specMetric: 'Velvet Soft-Touch Finish'
      },
      {
        name: 'Anti-Slip Silicone Grippers for Activewear',
        desc: 'Hexagonal, wave, or custom branded silicone micro-dots applied to waistband elastics, technical socks, and cycling shorts.',
        highlight: 'High Friction Grip & Wash-Proof',
        specMetric: 'Anti-Slip Micro Grip'
      },
      {
        name: 'Embossed High-Density TPU Patches',
        desc: 'Thermo-formed thermoplastic polyurethane emblems featuring metallic accents, matte textures, and deep 3D structural bevels.',
        highlight: 'Rugged Wear for Outerwear & Caps',
        specMetric: 'Impact & Abrasion Proof'
      },
      {
        name: 'Micro-Injected Soft PVC Rubber Labels',
        desc: 'Flexible rubber badges with deep debossed and embossed lines, ideal for backpacks, denim jeans, and footwear tongues.',
        highlight: 'Weatherproof & UV Resistant',
        specMetric: 'All-Weather Waterproof'
      }
    ],
    machinery: [
      'High-Precision CNC Steel & Brass Mold Engraving Centers',
      'Multi-Station Automatic Liquid Silicone Dispensing Systems',
      'Dual-Platen Hydraulic Hot & Cold Press Vulcanizers (200 Bar Pressure)',
      'Vacuum Degassing Chambers for Bubble-Free Clear Formulations',
      'Continuous Tunnel Cooling & Post-Cure Stations'
    ],
    materialsSupported: [
      'Spandex & Lycra Performance Compression Knit',
      'Polyester Dry-Fit & Micro-Mesh Activewear',
      'Nylon Supplex & Taslan Technical Outerwear',
      'Heavy Cotton Twill & Canvas Shells',
      'Neoprene & Technical Bonded Fleece'
    ],
    qualityChecks: [
      'Bond Peel Strength Adhesion Test (ASTM D903)',
      '60°C Heavy Wash & Tumble Dry Delamination Check',
      'Elongation to Break Rebound Test (> 400% Elasticity)',
      'Anti-Tack & Skin Contact Hypoallergenic Certification'
    ],
    certifications: ['OEKO-TEX Class I (Safe for Infants)', 'REACH SVHC Compliant', 'RoHS Certified Inks']
  },
  {
    id: 'sublimation',
    code: 'SEC-03',
    badge: 'Full Fabric All-Over Coverage',
    title: 'Dye Sublimation & Heat Transfer Line',
    category: 'sublimation',
    categoryLabel: 'Dye Sublimation',
    accentColor: '#06b6d4',
    tagline: 'High-speed calendar roll presses for seamless all-over jersey printing and vibrant teamwear.',
    overview: 'Industrial wide-format disperse dye printing suites coupled with oil-heated continuous rotary calendar roll presses. Molecularly fuses vibrant pigment vapors into polyester fibers at 210°C.',
    dailyCapacity: '15,000 - 20,000 Yards & Panels / Day',
    turnaround: '24 Hours for Color Proof Strike-Off',
    leadTime: '2 - 4 Days for Full Production Runs',
    minOrder: '100 Pcs / 150 Yards',
    image: '/images/gallery/gallery_sublimation_line.jpg',
    posterOverlay: {
      word: 'SUBLIMATION',
      sub: '03 / VIBRANT CMYK // CONTINUOUS PRESS',
      themeColor: '#06b6d4',
      badgeStyle: 'bg-[#06b6d4] text-black font-black',
    },
    worksDone: [
      {
        name: 'All-Over Roll-to-Roll Fabric Sublimation',
        desc: 'Continuous textile printing on rolls of polyester fabric for custom geometric patterns, swimwear, flags, and sportswear.',
        highlight: 'Seamless Infinite Pattern Repeat',
        specMetric: '1.8M Wide Continuous Roll'
      },
      {
        name: 'Cut-Piece Panel Sports Jersey Printing',
        desc: 'Piece-by-piece sublimation matching front, back, and sleeve seam alignments for soccer, cricket, basketball, and cycling.',
        highlight: 'Perfect Edge-to-Edge Bleed',
        specMetric: 'Precision Seam Alignment'
      },
      {
        name: 'Fluorescent Neon & Hi-Vis Sublimation',
        desc: 'High-chroma neon yellow, neon pink, and electric cyan inks generating show-stopping luminance under direct UV light.',
        highlight: 'Extreme Color Gamut & Brilliance',
        specMetric: 'High-Chroma Neon Gamut'
      },
      {
        name: 'Lanyard & Ribbon Heat Transfer Printing',
        desc: 'Double-sided satin polyester tape sublimation with micro-lettering and logo clarity for corporate IDs and accessories.',
        highlight: 'Double-Sided Synchronization',
        specMetric: 'Two-Sided Registration'
      },
      {
        name: 'Sublimated Heat-Seal Fabric Patches',
        desc: 'Laser-cut or merrowed edge fabric patches featuring photographic artwork backed with heavy thermo-adhesive film.',
        highlight: 'Overlocked & Laser Sealing',
        specMetric: 'Clean Sealed Edges'
      }
    ],
    machinery: [
      'Monti Antonio Continuous Oil-Drum Rotary Calendar Heat Presses (1.8M Width)',
      'High-Speed Multi-Head Industrial Dye Sublimation Printers (300 sqm/hr)',
      'Automated Tension-Controlled Roll Rewinding & Unwinding Units',
      'Dual-Bed Flatbed Pneumatic Large-Format Heat Presses (120 x 100 cm)'
    ],
    materialsSupported: [
      '100% Polyester Micro-Interlock & Birds-Eye Mesh',
      'Polyester / Spandex 4-Way Stretch Lycra',
      'Polyester Satin & Twill Weaves',
      'Fleece & Brushed Tricot Sports Fabrics',
      'Recycled Poly (rPET) Sustainable Yarns'
    ],
    qualityChecks: [
      'Spectrophotometer Color Gamut Verification',
      'Color Fastness to Perspiration (ISO 105-E04)',
      'Color Fastness to Washing at 60°C (ISO 105-C06)',
      'Zero Ink Migration / Gas Bleed Stability Testing'
    ],
    certifications: ['OEKO-TEX Standard 100', 'Bluesign Certified Sublimation Dyes', 'Global Recycled Standard (GRS)']
  },
  {
    id: 'dtf-transfer',
    code: 'SEC-04',
    badge: 'Micro-Resolution & Multi-Color',
    title: 'Digital Heat Transfer / DTF Section',
    category: 'dtf',
    categoryLabel: 'DTF Printing',
    accentColor: '#10b981',
    tagline: 'Direct-to-Film digital technology for ultra-fine gradients, neck tags, and small run flexibility.',
    overview: 'Advanced Japanese 4-head DTF printing lines with automated powder shaker and infrared curing tunnels. Renders 1200 DPI photorealistic artwork with stretchable white backing on any fabric base.',
    dailyCapacity: '25,000 - 35,000 Transfer Prints / Day',
    turnaround: 'Same-Day Sampling (12 - 24 Hours)',
    leadTime: '2 - 3 Days for Production Runs',
    minOrder: '50 Pcs (Low Minimum Available)',
    image: '/images/gallery/gallery_rubber_patch.png',
    posterOverlay: {
      word: 'DTF',
      sub: '04 / HIGH-RES FILM // HOT PEEL',
      themeColor: '#10b981',
      badgeStyle: 'bg-[#10b981] text-black font-black',
    },
    worksDone: [
      {
        name: 'Photorealistic Multi-Color DTF Transfers',
        desc: 'Full-color continuous tones with smooth drop-shadows, smoke effects, and photographic fidelity on cotton, fleece, and poly.',
        highlight: '1200 DPI Micro-Detail Fidelity',
        specMetric: '1200 x 2400 DPI Resolution'
      },
      {
        name: 'Tagless Care & Size Neck Labels',
        desc: 'Crisp 4pt micro-text care labels with skin-soft thermo adhesive, replacing scratchy woven labels on premium t-shirts.',
        highlight: 'Skin-Soft & Scratch-Free',
        specMetric: 'Micro-Font Legibility'
      },
      {
        name: 'High-Elasticity Athletic DTF Transfers',
        desc: 'Engineered with specialized polyurethane powder that stretches alongside compression fabrics without cracking or tearing.',
        highlight: 'Recovers Without Hairline Cracks',
        specMetric: 'Flexible Stretch Polyurethane'
      },
      {
        name: 'Reflective & Metallic Sparkle DTF',
        desc: 'Specialized transfer films embedded with reflective or glitter pigments underneath the digital CMYK ink layer.',
        highlight: 'Luminous Reflective Sparkle',
        specMetric: 'Glitter & Reflective Base'
      },
      {
        name: 'Cap, Bag & Footwear Ready Heat Transfers',
        desc: 'Pre-cut transfer sheets designed for rapid positioning on curved panels, heavy canvas bags, and sneaker uppers.',
        highlight: 'Curves & Seam Versatility',
        specMetric: 'Multi-Surface Adhesion'
      }
    ],
    machinery: [
      'EPSON I3200 4-Head High-Precision Industrial DTF Printers',
      'Automated Hot-Melt Powder Applicator & Recirculating Tunnel Curer',
      'Pneumatic Double-Station Membrane Heat Presses with Auto-Timer',
      'Precision Camera-Guided Flatbed Vinyl & Film Contour Cutters'
    ],
    materialsSupported: [
      '100% Cotton, Poly-Cotton Blends',
      '100% Polyester & Nylon Shells',
      'Canvas, Denim & Heavy Twill',
      'Cordura & Heavy Oxford Bags',
      'Leather & Synthetic Suede Panels'
    ],
    qualityChecks: [
      '50-Cycle Commercial Wash Endurance Audit',
      'Tensile Stretch Recovery Test to 250%',
      'Curing Oven Temperature Pyrometer Profiling',
      'Adhesive Peel Strength Standard (FTM 1)'
    ],
    certifications: ['OEKO-TEX Eco-Passport Certified Ink', 'CPSIA Safety Lead-Free', 'REACH Compliant']
  },
  {
    id: 'sonic-weld',
    code: 'SEC-05',
    badge: 'Ultrasonic High Frequency',
    title: 'Sonic Weld & Ultrasonic Bonding Unit',
    category: 'sonic',
    categoryLabel: 'Sonic Weld',
    accentColor: '#38bdf8',
    tagline: 'Acoustic molecular fusion for seamless waterproof construction, bonded badges, and caps.',
    overview: 'Utilizes high-frequency acoustic sound waves (20 kHz - 35 kHz) to melt and molecularly fuse thermoplastic films and synthetic fabrics together without needle puncture holes or thread.',
    dailyCapacity: '12,000 - 18,000 Units / Day',
    turnaround: '48 Hours for Ultrasonic Horn Tooling',
    leadTime: '3 - 5 Days Bulk Delivery',
    minOrder: '300 Pcs',
    image: '/images/gallery/gallery_sonic_weld_cap.png',
    posterOverlay: {
      word: 'SONIC',
      sub: '05 / ULTRASONIC FUSION // SEAMLESS',
      themeColor: '#38bdf8',
      badgeStyle: 'bg-[#38bdf8] text-black font-black',
    },
    worksDone: [
      {
        name: 'Ultrasonic Headwear & Cap Badging',
        desc: 'High-frequency welding of raised emblems and silicone badges directly onto structured cap buckram and front panels.',
        highlight: 'Zero Stitch Holes on Crown',
        specMetric: 'Permanent Acoustic Weld'
      },
      {
        name: 'Seamless Bonded Pocket Welds',
        desc: 'Fusing waterproof zipper tapes and storm pocket welts directly into technical shells for outdoor, ski, and rain jackets.',
        highlight: '100% Waterproof Sealing',
        specMetric: '10,000mm Hydrostatic Seal'
      },
      {
        name: 'High-Frequency Debossed Vinyl Emblems',
        desc: 'Multi-layer vinyl welded with heat and ultrasonic pressure, producing sharp metallic or matte relief with clean border cuts.',
        highlight: 'Sharply Cut Outer Contours',
        specMetric: 'Crisp Beveled Edges'
      },
      {
        name: 'Laser-Cut & Sonic Sealed Edge Trims',
        desc: 'Simultaneous cutting and acoustic sealing of synthetic ribbon edges preventing rough yarn fraying and unraveling.',
        highlight: 'Anti-Fraying Ultra-Clean Edges',
        specMetric: 'Zero Fiber Fraying'
      },
      {
        name: 'Reflective Safety Heat-Welded Tapes',
        desc: 'Sonic-bonded segmented silver reflective strips on workwear jerseys and safety vests with supreme industrial wash life.',
        highlight: 'Segmented Stretch Flex',
        specMetric: 'Class 2 Retroreflective'
      }
    ],
    machinery: [
      'High-Frequency Ultrasonic Welding Horn Stations (20kHz & 35kHz)',
      'Automated Rotary Sonic Sealing & Hemming Machines',
      'Pneumatic Multi-Station Hot-Air Seam Sealing Presses',
      'Precision Laser Cutting & Edge-Fusion Plotters'
    ],
    materialsSupported: [
      'Nylon Ripstop & PU-Coated Shells',
      'Polyester Fleece & Bonded Softshell',
      'Thermoplastic Films (TPU, PVC, EVA)',
      'Heavy Cotton/Poly Twill for Caps',
      'Reflective Micro-Prismatic Tapes'
    ],
    qualityChecks: [
      'Hydrostatic Head Waterproof Pressure Test (EN 20811)',
      'Acoustic Weld Delamination Shear Strength Check',
      'Flex Testing under Cold Temperatures (-20°C)',
      'High-Frequency Seam Micro-Inspection'
    ],
    certifications: ['ISO 9001 Quality Certified', 'EN 343 Waterproof Compliant', 'OEKO-TEX Standard 100']
  },
  {
    id: 'qc-finishing',
    code: 'SEC-06',
    badge: '100% Quality Assurance',
    title: 'Quality Control, Testing & Packaging',
    category: 'qc',
    categoryLabel: 'QC & Finishing',
    accentColor: '#34d399',
    tagline: 'In-line AQL 1.5 audits, 40°C wash durability testing, steam ironing, and export carton packing.',
    overview: 'Guarantees that zero defective pieces leave the factory floor. Every garment undergoes intensive inspections, wash and rub stress testing, barcode scan verification, and export carton packaging.',
    dailyCapacity: '40,000 - 60,000 Finished Units / Day',
    turnaround: 'Continuous In-Line & Final Batch Auditing',
    leadTime: 'Immediate Line Clearance',
    minOrder: 'Applies to 100% of Factory Production',
    image: '/images/factory_slide_3.jpg',
    posterOverlay: {
      word: 'QC & FINISH',
      sub: '06 / AQL 1.5 // 100% INSPECTION',
      themeColor: '#34d399',
      badgeStyle: 'bg-[#34d399] text-[#0e2a1d] font-black',
    },
    worksDone: [
      {
        name: '100% In-Line & End-of-Line Visual Inspection',
        desc: 'Trained auditors checking print alignment, pinholes, color consistency, and fabric defects on calibrated light tables.',
        highlight: 'AQL 1.5 Strict Industrial Standard',
        specMetric: 'Zero Visual Defect Target'
      },
      {
        name: 'Internal Lab Wash & Crocker Rub Durability Tests',
        desc: 'Accelerated washing machines testing ink cracking, hand-feel stiffness, and wet/dry pigment rub transfer.',
        highlight: 'Passed ISO 105 & AATCC Protocols',
        specMetric: 'Grade 4-5 Color Fastness'
      },
      {
        name: 'Industrial Steam Finishing & Thread Trimming',
        desc: 'High-pressure vacuum steam tables flattening wrinkles and vacuuming loose fibers for presentation-ready garments.',
        highlight: 'Pristine Shelf-Ready Appearance',
        specMetric: 'Vacuum De-Wrinkling'
      },
      {
        name: 'Barcode Hangtagging & Security RF Tag Insertion',
        desc: 'Accurate kimble gun attachment of price tickets, care labels, size stickers, and RFID inventory tags.',
        highlight: 'Zero Barcode Mismatch Guarantee',
        specMetric: '100% Barcode Verified'
      },
      {
        name: 'Individual Poly Bagging & Export Master Carton Packing',
        desc: 'Automated folding and polybag sealing with desiccant silica packs and heavy double-wall 7-ply corrugated export cartons.',
        highlight: 'Export Ready for Sea & Air Freight',
        specMetric: '7-Ply Sea Worthy Cartons'
      }
    ],
    machinery: [
      'Heavy-Duty Industrial Vacuum Steam Tables & Steam Boilers',
      'Electronic Crocker Rub Friction Testers',
      'Standardized Accelerated Laboratory Washing Machines & Tumble Dryers',
      'High-Sensitivity Needle & Metal Detectors (Lock & Hashima)',
      'Automated Garment Folding & Poly-Bag Sealing Conveyors'
    ],
    materialsSupported: ['All Finished Garments & Activewear Lines'],
    qualityChecks: [
      'AQL 1.5 Standard Audit Protocol',
      'Needle Detector 1.0mm Ferrous Sphere Certification',
      'Carton Drop Test & Barcode Verifier Scan',
      'Moisture Content Inspection (< 10%)'
    ],
    certifications: ['AQL 1.5 Standard', 'ISO 9001:2015 QA Certified', 'Sedex Smeta Audited Packaging']
  }
];

export function SectionsPage() {
  const { data: user } = useGetCurrentUser();
  const [selectedSectionId, setSelectedSectionId] = useState<string>('silk-screen');
  const [activeViewTab, setActiveViewTab] = useState<'works' | 'machinery' | 'materials' | 'testing'>('works');

  const activeSection = useMemo(() => {
    return FACTORY_SECTIONS.find(s => s.id === selectedSectionId) || FACTORY_SECTIONS[0];
  }, [selectedSectionId]);

  return (
    <div className="min-h-screen bg-[#07160f] text-white selection:bg-[#df3b28] selection:text-white font-sans antialiased">
      {/* ── 1. TOP CONTACT & DIRECTORY STRIP ─────────────────────────────────── */}
      <div className="bg-[#bee7d2] text-[#0e2a1d] py-2 px-6 md:px-10 border-b border-[#0e2a1d]/15 text-xs">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-xs bg-[#df3b28] text-white font-black text-xs shadow-xs">
              ZM
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-[#0e2a1d]">
                ZM Printing & Design Ltd.
              </span>
              <span className="hidden sm:inline text-[11px] text-[#0e2a1d]/80 ml-2 font-semibold">
                // Official Factory Production Sections & Specialized Works Directory
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-emerald-800" />
              <span>Plant Hotlines:</span>
              <a href="tel:+8801818724417" className="font-bold hover:text-[#df3b28]">+88 01818724417</a>
              <span className="text-[#0e2a1d]/40">/</span>
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
      <header className="sticky top-0 z-40 bg-[#0a2016]/95 backdrop-blur-md border-b border-white/10 shadow-xl">
        {user && (
          <div className="bg-[#133c2a] border-b border-emerald-500/20 px-6 py-1.5 text-center text-xs text-emerald-300 flex items-center justify-center gap-2">
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

          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold tracking-wider uppercase text-white/80">
            <Link href="/" className="hover:text-emerald-300 transition-colors">
              Home
            </Link>
            <Link href="/#about" className="hover:text-emerald-300 transition-colors">
              About Us
            </Link>
            <Link href="/sections" className="text-emerald-400 border-b-2 border-[#df3b28] pb-1">
              Section
            </Link>
            <Link href="/#products" className="hover:text-emerald-300 transition-colors">
              All Products
            </Link>
            <Link href="/#clients" className="hover:text-emerald-300 transition-colors">
              Clients
            </Link>
            <Link href="/gallery" className="hover:text-emerald-300 transition-colors">
              Gallery
            </Link>
            <Link href="/#contact" className="hover:text-emerald-300 transition-colors">
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-white/10 hover:bg-white/20 text-[11px] font-bold uppercase tracking-wider transition-all border border-white/15 text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#df3b28]" />
              Back to Home
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
      </header>

      {/* ── 3. HERO SECTION (BIGGER & MORE BEAUTIFUL TYPOGRAPHY) ─────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0e2e20] via-[#092217] to-[#07160f] py-14 sm:py-20 md:py-24 border-b border-white/10">
        {/* Luminous ambient background lighting */}
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#df3b28]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          <div className="max-w-4xl">
            
            {/* Top Industrial Terminal Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xs bg-[#0f3423] border border-emerald-400/35 text-emerald-300 text-xs font-mono tracking-wider mb-5 shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#df3b28] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#df3b28]" />
              </span>
              <span className="font-bold">// OFFICIAL FACTORY DIRECTORY • 6 ACTIVE PRODUCTION DIVISIONS</span>
            </div>

            {/* Massive Bold Heading with Gradient Accents */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-[0.96] text-white">
              <span className="block text-white drop-shadow-sm">
                Factory Sections
              </span>
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-[#bee7d2] via-[#6ee7b7] to-[#10b981] bg-clip-text text-transparent drop-shadow-sm">
                & Specialized Works
              </span>
            </h1>

            {/* Clear, refined subtitle */}
            <p className="mt-6 text-sm sm:text-base md:text-lg text-emerald-100/85 leading-relaxed max-w-2xl font-medium">
              Explore real industrial plant capabilities, specialized embellishment techniques, deployed automated machinery, and international laboratory testing standards.
            </p>

            {/* Luminous Spec Chips */}
            <div className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#0a2317] border border-emerald-500/25 text-emerald-300 font-semibold shadow-xs">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>6 Active Divisions</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#0a2317] border border-emerald-500/25 text-emerald-300 font-semibold shadow-xs">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>120,000+ Pcs / Day Capacity</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#0a2317] border border-emerald-500/25 text-emerald-300 font-semibold shadow-xs">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>24 - 48h Rapid Sampling</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#0a2317] border border-[#df3b28]/30 text-white font-semibold shadow-xs">
                <CheckCircle className="h-3.5 w-3.5 text-[#df3b28]" />
                <span>AQL 1.5 Export Standard</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. MAIN SECTIONS DIRECTORY & DETAILED VIEW ────────────────────── */}
      <section className="py-10 md:py-16 bg-[#07160f]">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          
          {/* ── A. TOP: SELECT SECTION TO VIEW WORKS (4 by 4 GRID) ─────────── */}
          <div className="mb-14">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                  <Building2 className="h-4 w-4 text-[#df3b28]" />
                  <span className="uppercase tracking-widest font-bold">DIRECTORY SELECTION</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                  Select Section To View Works ({FACTORY_SECTIONS.length})
                </h2>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  Click any department card below to inspect its full specialized works, machine equipment, and production parameters.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-white/60 bg-[#0c2419] px-3 py-1.5 rounded-xs border border-white/10 shrink-0">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Selected: <strong className="text-[#df3b28] uppercase">{activeSection.code} - {activeSection.title}</strong></span>
              </div>
            </div>

            {/* 3-Column Grid for 6 sections (2 balanced rows of 3) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FACTORY_SECTIONS.map(sec => {
                const isSelected = sec.id === selectedSectionId;
                return (
                  <div
                    key={sec.id}
                    onClick={() => {
                      setSelectedSectionId(sec.id);
                      const el = document.getElementById('active-section-detail');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`cursor-pointer rounded-sm border p-4 transition-all relative overflow-hidden group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#123625] border-emerald-400 ring-2 ring-[#df3b28]/60 shadow-2xl scale-[1.02]'
                        : 'bg-[#0c2419] border-white/10 hover:border-emerald-400/40 hover:bg-[#0f2c1f] hover:shadow-lg'
                    }`}
                  >
                    {/* Top Selection Accent Indicator */}
                    {isSelected && (
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#df3b28]" />
                    )}

                    <div>
                      {/* Code, Category & Poster Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span className="font-black px-2 py-0.5 rounded-xs bg-black/50 text-[#df3b28] border border-white/10">
                            {sec.code}
                          </span>
                          <span className="text-white/30 text-[10px]">•</span>
                          <span className="text-emerald-300 text-[10px] font-semibold uppercase">
                            {sec.categoryLabel}
                          </span>
                        </div>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-xs ${sec.posterOverlay.badgeStyle}`}>
                          {sec.posterOverlay.word}
                        </span>
                      </div>

                      {/* Photo Thumbnail */}
                      <div className="relative h-28 w-full rounded-xs overflow-hidden border border-white/10 mb-3 bg-black/40">
                        <img
                          src={sec.image}
                          alt={sec.title}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2">
                          <span className="text-[10px] font-mono font-bold text-white/90">
                            {sec.dailyCapacity.split('/')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className={`text-base font-black tracking-tight leading-snug mb-2 ${
                        isSelected ? 'text-white' : 'text-white/90 group-hover:text-emerald-300'
                      }`}>
                        {sec.title}
                      </h3>

                      {/* Tagline */}
                      <p className="text-[11px] text-emerald-100/70 line-clamp-2 leading-relaxed mb-3">
                        {sec.tagline}
                      </p>
                    </div>

                    {/* Footer Strip */}
                    <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-emerald-100/75">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-emerald-400" />
                        <span>{sec.worksDone.length} Specialized Works</span>
                      </span>
                      <span className={`font-bold flex items-center gap-1 ${
                        isSelected ? 'text-[#df3b28]' : 'text-emerald-400 group-hover:text-emerald-300'
                      }`}>
                        <span className="text-[10px] uppercase">
                          {isSelected ? 'Viewing' : 'Inspect'}
                        </span>
                        <ChevronRight className={`h-3 w-3 ${isSelected ? 'translate-x-0.5 text-[#df3b28]' : 'group-hover:translate-x-0.5'}`} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* ── B. BOTTOM: VIEW SECTION TA ADD KORO BORO KORE ───────────────── */}
          <div id="active-section-detail" className="w-full bg-[#0b2216] border border-white/15 rounded-sm p-6 sm:p-10 shadow-2xl space-y-10 scroll-mt-24">
            
            {/* Header / Active Indicator Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-xs bg-[#df3b28]" />
                <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-emerald-300 font-bold">
                  // DETAILED SECTION WORKSPACE & PRODUCTION SPECIFICATIONS
                </span>
              </div>
              <span className="text-xs font-mono text-white/50 bg-black/40 px-2.5 py-0.5 rounded-xs border border-white/10">
                {activeSection.code} ACTIVE
              </span>
            </div>

            {/* 1. Grand Hero Banner with Photo Preview */}
            <div className="relative overflow-hidden rounded-sm border border-white/10 bg-[#081b12] p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Text & Details (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-black text-[#df3b28] bg-black/60 px-3 py-1 rounded-xs border border-white/10">
                      {activeSection.code}
                    </span>
                    <span className="font-mono text-xs text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-xs border border-emerald-500/25 font-bold">
                      {activeSection.badge}
                    </span>
                    <span className="text-xs text-white/50 font-mono">
                      // {activeSection.categoryLabel}
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-tight">
                    {activeSection.title}
                  </h2>
                  
                  <p className="text-sm sm:text-base text-emerald-100/85 leading-relaxed">
                    {activeSection.overview}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="bg-white/5 text-emerald-300 border border-white/10 px-2.5 py-1 rounded-xs">
                      Export Grade Tolerances
                    </span>
                    <span className="bg-white/5 text-emerald-300 border border-white/10 px-2.5 py-1 rounded-xs">
                      Continuous Quality Audits
                    </span>
                    <span className="bg-white/5 text-emerald-300 border border-white/10 px-2.5 py-1 rounded-xs">
                      Rapid Strike-Off Available
                    </span>
                  </div>
                </div>

                {/* Right Large Photo Frame (5 cols) */}
                <div className="lg:col-span-5 shrink-0">
                  <div className="relative rounded-sm overflow-hidden border border-white/20 shadow-2xl group">
                    <img
                      src={activeSection.image}
                      alt={activeSection.title}
                      className="w-full h-56 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-black text-white uppercase bg-[#df3b28] px-3 py-1 rounded-xs shadow-md">
                          {activeSection.posterOverlay.word}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-200 bg-black/70 px-2.5 py-1 rounded-xs border border-white/10">
                          Active Floor View
                        </span>
                      </div>
                      <span className="text-xs font-mono text-white/90 mt-2 font-medium">
                        {activeSection.posterOverlay.sub}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* 4-Metric Full-Width Industrial KPI Grid */}
              <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div className="bg-[#05130b] p-4 rounded-xs border border-white/10">
                  <div className="flex items-center gap-1.5 text-white/50 mb-1.5">
                    <Gauge className="h-4 w-4 text-emerald-400" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Daily Output</span>
                  </div>
                  <span className="font-black text-white text-base sm:text-lg block">{activeSection.dailyCapacity}</span>
                </div>

                <div className="bg-[#05130b] p-4 rounded-xs border border-white/10">
                  <div className="flex items-center gap-1.5 text-white/50 mb-1.5">
                    <Clock3 className="h-4 w-4 text-emerald-400" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Sampling Strike</span>
                  </div>
                  <span className="font-black text-emerald-400 text-base sm:text-lg block">{activeSection.turnaround}</span>
                </div>

                <div className="bg-[#05130b] p-4 rounded-xs border border-white/10">
                  <div className="flex items-center gap-1.5 text-white/50 mb-1.5">
                    <Workflow className="h-4 w-4 text-emerald-400" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Bulk Lead Time</span>
                  </div>
                  <span className="font-black text-white text-base sm:text-lg block">{activeSection.leadTime}</span>
                </div>

                <div className="bg-[#05130b] p-4 rounded-xs border border-white/10">
                  <div className="flex items-center gap-1.5 text-white/50 mb-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#df3b28]" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Min Order (MOQ)</span>
                  </div>
                  <span className="font-black text-[#df3b28] text-base sm:text-lg block">{activeSection.minOrder}</span>
                </div>
              </div>
            </div>

            {/* 2. Sub-Tab Switcher Navigation */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <button
                onClick={() => setActiveViewTab('works')}
                className={`px-4 py-2.5 rounded-xs text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeViewTab === 'works'
                    ? 'bg-[#df3b28] text-white shadow-md'
                    : 'bg-[#081b12] text-white/70 hover:text-white border border-white/10'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Specialized Works ({activeSection.worksDone.length})</span>
              </button>

              <button
                onClick={() => setActiveViewTab('machinery')}
                className={`px-4 py-2.5 rounded-xs text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeViewTab === 'machinery'
                    ? 'bg-[#df3b28] text-white shadow-md'
                    : 'bg-[#081b12] text-white/70 hover:text-white border border-white/10'
                }`}
              >
                <Cpu className="h-3.5 w-3.5" />
                <span>Industrial Machinery ({activeSection.machinery.length})</span>
              </button>

              <button
                onClick={() => setActiveViewTab('materials')}
                className={`px-4 py-2.5 rounded-xs text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeViewTab === 'materials'
                    ? 'bg-[#df3b28] text-white shadow-md'
                    : 'bg-[#081b12] text-white/70 hover:text-white border border-white/10'
                }`}
              >
                <Shirt className="h-3.5 w-3.5" />
                <span>Fabrics & Lab QC</span>
              </button>
            </div>

            {/* 3. Tab Contents */}
            {activeViewTab === 'works' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-3.5 w-3.5 rounded-xs bg-[#df3b28]" />
                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                      Specialized Works & Operations Executed In This Section:
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-emerald-400 font-bold bg-[#081b12] px-3 py-1 rounded-xs border border-white/10">
                    {activeSection.worksDone.length} Operations Executed
                  </span>
                </div>

                {/* Full-width 2-column large cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {activeSection.worksDone.map((work, idx) => (
                    <div
                      key={idx}
                      className="bg-[#081b12] border border-white/10 rounded-sm p-5 hover:border-emerald-400/60 hover:shadow-xl transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                          <span className="text-[#df3b28] font-black text-sm px-2.5 py-0.5 rounded-xs bg-black/50 border border-white/10">
                            0{idx + 1}
                          </span>
                          {work.highlight && (
                            <span className="text-[10px] font-bold bg-[#bee7d2] text-[#0e2a1d] px-2.5 py-0.5 rounded-xs shadow-xs">
                              {work.highlight}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base sm:text-lg font-black text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                          {work.name}
                        </h4>
                        
                        <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 leading-relaxed">
                          {work.desc}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-emerald-400/90">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          <span>{work.specMetric || 'Export Grade Quality'}</span>
                        </span>
                        <span className="text-[10px] font-bold text-white/50 group-hover:text-emerald-300">
                          Standard Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeViewTab === 'machinery' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                    Deployed Machinery & Plant Industrial Hardware:
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeSection.machinery.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3.5 p-4 rounded-xs bg-[#081b12] border border-white/10 text-xs sm:text-sm text-emerald-100/90 hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="h-6 w-6 rounded-full bg-[#df3b28]/20 border border-[#df3b28]/40 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3.5 w-3.5 text-[#df3b28]" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">{m}</span>
                        <span className="text-[10px] font-mono text-emerald-400/75 mt-1 block">
                          Operational Active Line // Calibrated Standard
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeViewTab === 'materials' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-[#081b12] border border-white/10 rounded-sm">
                  <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 block mb-4 font-bold flex items-center gap-2">
                    <Shirt className="h-4 w-4" />
                    Supported Fabrics & Substrates
                  </span>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-100/85 font-medium">
                    {activeSection.materialsSupported.map((mat, i) => (
                      <li key={i} className="flex items-center gap-2.5 p-2.5 rounded-xs bg-[#05130b] border border-white/5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>{mat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-[#081b12] border border-white/10 rounded-sm">
                  <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 block mb-4 font-bold flex items-center gap-2">
                    <Award className="h-4 w-4 text-[#df3b28]" />
                    Testing Protocols & Durability Audits
                  </span>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-100/85 font-medium">
                    {activeSection.qualityChecks.map((qc, i) => (
                      <li key={i} className="flex items-center gap-2.5 p-2.5 rounded-xs bg-[#05130b] border border-white/5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#df3b28]" />
                        <span>{qc}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block mb-2">
                      Accredited Quality Certifications:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeSection.certifications.map((cert, ci) => (
                        <span key={ci} className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-xs">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Direct Section Order / Inquiry Banner */}
            <div className="p-8 bg-gradient-to-r from-[#113824] to-[#081b12] border border-emerald-500/40 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#df3b28] font-bold block mb-1">
                  Direct Plant Booking & Sampling Slot
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                  Order or Sample with {activeSection.title}
                </h4>
                <p className="text-xs sm:text-sm text-emerald-200/75 mt-1">
                  Same-day quotation & 24-48 hour pre-production sample strike-off.
                </p>
              </div>

              <div className="flex items-center gap-3.5 w-full sm:w-auto shrink-0">
                <a
                  href="tel:+8801818724417"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/20 transition-all flex-1 sm:flex-initial cursor-pointer"
                >
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <span>+8801818724417</span>
                </a>

                <a
                  href={`mailto:zmprinting02@gmail.com?subject=Work Inquiry for Section: ${activeSection.title}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-[#df3b28] hover:bg-[#c93220] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all flex-1 sm:flex-initial cursor-pointer"
                >
                  <span>Request Quote</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 5. UNIFIED PUBLIC FOOTER ────────────────────────────────────────── */}
      <PublicFooter />
    </div>
  );
}
