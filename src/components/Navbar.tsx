import { useState, useEffect } from 'react';
import { Menu, X, Search, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart';

type NavbarProps = {
  searchQuery: string;
  onSearchChange: (q: string) => void;
};

export default function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { label: 'หมวดหมู่', href: '#categories' },
    { label: 'เช็คสภาพรถ', href: '#vehicle-check' },
    { label: 'สินค้าขายดี', href: '#featured' },
    { label: 'ทำไมต้องเรา', href: '#why-us' },
    { label: 'ติดต่อ', href: '#footer' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-slate-950/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group flex-shrink-0">
            <img
              src="/machaparts-logo.png"
              alt=""
              className="w-11 h-11 object-contain transition-transform group-hover:scale-105"
            />
            <div className="leading-tight hidden sm:block">
              <span className="text-white font-extrabold text-lg tracking-wide">MACHAPARTS</span>
            </div>
          </a>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ค้นหาอะไหล่ แบรนด์ หรือรุ่นรถ..."
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-blue-500 text-white placeholder-slate-500 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 flex-shrink-0">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors flex-shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">ตะกร้า</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-slate-300 hover:text-white transition-colors p-1"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ค้นหาอะไหล่..."
              className="w-full bg-slate-800/80 border border-slate-700 focus:border-blue-500 text-white placeholder-slate-500 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-slate-900/98 backdrop-blur-md border-t border-slate-800 px-6 pb-6 pt-4">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors py-1"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
