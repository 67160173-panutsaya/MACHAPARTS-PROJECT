import { BadgeCheck, Truck, ShieldCheck, Headphones, CreditCard, Wrench } from 'lucide-react';

const reasons = [
  {
    icon: BadgeCheck,
    title: 'อะไหล่แท้รับประกัน',
    description: 'นำเข้าและจัดจำหน่ายโดยตรงจากผู้ผลิตและแบรนด์ชั้นนำ ทุกชิ้นรับประกันคุณภาพ',
  },
  {
    icon: Truck,
    title: 'ส่งฟรีทั่วประเทศ',
    description: 'ฟรีค่าจัดส่งเมื่อสั่งซื้อครบ 1,500 บาท พร้อมติดตามพัสดุแบบเรียลไทม์',
  },
  {
    icon: ShieldCheck,
    title: 'คืนเงินภายใน 7 วัน',
    description: 'ไม่พอใจหรือสั่งผิดรุ่น คืนสินค้าและรับเงินคืนเต็มจำนวนภายใน 7 วัน',
  },
  {
    icon: Headphones,
    title: 'ที่ปรึกษาโดยช่างผู้เชี่ยวชาญ',
    description: 'มีคำถามเรื่องความเข้ากันของชิ้นส่วน? ทีมช่างของเราพร้อมตอบทุกข้อสงสัย',
  },
  {
    icon: CreditCard,
    title: 'ชำระง่ายหลายช่องทาง',
    description: 'รองรับการชำระเงินปลายทาง PromptPay และบัตรเครดิตทุกธนาคาร',
  },
  {
    icon: Wrench,
    title: 'แนะนำช่างติดตั้ง',
    description: 'เชื่อมต่อกับร้านซ่อมพันธมิตรที่ผ่านการรับรองทั่วประเทศ ใกล้บ้านคุณ',
  },
];

export default function Features() {
  return (
    <section id="why-us" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-4 py-1.5 mb-4">
            <BadgeCheck className="w-4 h-4 text-green-400" />
            <span className="text-slate-300 text-xs font-semibold tracking-wide uppercase">
              ทำไมต้องเรา
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            ซื้ออะไหล่ออนไลน์อย่างมั่นใจ
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            เราใส่ใจในทุกขั้นตอน ตั้งแต่การคัดสรรสินค้าจนถึงการบริการหลังการขาย
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.title}
                className="group bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{r.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{r.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
