import { useState } from 'react';
import { X, Check, CreditCard, Truck, MapPin, User, Phone, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/cart';

type CheckoutModalProps = {
  onClose: () => void;
};

export default function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { items, subtotal, clearCart, closeCart } = useCart();
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = subtotal > 1500 ? 0 : 60;
  const total = subtotal + shipping;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'กรุณากรอกชื่อ';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 9) e.phone = 'เบอร์ไม่ถูกต้อง';
    if (!form.address.trim()) e.address = 'กรุณากรอกที่อยู่';
    if (!form.city.trim()) e.city = 'กรุณากรอกเขต/อำเภอ';
    if (!form.postalCode.trim() || form.postalCode.length !== 5) e.postalCode = 'รหัสไปรษณีย์ 5 หลัก';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      clearCart();
    }, 1800);
  };

  const handleClose = () => {
    onClose();
    closeCart();
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={handleClose}>
        <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-8 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-white font-bold text-xl mb-2">สั่งซื้อสำเร็จ!</h2>
          <p className="text-slate-400 text-sm mb-6">
            ขอบคุณที่ใช้บริการ ทีมงานจะติดต่อยืนยันออเดอร์ภายใน 24 ชั่วโมง
          </p>
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 mb-6">
            <p className="text-slate-400 text-xs">หมายเลขคำสั่งซื้อ</p>
            <p className="text-white font-bold text-lg">
              #PH{Math.floor(Math.random() * 900000 + 100000)}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3.5 rounded-xl transition-all"
          >
            กลับหน้าร้าน
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={handleClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <h2 className="text-white font-bold text-lg">ยืนยันคำสั่งซื้อ</h2>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'processing' ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin mb-4" />
            <p className="text-slate-400 text-sm">กำลังดำเนินการ...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {/* Items summary */}
            <div className="mb-6">
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3">
                สินค้าในตะกร้า ({items.length} รายการ)
              </h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs line-clamp-1">{item.name}</p>
                      <p className="text-slate-500 text-xs">x{item.quantity}</p>
                    </div>
                    <span className="text-white text-xs font-semibold">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping form */}
            <div className="space-y-4 mb-6">
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> ที่อยู่จัดส่ง
              </h3>

              <div>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="ชื่อ-นามสกุล"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 text-white placeholder-slate-500 text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-colors"
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>}
              </div>

              <div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    placeholder="เบอร์โทรศัพท์"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 text-white placeholder-slate-500 text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-colors"
                  />
                </div>
                {errors.phone && <p className="text-red-400 text-xs mt-1 ml-1">{errors.phone}</p>}
              </div>

              <div>
                <textarea
                  placeholder="ที่อยู่บ้านเลขที่ ถนน ตำบล"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 text-white placeholder-slate-500 text-sm rounded-xl px-4 py-3 outline-none transition-colors resize-none"
                />
                {errors.address && <p className="text-red-400 text-xs mt-1 ml-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="เขต/อำเภอ"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 text-white placeholder-slate-500 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
                  />
                  {errors.city && <p className="text-red-400 text-xs mt-1 ml-1">{errors.city}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="รหัสไปรษณีย์"
                    maxLength={5}
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 text-white placeholder-slate-500 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
                  />
                  {errors.postalCode && <p className="text-red-400 text-xs mt-1 ml-1">{errors.postalCode}</p>}
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="mb-6">
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" /> วิธีการชำระเงิน
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 bg-slate-800 border border-blue-500/40 rounded-xl px-4 py-3 cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="accent-blue-500" />
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm font-medium">เก็บเงินปลายทาง (COD)</span>
                </label>
                <label className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 cursor-pointer opacity-60">
                  <input type="radio" name="payment" disabled className="accent-blue-500" />
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400 text-sm">โอนผ่าน PromptPay (เร็ว ๆ นี้)</span>
                </label>
              </div>
            </div>

            {/* Total */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mb-5 space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>ยอดสินค้า</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>ค่าจัดส่ง</span>
                <span>{shipping === 0 ? 'ฟรี' : `฿${shipping}`}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                <span className="text-white font-semibold">รวมทั้งหมด</span>
                <span className="text-white font-bold text-xl">฿{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25"
            >
              ยืนยันคำสั่งซื้อ
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
