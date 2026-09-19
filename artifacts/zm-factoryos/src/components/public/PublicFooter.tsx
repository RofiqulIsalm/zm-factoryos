import React from 'react';
import { Link } from 'wouter';
import { Mail, Phone, Globe, ChevronRight, Lock, MapPin } from 'lucide-react';

export function PublicFooter() {
  const scrollTo = (id: string) => {
    // If on another page, navigate to /#id
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full">
      {/* ── Top Main Footer (Pale Mint Green matching factory website screenshot) ── */}
      <div className="bg-[#bee7d2] text-[#0e2a1d] py-14 px-6 md:px-10 border-t border-[#0e2a1d]/15">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* Column 1: Brand & Social Media (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-[#df3b28] text-white font-black text-base shadow-xs mt-0.5">
                ZM
              </div>
              <div>
                <h3 className="text-base font-black tracking-tight text-[#0e2a1d]">
                  ZM Printing & Design Ltd.
                </h3>
                <p className="text-xs text-[#0e2a1d]/80 font-medium leading-relaxed mt-1">
                  One Stop Solution of all kind garments printing & accessories
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0e2a1d] mb-3">
                Social Media
              </h4>
              <div className="flex items-center gap-2">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-xs bg-[#3b5998] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                  aria-label="Facebook"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.592 0 9 1.592 9 4.667V8z"/>
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-xs bg-[#00acee] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                  aria-label="Twitter"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-xs bg-[#0072b1] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                  aria-label="LinkedIn"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                </a>

                {/* Google+ / Contact */}
                <a
                  href="mailto:zmprinting02@gmail.com"
                  className="h-8 w-8 rounded-xs bg-[#dd4b39] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                  aria-label="Email Us"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm17 0h-2v-2h-2v2h-2v2h2v2h2v-2h2z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Useful Links (Col 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-black text-[#0e2a1d] mb-4 tracking-tight">
              Useful Links
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-[#0e2a1d]/85">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('about')}
                  className="hover:text-[#df3b28] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-[#0e2a1d]/60" />
                  <span>About Us</span>
                </button>
              </li>
              <li>
                <Link
                  href="/sections"
                  className="hover:text-[#df3b28] transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-[#0e2a1d]/60" />
                  <span>Factory Sections</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="hover:text-[#df3b28] transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-[#0e2a1d]/60" />
                  <span>Gallery</span>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('clients')}
                  className="hover:text-[#df3b28] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-[#0e2a1d]/60" />
                  <span>Our Client</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('blog')}
                  className="hover:text-[#df3b28] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-[#0e2a1d]/60" />
                  <span>Blog</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('contact')}
                  className="hover:text-[#df3b28] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-[#0e2a1d]/60" />
                  <span>Contact Us</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Office Location (Col 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-black text-[#0e2a1d] mb-4 tracking-tight">
              Office Location
            </h4>
            <div className="text-xs text-[#0e2a1d]/85 space-y-2 leading-relaxed font-medium">
              <p className="font-bold text-[#0e2a1d] flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#df3b28]" />
                Unit : 01
              </p>
              <p className="pl-5">
                South Gazirchat, Ashulia,
                <br />
                Savar, Dhaka-1349, Bangladesh
              </p>
            </div>
          </div>

          {/* Column 4: Contact Us (Col 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-black text-[#0e2a1d] mb-4 tracking-tight">
              Contact Us
            </h4>
            <div className="space-y-2.5 text-xs text-[#0e2a1d]/90 font-mono">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#0e2a1d]/70 shrink-0" />
                <a href="mailto:info@zmprintingbd.com" className="hover:text-[#df3b28] transition-colors truncate">
                  info@zmprintingbd.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#0e2a1d]/70 shrink-0" />
                <a href="mailto:zmprinting02@gmail.com" className="hover:text-[#df3b28] transition-colors truncate">
                  zmprinting02@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#0e2a1d]/70 shrink-0" />
                <a href="mailto:zilani@zmprintingbd.com" className="hover:text-[#df3b28] transition-colors truncate">
                  zilani@zmprintingbd.com
                </a>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Phone className="h-3.5 w-3.5 text-[#0e2a1d]/70 shrink-0" />
                <a href="tel:+8801818724417" className="hover:text-[#df3b28] transition-colors font-bold">
                  +88 01818724417
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#0e2a1d]/70 shrink-0" />
                <a href="tel:+8801322881470" className="hover:text-[#df3b28] transition-colors font-bold">
                  +88 01322881470
                </a>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Globe className="h-3.5 w-3.5 text-[#0e2a1d]/70 shrink-0" />
                <a href="http://zmprintingbd.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#df3b28] transition-colors">
                  zmprintingbd.com
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Strip (Deep Forest Green matching screenshot) ─────────────── */}
      <div className="bg-[#0b2217] text-white/80 py-4 px-6 md:px-10 border-t border-black/20 text-xs font-sans">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-white/85">
            © 2026 All Rights Reserved by ZM Printing & Design Ltd. | <span className="text-white/60">Powered by Uttara Infotech</span>
          </p>

          <div className="flex items-center gap-5 text-xs">
            <Link
              href="/sign-in"
              className="text-emerald-300 hover:text-white inline-flex items-center gap-1 font-bold"
            >
              <Lock className="h-3 w-3 text-[#df3b28]" />
              <span>FactoryOS Internal Login</span>
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-emerald-300 transition-colors cursor-pointer text-white/60"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
