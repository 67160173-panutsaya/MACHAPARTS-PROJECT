import { useState } from 'react';
import { X, Star, ShoppingCart, Shield, Truck, Check, Minus, Plus } from 'lucide-react';
import type { Part } from '@/lib/supabase';
import { useCart } from '@/lib/cart';

type ProductDetailProps = {
  part: Part;
  onClose: () => void;
};

export default function ProductDetail({ part, onClose }: ProductDetailProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const discount = part.compare_at_price
    ? Math.round(((part.compare_at_price - part.price) / part.compare_at_price) * 100)
    : 0;

  const handleAdd = () => {
    addItem(part, qty);
    setAdded(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-64 md:h-full min-h-[300px] overflow-hidden bg-slate-800 rounded-l-2xl">
            <img src={part.image_url} alt={part.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
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
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col">
            <p className="mb-1 text-sm font-medium text-blue-400">
              แบรนด์/แหล่งที่มา: {part.brand}
            </p>
            <h2 className="text-white font-bold text-xl mb-2">{part.name}</h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(part.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-slate-400 text-sm">
                {part.rating} ({part.review_count} รีวิว)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-4">
              <span className="text-white font-bold text-3xl">฿{part.price.toLocaleString()}</span>
              {part.compare_at_price && (
                <span className="text-slate-500 text-lg line-through">
                  ฿{part.compare_at_price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Compatibility */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 mb-4">
              <p className="text-slate-400 text-xs mb-1">รถที่รองรับ</p>
              <p className="text-white text-sm font-medium">{part.compatibility}</p>
            </div>

            {/* Description */}
            <p className="text-slate-300 text-sm leading-relaxed mb-5">{part.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-5">
              <div
                className={`w-2 h-2 rounded-full ${
                  part.stock_status === 'พร้อมส่ง' ? 'bg-green-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  part.stock_status === 'พร้อมส่ง' ? 'text-green-400' : 'text-amber-400'
                }`}
              >
                {part.stock_status}
              </span>
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-slate-400 text-sm">จำนวน:</span>
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-white text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl transition-all duration-200 mb-4 ${
                added
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-600/25'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  เพิ่มลงตะกร้าแล้ว
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  ใส่ตะกร้า
                </>
              )}
            </button>

            {/* Trust */}
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-green-400" />
                รับประกันของแท้
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                ส่งฟรีทั่วประเทศ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
