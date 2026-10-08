import { Star, ShoppingCart, Eye, Loader2, PackageX } from 'lucide-react';
import type { Part } from '@/lib/supabase';
import { useCart } from '@/lib/cart';

type ProductCardProps = {
  part: Part;
  onQuickView: (part: Part) => void;
};

export default function ProductCard({ part, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const discount = part.compare_at_price
    ? Math.round(((part.compare_at_price - part.price) / part.compare_at_price) * 100)
    : 0;

  return (
    <div className="group relative bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-800">
        <img
          src={part.image_url}
          alt={part.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {part.badge && (
            <span className="bg-blue-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
              {part.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
              -{discount}%
            </span>
          )}
        </div>
        {/* Quick view button */}
        <button
          onClick={() => onQuickView(part)}
          className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100"
          aria-label="ดูเพิ่มเติม"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="mb-1 text-xs font-medium text-blue-400">
          แบรนด์/แหล่งที่มา: {part.brand}
        </p>
        <h3
          className="text-white font-semibold text-sm mb-1.5 line-clamp-2 cursor-pointer hover:text-blue-300 transition-colors"
          onClick={() => onQuickView(part)}
        >
          {part.name}
        </h3>
        <p className="text-slate-500 text-xs mb-3 line-clamp-1">{part.compatibility}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.round(part.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="text-slate-500 text-xs">({part.review_count})</span>
        </div>

        {/* Price + stock */}
        <div className="mt-auto">
          <div className="flex items-end gap-2 mb-1">
            <span className="text-white font-bold text-lg">฿{part.price.toLocaleString()}</span>
            {part.compare_at_price && (
              <span className="text-slate-500 text-sm line-through">
                ฿{part.compare_at_price.toLocaleString()}
              </span>
            )}
          </div>
          <p
            className={`text-xs mb-3 ${
              part.stock_status === 'พร้อมส่ง' ? 'text-green-400' : 'text-amber-400'
            }`}
          >
            ● {part.stock_status}
          </p>

          {/* Add to cart */}
          <button
            onClick={() => addItem(part)}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 border border-slate-700 hover:border-transparent"
          >
            <ShoppingCart className="w-4 h-4" />
            ใส่ตะกร้า
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="h-44 bg-slate-800 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-3 w-1/3 bg-slate-800 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-slate-800 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-slate-800 rounded animate-pulse" />
            <div className="h-9 bg-slate-800 rounded-xl animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyResults() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
        <PackageX className="w-8 h-8 text-slate-500" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">ไม่พบสินค้าที่ค้นหา</h3>
      <p className="text-slate-400 text-sm">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
    </div>
  );
}

export function ProductGridLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
    </div>
  );
}
