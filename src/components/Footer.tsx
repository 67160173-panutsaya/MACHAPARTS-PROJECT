import { useState } from 'react';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import CustomerServiceModal, { type CustomerServiceTopic } from '@/components/CustomerServiceModal';

const links = {
  หมวดหมู่สินค้า: ['ระบบเบรก', 'เครื่องยนต์', 'น้ำมันและของเหลว', 'ระบบไฟฟ้า', 'ภายนอกรถ'],
  บริการลูกค้า: ['ติดตามพัสดุ', 'นโยบายคืนสินค้า', 'คำถามที่พบบ่อย', 'ติดต่อช่าง', 'รับประกันสินค้า'],
  เกี่ยวกับเรา: ['เรื่องราวของเรา', 'ร่วมงานกับเรา', 'พันธมิตรธุรกิจ', 'ข่าวสาร', 'ติดต่อเรา'],
};

const customerServiceTopics: Record<string, CustomerServiceTopic> = {
  ติดตามพัสดุ: 'tracking',
  นโยบายคืนสินค้า: 'returns',
  คำถามที่พบบ่อย: 'faq',
  ติดต่อช่าง: 'mechanic',
  รับประกันสินค้า: 'warranty',
};

export default function Footer() {
  const [activeService, setActiveService] = useState<CustomerServiceTopic | null>(null);

  return (
    <>
    <footer id="footer" className="bg-slate-950 border-t border-slate-800">
      {/* Newsletter */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 border-b border-slate-800">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-bold text-xl mb-2">รับส่วนลด 200 บาทสำหรับการซื้อแรก</h3>
            <p className="text-slate-400 text-sm">สมัครรับข่าวสารและโปรโมชันพิเศษจากเรา</p>
          </div>
          <div className="flex gap-2 w-full lg:w-auto">
            <input
              type="email"
              placeholder="อีเมลของคุณ"
              className="flex-1 lg:w-72 bg-slate-800 border border-slate-700 focus:border-blue-500 text-white placeholder-slate-500 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
            />
            <button className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold px-5 py-3 rounded-xl transition-all flex-shrink-0">
              สมัคร
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src={`${import.meta.env.BASE_URL}machaparts-logo.png`}
                alt="MACHAPARTS"
                className="w-12 h-12 object-contain"
              />
              <span className="text-white font-extrabold text-xl tracking-wide">MACHAPARTS</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              ตลาดอะไหล่รถยนต์ออนไลน์ที่ใหญ่ที่สุดในไทย ส่งตรงจากผู้ผลิตถึงมือคุณ
              พร้อมรับประกันของแท้และบริการหลังการขายที่ดีที่สุด
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>ติดต่อทีมงาน MACHAPARTS</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>02-xxx-xxxx (จ–อา 8:00–20:00)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>กรุงเทพมหานคร, ประเทศไทย</span>
              </div>
            </div>

            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 text-xs font-bold"
              >
                LINE
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    {category === 'บริการลูกค้า' ? (
                      <button
                        className="text-left text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                        onClick={() => setActiveService(customerServiceTopics[item])}
                        type="button"
                      >
                        {item}
                      </button>
                    ) : (
                      <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                        {item}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            © 2026 MACHAPARTS สงวนลิขสิทธิ์ทุกประการ
          </p>
          <div className="flex gap-5">
            {['นโยบายความเป็นส่วนตัว', 'ข้อกำหนดการใช้งาน', 'นโยบาม Cookie'].map((l) => (
              <a key={l} href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
    {activeService && (
      <CustomerServiceModal
        key={activeService}
        onClose={() => setActiveService(null)}
        topic={activeService}
      />
    )}
    </>
  );
}
