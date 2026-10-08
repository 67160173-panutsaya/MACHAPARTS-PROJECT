import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';
import CheckoutModal from '@/components/CheckoutModal';
import { useState } from 'react';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 60;
  const total = subtotal + shipping;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[56] w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            <h2 className="text-white font-bold text-lg">ตะกร้าสินค้า</h2>
            {totalItems > 0 && (
              <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-white font-semibold mb-1">ตะกร้ายังว่าง</h3>
              <p className="text-slate-400 text-sm">เพิ่มสินค้าเพื่อเริ่มสั่งซื้อ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-slate-800/50 border border-slate-700/50 rounded-xl p-3"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-blue-400 text-xs">{item.brand}</p>
                    <h4 className="text-white text-sm font-semibold line-clamp-1">{item.name}</h4>
                    <p className="text-white font-bold text-sm mt-1">
                      ฿{item.price.toLocaleString()}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity */}
                      <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-white text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="border-t border-slate-800 px-5 py-4 space-y-3">
            <div className="flex justify-between text-sm text-slate-400">
              <span>ยอดสินค้า</span>
              <span>฿{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-400">
              <span>ค่าจัดส่ง</span>
              <span>{shipping === 0 ? 'ฟรี' : `฿${shipping}`}</span>
            </div>
            {subtotal > 0 && subtotal < 1500 && (
              <p className="text-amber-400 text-xs">
                ซื้อเพิ่ม ฿{(1500 - subtotal).toLocaleString()} เพื่อรับส่งฟรี
              </p>
            )}
            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <span className="text-white font-semibold">รวมทั้งหมด</span>
              <span className="text-white font-bold text-xl">฿{total.toLocaleString()}</span>
            </div>
            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25"
            >
              ดำเนินการสั่งซื้อ
            </button>
          </div>
        )}
      </aside>

      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </>
  );
}
